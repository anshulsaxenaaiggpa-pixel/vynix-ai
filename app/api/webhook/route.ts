import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, subscriptions, transactions, affiliates, affiliateCommissions, creditHistory } from '@/db/schema';
import { verifyWebhookSignature, processWebhookEvent, calculateCommission, PLANS } from '@/lib/razorpay';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        // Get raw body for signature verification
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const isValid = verifyWebhookSignature(body, signature, webhookSecret);

        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse event
        const event = JSON.parse(body);
        const processedEvent = await processWebhookEvent(event);

        console.log('Webhook event:', processedEvent);

        // Handle different event types
        switch (processedEvent.type) {
            case 'subscription_charged': {
                // Payment successful - add credits
                const { subscriptionId, paymentId, amount } = processedEvent;

                // Find subscription
                const subscription = await db.query.subscriptions.findFirst({
                    where: eq(subscriptions.razorpaySubscriptionId, subscriptionId),
                });

                if (!subscription) {
                    console.error('Subscription not found:', subscriptionId);
                    return NextResponse.json({ received: true });
                }

                // Get user
                const user = await db.query.users.findFirst({
                    where: eq(users.id, subscription.userId),
                });

                if (!user) {
                    console.error('User not found:', subscription.userId);
                    return NextResponse.json({ received: true });
                }

                // Determine credits based on plan
                const planCredits = PLANS[subscription.plan as 'pro' | 'elite'].credits;

                // Add credits to user
                await db.update(users)
                    .set({
                        credits: user.credits + planCredits,
                        plan: subscription.plan,
                    })
                    .where(eq(users.id, user.id));

                // Create transaction record
                const transactionResult = await db.insert(transactions).values({
                    userId: user.id,
                    subscriptionId: subscription.id,
                    razorpayPaymentId: paymentId,
                    type: 'subscription',
                    amount,
                    currency: 'USD',
                    status: 'success',
                    metadata: { event: 'subscription_charged' },
                }).returning();

                const transaction = transactionResult[0];
                if (!transaction) {
                    console.error('Failed to create transaction record');
                    return NextResponse.json({ received: true });
                }

                // Create credit history record
                await db.insert(creditHistory).values({
                    userId: user.id,
                    amount: planCredits,
                    balance: user.credits + planCredits,
                    type: 'subscription_renewal',
                    description: `${subscription.plan.toUpperCase()} plan renewal - ${planCredits} credits added`,
                });

                // Handle affiliate commission if user was referred
                if (user.referredBy) {
                    const referrer = await db.query.users.findFirst({
                        where: eq(users.affiliateCode, user.referredBy),
                    });

                    if (referrer) {
                        const referrerAffiliate = await db.query.affiliates.findFirst({
                            where: eq(affiliates.userId, referrer.id),
                        });

                        if (referrerAffiliate) {
                            // Calculate commission (20% of payment)
                            const commissionAmount = calculateCommission(amount);

                            // Create commission record
                            await db.insert(affiliateCommissions).values({
                                affiliateId: referrerAffiliate.id,
                                referredUserId: user.id,
                                transactionId: transaction.id,
                                amount: (commissionAmount / 100).toFixed(2), // Convert cents to dollars
                                currency: 'USD',
                                rate: '0.2000',
                                status: 'pending',
                            });

                            // Update affiliate stats
                            await db.update(affiliates)
                                .set({
                                    totalEarnings: (parseFloat(referrerAffiliate.totalEarnings) + commissionAmount / 100).toFixed(2),
                                    pendingPayout: (parseFloat(referrerAffiliate.pendingPayout) + commissionAmount / 100).toFixed(2),
                                    activeReferrals: referrerAffiliate.activeReferrals + 1,
                                })
                                .where(eq(affiliates.id, referrerAffiliate.id));
                        }
                    }
                }

                break;
            }

            case 'subscription_activated': {
                const { subscriptionId } = processedEvent;

                // Update subscription status
                await db.update(subscriptions)
                    .set({ status: 'active' })
                    .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId));

                break;
            }

            case 'subscription_cancelled': {
                const { subscriptionId } = processedEvent;

                // Update subscription status
                await db.update(subscriptions)
                    .set({
                        status: 'cancelled',
                        cancelAtPeriodEnd: true,
                    })
                    .where(eq(subscriptions.razorpaySubscriptionId, subscriptionId));

                break;
            }

            case 'payment_failed': {
                const { paymentId } = processedEvent;
                console.error('Payment failed:', paymentId);
                break;
            }

            default:
                console.log('Unhandled event type:', processedEvent.type);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
