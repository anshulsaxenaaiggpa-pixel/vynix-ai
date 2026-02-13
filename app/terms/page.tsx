export default function TermsPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 mb-6">
                        <strong>Last Updated:</strong> February 10, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-white/70 mb-4">
                            By accessing and using Vynix AI ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                        <p className="text-white/70 mb-4">
                            Vynix AI provides an AI-powered content creation platform that enables users to generate:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Images using AI models (FLUX.1-dev)</li>
                            <li>Music and audio using AI models (MusicGen, Stable Audio)</li>
                            <li>Voice synthesis using AI models (SpeechT5, F5-TTS)</li>
                            <li>Video content using AI models (Wan2.1)</li>
                            <li>Lip-sync videos using AI models (SadTalker)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                        <p className="text-white/70 mb-4">
                            To use our Service, you must create an account. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Subscription and Billing</h2>
                        <p className="text-white/70 mb-4">
                            <strong>4.1 Pricing Plans:</strong> We offer multiple subscription tiers (Free, Pro, Elite) with different credit allocations.
                        </p>
                        <p className="text-white/70 mb-4">
                            <strong>4.2 Payment:</strong> Subscriptions are billed monthly in advance. Payment is processed through Razorpay.
                        </p>
                        <p className="text-white/70 mb-4">
                            <strong>4.3 Credits:</strong> Credits are used to generate content. Credit costs vary by generation type. Unused credits do not roll over to the next billing period for free tier users.
                        </p>
                        <p className="text-white/70 mb-4">
                            <strong>4.4 Cancellation:</strong> You may cancel your subscription at any time. You will retain access until the end of your current billing period.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Refund Policy</h2>
                        <p className="text-white/70 mb-4">
                            We offer a 7-day money-back guarantee for first-time subscribers. See our <a href="/refund" className="text-vynix-cyan hover:underline">Refund Policy</a> for details.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
                        <p className="text-white/70 mb-4">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Generate illegal, harmful, or offensive content</li>
                            <li>Violate any intellectual property rights</li>
                            <li>Impersonate any person or entity</li>
                            <li>Distribute malware or engage in malicious activities</li>
                            <li>Attempt to circumvent usage limits or security measures</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
                        <p className="text-white/70 mb-4">
                            <strong>7.1 Your Content:</strong> You retain all rights to content you generate using our Service.
                        </p>
                        <p className="text-white/70 mb-4">
                            <strong>7.2 Our Service:</strong> The Service, including its software, design, and branding, is owned by Vynix AI and protected by intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Affiliate Program</h2>
                        <p className="text-white/70 mb-4">
                            Users can earn 20% recurring commission by referring new paying customers. Commission is tracked automatically and paid out according to our affiliate terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                        <p className="text-white/70 mb-4">
                            To the maximum extent permitted by law, Vynix AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Service Availability</h2>
                        <p className="text-white/70 mb-4">
                            We strive to provide 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance or updates that temporarily affect availability.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                        <p className="text-white/70 mb-4">
                            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
                        <p className="text-white/70 mb-4">
                            We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                        <p className="text-white/70 mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                        <p className="text-white/70 mb-4">
                            For questions about these Terms, please contact us at:
                        </p>
                        <p className="text-white/70">
                            Email: <a href="mailto:support@vynix.pro" className="text-vynix-cyan hover:underline">support@vynix.pro</a><br />
                            Website: <a href="https://www.vynix.pro" className="text-vynix-cyan hover:underline">www.vynix.pro</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
