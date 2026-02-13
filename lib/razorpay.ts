import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Plan configurations
export const PLANS = {
  free: {
    name: 'Free Explorer',
    credits: 100,
    price: 0,
    features: ['100 credits/month', 'Watermarked outputs', 'Standard queue'],
  },
  pro: {
    name: 'Pro Creator',
    credits: 500,
    price: 999, // cents ($9.99)
    razorpayPlanId: 'plan_vynix_pro_monthly',
    features: ['500 credits/month', 'No watermarks', 'Priority queue', 'HD outputs'],
  },
  elite: {
    name: 'Elite Studio',
    credits: 2000,
    price: 1999, // cents ($19.99)
    razorpayPlanId: 'plan_vynix_elite_monthly',
    features: [
      '2000 credits/month',
      'Creative Director unlimited',
      'No watermarks',
      'Priority queue',
      '4K outputs',
      'API access',
    ],
  },
} as const;

// Create Razorpay subscription
export async function createSubscription(
  email: string,
  plan: 'pro' | 'elite',
  affiliateCode?: string
) {
  try {
    const planConfig = PLANS[plan];

    // Create customer
    const customer = await razorpay.customers.create({
      email,
      notes: {
        plan,
        affiliateCode: affiliateCode || '',
      },
    });

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planConfig.razorpayPlanId,
      total_count: 12, // 12 months
      quantity: 1,
      customer_notify: 1,
      notes: {
        email,
        affiliateCode: affiliateCode || 'none',
      },
    } as any); // Type assertion needed for Razorpay SDK,

    return {
      subscriptionId: subscription.id,
      customerId: customer.id,
      status: subscription.status,
    };
  } catch (error) {
    console.error('Razorpay subscription creation error:', error);
    throw new Error('Failed to create subscription');
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

// Process webhook events
export async function processWebhookEvent(event: any) {
  const eventType = event.event;
  const payload = event.payload;

  switch (eventType) {
    case 'subscription.charged':
      // Subscription payment successful
      return {
        type: 'subscription_charged',
        subscriptionId: payload.subscription.entity.id,
        paymentId: payload.payment.entity.id,
        amount: payload.payment.entity.amount,
      };

    case 'subscription.activated':
      // Subscription activated
      return {
        type: 'subscription_activated',
        subscriptionId: payload.subscription.entity.id,
      };

    case 'subscription.cancelled':
      // Subscription cancelled
      return {
        type: 'subscription_cancelled',
        subscriptionId: payload.subscription.entity.id,
      };

    case 'subscription.paused':
      return {
        type: 'subscription_paused',
        subscriptionId: payload.subscription.entity.id,
      };

    case 'payment.failed':
      return {
        type: 'payment_failed',
        paymentId: payload.payment.entity.id,
      };

    default:
      return { type: 'unknown', event: eventType };
  }
}

// Calculate affiliate commission
export function calculateCommission(
  amount: number,
  rate: number = parseFloat(process.env.AFFILIATE_COMMISSION_RATE || '0.20')
): number {
  return Math.round(amount * rate);
}

// Get subscription status
export async function getSubscriptionStatus(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    return {
      status: subscription.status,
      currentPeriodStart: subscription.current_start ? new Date(subscription.current_start * 1000) : null,
      currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
      chargeAt: subscription.charge_at ? new Date(subscription.charge_at * 1000) : null,
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    throw new Error('Failed to get subscription status');
  }
}
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtCycleEnd: boolean = true
) {
  try {
    const subscription = await (razorpay.subscriptions as any).cancel(subscriptionId, {
      cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
    });
    return subscription;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}
