'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AffiliateStatsProps {
    affiliateCode: string;
}

export function AffiliateStats({ affiliateCode }: AffiliateStatsProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(affiliateCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${affiliateCode}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Affiliate Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm text-white/60 mb-2">Your Referral Code</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={affiliateCode}
                            readOnly
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono"
                        />
                        <Button onClick={copyToClipboard} variant="secondary" size="md">
                            {copied ? '✓ Copied' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white/60 mb-2">Referral Link</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={referralUrl}
                            readOnly
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm truncate"
                        />
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(referralUrl);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            variant="secondary"
                            size="md"
                        >
                            {copied ? '✓' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                        <div className="text-2xl font-bold text-vynix-cyan">0</div>
                        <div className="text-sm text-white/60">Total Referrals</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-vynix-purple">$0.00</div>
                        <div className="text-sm text-white/60">Earnings</div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60">
                        Earn <span className="text-vynix-cyan font-semibold">20% recurring commission</span> on all referrals!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
