'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
              <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowSignup(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
            AI Content
            <br />
            <span className="bg-vynix-gradient bg-clip-text text-transparent">
              Operating System
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Create cinematic videos, studio voiceovers, and original music with AI.
            <br />
            60% cheaper than Runway + Suno + ElevenLabs combined.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button variant="primary" size="lg" onClick={() => setShowSignup(true)}>
              Start Creating Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              See Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-display font-bold text-center mb-12">
          Everything You Need to Create
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🎬',
              title: 'Cinematic Videos',
              description: 'Wan2.1 text-to-video up to 4K resolution',
            },
            {
              icon: '🎙️',
              title: 'Studio Voiceovers',
              description: 'F5-TTS multi-language synthesis',
            },
            {
              icon: '🎵',
              title: 'Original Music',
              description: 'Stable Audio royalty-free tracks',
            },
            {
              icon: '💬',
              title: 'Lip-Sync Videos',
              description: 'SadTalker realistic talking heads',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-glass-gradient backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-vynix-cyan/50 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-glass-gradient backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Create?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Start with 100 free credits. No credit card required.
          </p>
          <Button variant="primary" size="lg" onClick={() => setShowSignup(true)}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-vynix-gradient rounded-lg"></div>
                <span className="text-xl font-display font-bold">Vynix AI</span>
              </div>
              <p className="text-white/60 text-sm">
                AI Content Operating System for creators
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="https://www.vynix.pro" className="hover:text-white transition">Website</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="mailto:support@vynix.pro" className="hover:text-white transition">support@vynix.pro</a></li>
                <li><a href="mailto:privacy@vynix.pro" className="hover:text-white transition">privacy@vynix.pro</a></li>
                <li><a href="mailto:refunds@vynix.pro" className="hover:text-white transition">refunds@vynix.pro</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>© 2026 Vynix AI. Built with ❤️ by creators, for creators.</p>
            <p className="mt-2">www.vynix.pro</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-vynix-dark border border-white/10 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-white/60">
              Don't have an account?{' '}
              <button onClick={() => { setShowLogin(false); setShowSignup(true); }} className="text-vynix-cyan hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSignup(false)}>
          <div className="bg-vynix-dark border border-white/10 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>
            <SignupForm />
            <p className="mt-4 text-center text-sm text-white/60">
              Already have an account?{' '}
              <button onClick={() => { setShowSignup(false); setShowLogin(true); }} className="text-vynix-cyan hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
