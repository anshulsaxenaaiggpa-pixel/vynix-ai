import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, creditHistory } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
        // Get auth token from cookie
        const token = req.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify token
        const session = await verifyToken(token);
        if (!session) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get credit history (last 50 transactions)
        const history = await db.query.creditHistory.findMany({
            where: eq(creditHistory.userId, user.id),
            orderBy: [desc(creditHistory.createdAt)],
            limit: 50,
        });

        return NextResponse.json({
            success: true,
            credits: user.credits,
            plan: user.plan,
            history: history.map(h => ({
                id: h.id,
                amount: h.amount,
                balance: h.balance,
                type: h.type,
                generationType: h.generationType,
                description: h.description,
                createdAt: h.createdAt,
            })),
        });

    } catch (error) {
        console.error('Credits fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch credits' },
            { status: 500 }
        );
    }
}
