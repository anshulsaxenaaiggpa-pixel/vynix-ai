'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface CreditBalanceProps {
    userId: string;
}

export function CreditBalance({ userId }: CreditBalanceProps) {
    const [credits, setCredits] = useState<number>(0);
    const [plan, setPlan] = useState<string>('free');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            const response = await fetch('/api/credits');
            const data = await response.json();

            if (data.success) {
                setCredits(data.credits);
                setPlan(data.plan);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'elite': return 'text-vynix-purple';
            case 'pro': return 'text-vynix-cyan';
            default: return 'text-white/60';
        }
    };

    const getPlanName = (plan: string) => {
        switch (plan) {
            case 'elite': return 'Elite Studio';
            case 'pro': return 'Pro Creator';
            default: return 'Free Explorer';
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-8 bg-white/10 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card glow>
            <CardHeader>
                <CardTitle>Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-vynix-gradient bg-clip-text text-transparent">
                        {credits}
                    </span>
                    <span className="text-white/60">credits</span>
                </div>
                <div className="mt-4">
                    <span className="text-sm text-white/60">Current Plan: </span>
                    <span className={`text-sm font-semibold ${getPlanColor(plan)}`}>
                        {getPlanName(plan)}
                    </span>
                </div>
                {plan === 'free' && (
                    <div className="mt-4">
                        <a
                            href="/pricing"
                            className="text-sm text-vynix-cyan hover:underline"
                        >
                            Upgrade for more credits →
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
