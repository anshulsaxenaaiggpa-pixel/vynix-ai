import { NextRequest, NextResponse } from 'next/server';
import { client, checkoutNodeJssdk } from '@/lib/paypal';
import { calculateTax } from '@/lib/tax';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        if (!token) throw new Error('Unauthorized');

        const session = await verifyToken(token);
        if (!session) throw new Error('Invalid token');

        const { plan, affiliateCode } = await req.json(); // USD is implied for PayPal

        // Pricing Config (USD)
        // Ideally this should be centralized
        const pricing = {
            pro: 4.99,
            elite: 19.99
        };

        const basePrice = pricing[plan as keyof typeof pricing];
        if (!basePrice) throw new Error('Invalid Plan');

        // Tax Calculation
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const headerCountry = req.headers.get('x-vercel-ip-country') || undefined;

        // PayPal is USD only per requirement
        const taxResult = await calculateTax(ip, basePrice, 'USD', headerCountry);

        const totalAmount = basePrice + taxResult.taxAmount;

        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: totalAmount.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: basePrice.toFixed(2)
                        },
                        tax_total: {
                            currency_code: 'USD',
                            value: taxResult.taxAmount.toFixed(2)
                        }
                    }
                },
                description: `Vynix AI ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                custom_id: JSON.stringify({
                    userId: session.id,
                    plan,
                    affiliateCode,
                    taxLabel: taxResult.label
                })
            }]
        });

        const order = await client.execute(request);

        return NextResponse.json({
            orderID: order.result.id,
            total: totalAmount,
            tax: taxResult
        });

    } catch (error: any) {
        console.error('PayPal Create Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
