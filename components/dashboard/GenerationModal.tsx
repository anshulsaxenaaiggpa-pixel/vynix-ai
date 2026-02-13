'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface GenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'video' | 'music' | 'voiceover' | 'lipsync' | 'image' | 'voice' | 'song';
    cost: number;
    icon: string;
    title: string;
}

export function GenerationModal({ isOpen, onClose, type, cost, icon, title }: GenerationModalProps) {
    const [prompt, setPrompt] = useState('');
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!prompt.trim()) return;
        setIsEnhancing(true);
        try {
            const res = await fetch('/api/director/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, target_model: type })
            });
            const data = await res.json();
            if (data.optimized_prompt) setPrompt(data.optimized_prompt);
        } catch (e) {
            console.error(e);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleWriteLyrics = async () => {
        const topic = prompt.trim() || "Love song";
        setIsEnhancing(true);
        try {
            const res = await fetch('/api/director/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, style: "emotional", duration: 120 })
            });
            const data = await res.json();
            if (data.script) {
                setSettings({ ...settings, lyrics: data.script, mode: 'lyrics' });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !settings.lyrics) {
            setError('Please enter a prompt or lyrics');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    prompt: prompt.trim(),
                    settings: settings,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setPrompt('');
                setSuccess(false);
                // Refresh the page to show updated credits and new artifact
                window.location.reload();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Failed to start generation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-vynix-dark border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{icon}</span>
                        <div>
                            <h2 className="text-2xl font-display font-bold">{title}</h2>
                            <p className="text-white/60 text-sm">{cost} credits</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition">✕</button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 font-semibold">✓ Generation started!</p>
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 font-semibold">✗ {error}</p>
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    {/* Model Selector (Dynamic based on Type) */}
                    {type === 'song' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <select
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan outline-none"
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                            >
                                <option value="musicgen">MusicGen (Standard)</option>
                                <option value="songgen-levo">SongGen LeVo (Pro)</option>
                            </select>
                        </div>
                    )}

                    {type === 'voice' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <select
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan outline-none"
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                            >
                                <option value="speecht5">SpeechT5 (Standard)</option>
                                <option value="fish_speech_1_5">Fish Speech 1.5 (Pro/Clone)</option>
                            </select>
                        </div>
                    )}

                    {type === 'video' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <select
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan outline-none"
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                            >
                                <option value="kling_i2v">Kling v2.1 I2V Pro</option>
                                <option value="kling_motion">Kling v2.6 Motion</option>
                                <option value="wan_t2v">Wan 2.6 T2V</option>
                                <option value="sora">Sora 2 I2V</option>
                            </select>
                        </div>
                    )}

                    {type === 'lipsync' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <select
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan outline-none"
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                            >
                                <option value="sadtalker">SadTalker (Standard)</option>
                                <option value="meigen">MeiGen / InfiniteTalk (Pro)</option>
                                <option value="echomimic">EchoMimic V2 (Avatar)</option>
                            </select>
                        </div>
                    )}

                    {/* Lyrics Input for Song */}
                    {type === 'song' && settings.model === 'songgen-levo' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Lyrics (Optional)</label>
                                <button
                                    onClick={handleWriteLyrics}
                                    disabled={isEnhancing}
                                    className="text-xs text-vynix-cyan hover:underline flex items-center gap-1"
                                >
                                    {isEnhancing ? 'Writing...' : '✍️ Auto-Write Lyrics'}
                                </button>
                            </div>
                            <textarea
                                placeholder="Enter lyrics here..."
                                value={settings.lyrics || ''}
                                className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan focus:outline-none resize-none"
                                onChange={(e) => setSettings({ ...settings, lyrics: e.target.value, mode: 'lyrics' })}
                            />
                        </div>
                    )}

                    {/* File Upload for Ref Audio (Song/Voice) */}
                    {((type === 'song' && settings.model === 'songgen-levo') || (type === 'voice' && settings.model === 'fish_speech_1_5')) && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Reference Audio (Clone/Style)</label>
                            <input
                                type="file"
                                accept="audio/*"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vynix-cyan file:text-vynix-dark hover:file:bg-cyan-400 transition"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setSettings({ ...settings, ref_audio: reader.result }); // Base64
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <p className="text-white/40 text-xs mt-1">Upload a short audio clip (&lt;10MB)</p>
                        </div>
                    )}

                    {/* Main Prompt Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">
                                {type === 'song' ? 'Describe the style/genre' : 'Describe what you want to create'}
                            </label>
                            <div className="flex gap-2">
                                {type === 'video' && (
                                    <button
                                        onClick={async () => {
                                            const topic = prompt.trim() || "A cinematic masterpiece";
                                            setIsEnhancing(true);
                                            try {
                                                const res = await fetch('/api/director/plan', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ prompt: topic })
                                                });
                                                const data = await res.json();
                                                if (data.visual_prompt) {
                                                    setPrompt(data.visual_prompt);
                                                    setSettings({ ...settings, audio_prompt: data.audio_prompt, script: data.script });
                                                    // Show a small toast or success indicator (using console for MVP)
                                                    console.log("Director Plan:", data);
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            } finally {
                                                setIsEnhancing(false);
                                            }
                                        }}
                                        disabled={isEnhancing}
                                        className="text-xs text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1"
                                    >
                                        {isEnhancing ? 'Directing...' : '🎬 Director Mode'}
                                    </button>
                                )}
                                <button
                                    onClick={handleEnhance}
                                    disabled={isEnhancing || !prompt}
                                    className="text-xs text-vynix-cyan hover:underline flex items-center gap-1"
                                >
                                    {isEnhancing ? 'Working...' : '✨ Magic Enhance'}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={getPlaceholder(type)}
                            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-vynix-cyan focus:outline-none resize-none"
                            disabled={loading || success}
                        />
                        {settings.script && (
                            <div className="mt-2 text-xs text-white/50 bg-white/5 p-2 rounded border border-white/10">
                                <span className="text-purple-400 font-semibold">Director:</span> {settings.script}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={loading || success} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={loading || success || !prompt.trim()} className="flex-1">
                        {loading ? 'Generating...' : `Generate (${cost} credits)`}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function getPlaceholder(type: string): string {
    const placeholders: Record<string, string> = {
        video: 'A cinematic shot of a sunset over mountains...',
        music: 'Upbeat electronic dance music with energetic beats...',
        voiceover: 'Welcome to our platform. We are excited to have you here...',
        voice: 'Hello, this is a test of the voice synthesis system...',
        lipsync: 'Describe the video and audio you want to sync...',
        image: 'A beautiful landscape with mountains and a lake at sunset...',
    };
    return placeholders[type] || 'Describe what you want to create...';
}
