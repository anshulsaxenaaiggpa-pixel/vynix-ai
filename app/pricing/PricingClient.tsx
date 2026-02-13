'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PricingClientProps {
    initialCurrency: 'USD' | 'INR';
    countryCode: string;
}

export default function PricingClient({ initialCurrency, countryCode }: PricingClientProps) {
    const [currency, setCurrency] = useState<'USD' | 'INR'>(initialCurrency);
    const [selectedPlan, setSelectedPlan] = useState<'pro' | 'elite' | null>(null);
    const [taxData, setTaxData] = useState<{ label: string, amount: number, total: number } | null>(null);

    // Pricing Configuration
    const pricing = {
        USD: {
            pro: { price: 4.99, label: '$' },
            elite: { price: 19.99, label: '$' }
        },
        INR: {
            pro: { price: 415, label: '₹' }, // Approx $5
            elite: { price: 1660, label: '₹' } // Approx $20
        }
    };

    const displayPrice = (planType: 'pro' | 'elite') => {
        const { price, label } = pricing[currency][planType];
        return `${label}${price}`;
    };

    const handleSubscribe = async (planName: string) => {
        if (planName === 'Free Explorer') {
            alert('You are already on the free plan!');
            return;
        }
        const plan = planName.includes('Pro') ? 'pro' : 'elite';
        setSelectedPlan(plan);
        // Reset tax data when plan changes
        setTaxData(null);

        // Simulate Tax Calc for UI feedback (Real calc happens on backend order creation)
        // This is just for display "Estimating..."
    };

    const handleRazorpayPayment = async () => {
        if (!selectedPlan) return;

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    currency
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // Initialize Razorpay specific logic here (e.g. window.Razorpay)
            // Ideally we'd load the Razorpay script
            const options = {
                key: data.key_id,
                amount: data.amount * 100,
                currency: data.currency,
                name: "Vynix AI",
                description: `${selectedPlan} Subscription`,
                order_id: data.order_id,
                handler: function (response: any) {
                    alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
                    // Verify payment on backend
                },
                prefill: {
                    name: "User Name", // Fetch from user context if available
                    email: "user@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error: any) {
            alert('Payment Failed: ' + error.message);
        }
    };

    return (
        <PayPalScriptProvider options={{ clientId: "test" }}> {/* Replace 'test' with real Client ID from ENV */}
            <div className="min-h-screen">
                {/* Navigation */}
                <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-vynix-gradient rounded-lg"></div>
                                <span className="text-xl font-display font-bold">Vynix AI</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard" className="text-white/80 hover:text-white transition">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-display font-bold mb-4">
                            Simple, Transparent Pricing
                        </h1>

                        {/* Country/Currency Indicator */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
                            <span className="text-sm text-white/60">Location detected: {countryCode}</span>
                            <div className="h-4 w-px bg-white/20"></div>
                            <button
                                onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
                                className="text-sm font-semibold text-vynix-cyan hover:underline"
                            >
                                Switch to {currency === 'USD' ? 'INR' : 'USD'}
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Plans Rendering */}
                        {[
                            {
                                name: 'Free Explorer',
                                priceDisplay: currency === 'INR' ? '₹0' : '$0',
                                credits: 100,
                                features: ['100 credits/month', 'Watermarked outputs', 'Standard queue'],
                                cta: 'Current Plan',
                                variant: 'ghost' as const,
                            },
                            {
                                name: 'Pro Creator',
                                priceDisplay: displayPrice('pro'),
                                credits: 500,
                                features: ['500 credits/month', 'No watermarks', 'Priority queue', 'HD outputs'],
                                cta: 'Upgrade to Pro',
                                variant: 'primary' as const,
                                popular: true,
                            },
                            {
                                name: 'Elite Studio',
                                priceDisplay: displayPrice('elite'),
                                credits: 2000,
                                features: ['2000 credits/month', 'Creative Director unlimited', 'No watermarks', '4K outputs'],
                                cta: 'Upgrade to Elite',
                                variant: 'outline' as const,
                            },
                        ].map((plan, i) => (
                            <Card key={i} glow={plan.popular} className="relative">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-5xl font-bold">{plan.priceDisplay}</span>
                                        <span className="text-white/60">/month</span>
                                    </div>
                                    <div className="mt-1 text-xs text-white/40">
                                        {currency === 'INR' ? '+ 18% GST' : '+ Tax (if applicable)'}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <span className="text-white/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant={plan.variant}
                                        size="lg"
                                        className="w-full"
                                        onClick={() => handleSubscribe(plan.name)}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Checkout Modal / Section */}
                    {selectedPlan && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-900 border border-white/10 rounded-xl p-8 max-w-md w-full relative">
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                                >
                                    ✕
                                </button>

                                <h2 className="text-2xl font-bold mb-6">Complete Checkout</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Plan ({selectedPlan})</span>
                                        <span>{displayPrice(selectedPlan)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/50">
                                        <span>Tax Estimate</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="h-px bg-white/10"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{displayPrice(selectedPlan)} + Tax</span>
                                    </div>
                                </div>

                                {/* Payment Options */}
                                <div className="space-y-3">
                                    {currency === 'USD' ? (
                                        <>
                                            <div className="w-full">
                                                <PayPalButtons
                                                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                                                    createOrder={async (data, actions) => {
                                                        const res = await fetch('/api/paypal/create-order', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                plan: selectedPlan,
                                                                currency: 'USD'
                                                            })
                                                        });
                                                        const order = await res.json();
                                                        return order.orderID;
                                                    }}
                                                    onApprove={async (data, actions) => {
                                                        const res = await fetch('/api/paypal/capture-order', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                orderID: data.orderID
                                                            })
                                                        });
                                                        const details = await res.json();
                                                        if (details.success) {
                                                            alert("Transaction Completed by " + details.status);
                                                            setSelectedPlan(null);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="relative flex py-2 items-center">
                                                <div className="flex-grow border-t border-white/10"></div>
                                                <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase">Or Pay with Card</span>
                                                <div className="flex-grow border-t border-white/10"></div>
                                            </div>

                                            <Button
                                                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white"
                                                onClick={handleRazorpayPayment}
                                            >
                                                Pay with Credit Card
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            className="w-full bg-[#3399cc] hover:bg-[#2e88b5] text-white"
                                            onClick={handleRazorpayPayment}
                                        >
                                            Pay via Razorpay (Cards/UPI)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
