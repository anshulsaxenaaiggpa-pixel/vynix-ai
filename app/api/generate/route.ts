import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, artifacts, creditHistory } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// Credit costs for different generation types
const CREDIT_COSTS = {
    video: 10, // per generation
    audio: 5,  // per generation
    music: 5,  // per generation
    lipsync: 8, // per generation
    voiceover: 3, // per generation
    image: 5, // per generation
    voice: 3, // per generation
    song: 5, // per generation
};

// Backend URL from environment
const BACKEND_URL = process.env.VYNIX_BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, prompt, settings } = body;

        // Validate type
        if (!type || !CREDIT_COSTS[type as keyof typeof CREDIT_COSTS]) {
            return NextResponse.json(
                { error: 'Invalid generation type. Must be: video, audio, music, lipsync, voiceover, image, voice, or song' },
                { status: 400 }
            );
        }

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Auth Logic
        const token = req.cookies.get('auth-token')?.value;
        let user = null;
        let isGuest = true;

        if (token) {
            const session = await verifyToken(token);
            if (session) {
                user = await db.query.users.findFirst({
                    where: eq(users.id, session.id),
                });
                if (user) isGuest = false;
            }
        }

        // GUEST FLOW
        if (isGuest) {
            // Call Backend directly (IP-based limits)
            try {
                // Determine backend params
                // Guests are always "Free" = true
                const backendResponse = await fetch(`${BACKEND_URL}/api/generate/${type}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: prompt.trim(),
                        user_id: "current_user_id", // Triggers IP check in backend
                        params: {
                            ...settings,
                            is_free: true
                        },
                    }),
                });

                const backendData = await backendResponse.json();

                if (!backendResponse.ok) {
                    // Pass through backend error (e.g. 402 Payment Required for credits)
                    return NextResponse.json(backendData, { status: backendResponse.status });
                }

                return NextResponse.json({
                    success: true,
                    // Mock artifact for frontend
                    artifact: {
                        id: backendData.job_id,
                        type: type,
                        status: 'processing',
                        creditsCost: 0,
                    },
                    remainingCredits: 0, // Guest doesn't see credits here
                });

            } catch (err: any) {
                console.error("Guest Generation Error:", err);
                return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
            }
        }

        // AUTHENTICATED USER FLOW
        const creditCost = CREDIT_COSTS[type as keyof typeof CREDIT_COSTS];
        if (user!.credits < creditCost) {
            return NextResponse.json(
                { error: `Insufficient credits. Need ${creditCost}, have ${user!.credits}` },
                { status: 402 }
            );
        }

        // Deduct credits
        await db.update(users)
            .set({ credits: user!.credits - creditCost })
            .where(eq(users.id, user!.id));

        // Create artifact record
        const artifactResult = await db.insert(artifacts).values({
            userId: user!.id,
            type,
            model: getModelForType(type),
            prompt: prompt.trim(),
            settings: settings || {},
            status: 'queued',
            creditsCost: creditCost,
        }).returning();

        const artifact = artifactResult[0];

        // Create credit history record
        await db.insert(creditHistory).values({
            userId: user!.id,
            amount: -creditCost,
            balance: user!.credits - creditCost,
            type: 'generation',
            generationType: type,
            artifactId: artifact.id,
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} generation - ${creditCost} credits`,
        });

        // Call backend API (Trusted Mode)
        try {
            const isFreePlan = user!.plan === 'Free';
            const backendResponse = await fetch(`${BACKEND_URL}/api/generate/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    user_id: user!.id,
                    params: {
                        ...settings,
                        service_secret: process.env.VYNIX_SERVICE_SECRET || 'vynix_internal_bypass_2026',
                        is_free: isFreePlan
                    },
                }),
            });

            if (!backendResponse.ok) {
                // If backend fails, log error. Ideally refund credits.
                console.error(`Backend error: ${backendResponse.statusText}`);
                throw new Error(`Backend error: ${backendResponse.statusText}`);
            }

            const backendData = await backendResponse.json();

            // Update artifact with backend job ID
            await db.update(artifacts)
                .set({
                    status: 'processing',
                    settings: { ...artifact.settings, backendJobId: backendData.job_id },
                })
                .where(eq(artifacts.id, artifact.id));

            // Start polling backend (fire and forget from client perspective)
            pollBackendJob(artifact.id, backendData.job_id);

        } catch (backendError) {
            console.error('Backend generation error:', backendError);
            // Mark artifact as failed
            await db.update(artifacts)
                .set({ status: 'failed', errorMessage: 'Backend service unavailable.' })
                .where(eq(artifacts.id, artifact.id));

            return NextResponse.json({
                success: false,
                error: 'AI generation service is currently unavailable',
                artifact: { id: artifact.id, status: 'failed' },
            }, { status: 503 });
        }

        return NextResponse.json({
            success: true,
            artifact: {
                id: artifact.id,
                type: artifact.type,
                status: 'processing',
                creditsCost: artifact.creditsCost,
            },
            remainingCredits: user!.credits - creditCost,
        });

    } catch (error) {
        console.error('Generate error:', error);
        return NextResponse.json(
            { error: 'Failed to queue generation' },
            { status: 500 }
        );
    }
}

// Helper function to get model name for type
function getModelForType(type: string): string {
    const models: Record<string, string> = {
        video: 'wan2.1',
        audio: 'stable-audio',
        music: 'musicgen',
        lipsync: 'sadtalker',
        voiceover: 'f5-tts',
        voice: 'speecht5',
        image: 'flux.1-dev',
        song: 'musicgen',
    };
    return models[type] || 'unknown';
}

// Poll backend job status and update artifact
async function pollBackendJob(artifactId: string, backendJobId: string) {
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/jobs/${backendJobId}`);

            if (!response.ok) {
                // If 404, maybe job isn't ready or lost.
                return;
            }

            const jobData = await response.json();

            if (jobData.status === 'complete') {
                // Update artifact with result
                await db.update(artifacts)
                    .set({
                        status: 'completed',
                        outputUrl: jobData.result_url,
                        // thumbnailUrl: jobData.thumbnail_url || null, // Optional if backend sends it
                        // duration: jobData.duration || null,
                        // fileSize: jobData.file_size || null,
                        completedAt: new Date(),
                    })
                    .where(eq(artifacts.id, artifactId));

                console.log(`✅ Generation completed for artifact ${artifactId}`);
                return;
            }

            if (jobData.status === 'failed') {
                // Mark as failed
                await db.update(artifacts)
                    .set({
                        status: 'failed',
                        errorMessage: jobData.error || 'Generation failed',
                    })
                    .where(eq(artifacts.id, artifactId));

                console.error(`❌ Generation failed for artifact ${artifactId}: ${jobData.error}`);
                return;
            }

            // Still processing
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(poll, 5000); // 5s poll
            } else {
                // Timeout
                await db.update(artifacts)
                    .set({ status: 'failed', errorMessage: 'Generation timeout' })
                    .where(eq(artifacts.id, artifactId));
            }

        } catch (error) {
            console.error('Polling error:', error);
            attempts++;
            if (attempts < maxAttempts) setTimeout(poll, 5000);
        }
    };

    // Start polling after 2 seconds
    setTimeout(poll, 2000);
}
