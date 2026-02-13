'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CreditBalance } from '@/components/dashboard/CreditBalance';
import { AffiliateStats } from '@/components/dashboard/AffiliateStats';
import { GenerationModal } from '@/components/dashboard/GenerationModal';

interface User {
    id: string;
    email: string;
    name: string | null;
    affiliateCode: string;
    credits: number;
    plan: string;
}

type GenerationType = 'video' | 'music' | 'voiceover' | 'lipsync' | 'image' | 'voice' | 'song';

interface QuickAction {
    icon: string;
    title: string;
    type: GenerationType;
    cost: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            // Try to get user from credits endpoint (which requires auth)
            const response = await fetch('/api/credits');

            if (!response.ok) {
                // Not authenticated, redirect to home
                router.push('/');
                return;
            }

            const data = await response.json();

            // We need to fetch full user data - for now use mock data
            // In production, you'd have a /api/user/me endpoint
            setUser({
                id: 'user-id',
                email: '[email protected]',
                name: 'User',
                affiliateCode: 'DEMO123',
                credits: data.credits,
                plan: data.plan,
            });
        } catch (error) {
            console.error('Failed to fetch user:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleActionClick = (action: QuickAction) => {
        setSelectedAction(action);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAction(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vynix-cyan"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const quickActions: QuickAction[] = [
        { icon: '🖼️', title: 'Generate Image', type: 'image', cost: 5 },
        { icon: '🎵', title: 'Compose Music', type: 'music', cost: 5 },
        { icon: '🎤', title: 'Create Song', type: 'song', cost: 10 },
        { icon: '🎙️', title: 'Create Voice', type: 'voice', cost: 3 },
        { icon: '🎬', title: 'Generate Video', type: 'video', cost: 10 },
        { icon: '🗣️', title: 'Lip Sync', type: 'lipsync', cost: 8 },
    ];

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-vynix-gradient rounded-lg"></div>
                            <span className="text-xl font-display font-bold">Vynix AI</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/pricing" className="text-white/80 hover:text-white transition">
                                Pricing
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        Welcome back{user.name ? `, ${user.name}` : ''}!
                    </h1>
                    <p className="text-white/60">Manage your AI creations and track your progress</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <CreditBalance userId={user.id} />
                    <AffiliateStats affiliateCode={user.affiliateCode} />
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-vynix-cyan/50 hover:bg-white/10 transition-all duration-300 text-left"
                                    onClick={() => handleActionClick(action)}
                                >
                                    <div className="text-3xl mb-2">{action.icon}</div>
                                    <div className="font-semibold mb-1">{action.title}</div>
                                    <div className="text-sm text-white/60">{action.cost} credits</div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-vynix-cyan/10 border border-vynix-cyan/30 rounded-lg">
                            <p className="text-sm text-vynix-cyan">
                                💡 <strong>Tip:</strong> Image, Music, and Voice use Hugging Face (free tier). Video requires RunPod configuration.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Generations */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Recent Generations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-white/60">
                            <p>No generations yet. Start creating above!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Generation Modal */}
            {selectedAction && (
                <GenerationModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    type={selectedAction.type}
                    cost={selectedAction.cost}
                    icon={selectedAction.icon}
                    title={selectedAction.title}
                />
            )}
        </div>
    );
}
