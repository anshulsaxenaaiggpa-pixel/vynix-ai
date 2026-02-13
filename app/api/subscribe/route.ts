import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, subscriptions, transactions } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { createSubscription, PLANS } from '@/lib/razorpay';
import { calculateTax } from '@/lib/tax';
import { eq } from 'drizzle-orm';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
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

        const body = await req.json();
        const { plan: planInput, affiliateCode, currency = 'USD' } = body;

        // Validate plan
        if (!planInput || (planInput !== 'pro' && planInput !== 'elite')) {
            return NextResponse.json(
                { error: 'Invalid plan. Must be "pro" or "elite"' },
                { status: 400 }
            );
        }

        const plan: 'pro' | 'elite' = planInput;
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

        // --- DUAL CURRENCY LOGIC ---

        // 1. Calculate Tax & Total
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

        // Base Price Definition (from Shared Config ideally)
        const pricing = {
            USD: { pro: 4.99, elite: 19.99 },
            INR: { pro: 415, elite: 1660 }
        };

        const basePrice = pricing[currency as 'USD' | 'INR'][plan];
        const headerCountry = req.headers.get('x-vercel-ip-country') || undefined;
        const taxResult = await calculateTax(ip, basePrice, currency as 'USD' | 'INR', headerCountry);

        const totalAmount = basePrice + taxResult.taxAmount;
        const amountInSmallestUnit = Math.round(totalAmount * 100); // cents or paise

        // 2. Create Razorpay Order (For both INR and USD if using Razorpay for Cards)
        // User Requirement: "Razorpay (Cards) + PayPal". 
        // If Currency is INR -> Razorpay is default.
        // If Currency is USD -> User might choose Razorpay (Cards) or PayPal.
        // This endpoint handles Razorpay. PayPal has its own endpoint.

        const orderOptions = {
            amount: amountInSmallestUnit,
            currency: currency,
            receipt: `receipt_${session.id.substring(0, 8)}_${Date.now()}`,
            notes: {
                plan,
                userId: session.id,
                affiliateCode: affiliateCode || '',
                taxLabel: taxResult.label,
                taxAmount: taxResult.taxAmount
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        return NextResponse.json({
            success: true,
            order_id: order.id,
            amount: totalAmount,
            currency: currency,
            key_id: process.env.RAZORPAY_KEY_ID,
            tax: taxResult
        });

    } catch (error: any) {
        console.error('Subscribe error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create subscription' },
            { status: 500 }
        );
    }
}
