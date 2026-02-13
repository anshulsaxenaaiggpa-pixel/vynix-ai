export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 mb-6">
                        <strong>Last Updated:</strong> February 10, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-4">1.1 Information You Provide</h3>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Account information (name, email, password)</li>
                            <li>Payment information (processed by Razorpay)</li>
                            <li>Content you create using our Service</li>
                            <li>Communications with our support team</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-4">1.2 Automatically Collected Information</h3>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Usage data (features used, generation history)</li>
                            <li>Device information (browser type, IP address)</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <p className="text-white/70 mb-4">
                            We use collected information to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Provide and improve our Service</li>
                            <li>Process payments and manage subscriptions</li>
                            <li>Send service updates and marketing communications (with consent)</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                            <li>Track affiliate referrals and commissions</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Third-Party Services</h2>
                        <p className="text-white/70 mb-4">
                            We use the following third-party services that may collect your data:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li><strong>Razorpay:</strong> Payment processing (see Razorpay Privacy Policy)</li>
                            <li><strong>Supabase:</strong> Database hosting and authentication</li>
                            <li><strong>Hugging Face:</strong> AI model inference</li>
                            <li><strong>Cloudflare:</strong> CDN and security services</li>
                            <li><strong>Railway:</strong> Application hosting</li>
                            <li><strong>Google Gemini:</strong> AI orchestration</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
                        <p className="text-white/70 mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Encrypted data transmission (HTTPS/TLS)</li>
                            <li>Password hashing with bcrypt</li>
                            <li>Secure database access controls</li>
                            <li>Regular security audits</li>
                        </ul>
                        <p className="text-white/70 mb-4">
                            Your data is stored on secure servers provided by Supabase and Railway, located in compliance with applicable data protection laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
                        <p className="text-white/70 mb-4">
                            We use cookies for:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Authentication and session management</li>
                            <li>Affiliate referral tracking (30-day cookie)</li>
                            <li>Analytics and performance monitoring</li>
                            <li>User preferences</li>
                        </ul>
                        <p className="text-white/70 mb-4">
                            You can control cookies through your browser settings, but disabling them may affect Service functionality.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR Compliance)</h2>
                        <p className="text-white/70 mb-4">
                            If you are in the European Economic Area, you have the right to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Rectification:</strong> Correct inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your data</li>
                            <li><strong>Portability:</strong> Receive your data in a structured format</li>
                            <li><strong>Objection:</strong> Object to processing of your data</li>
                            <li><strong>Restriction:</strong> Request limited processing</li>
                        </ul>
                        <p className="text-white/70 mb-4">
                            To exercise these rights, contact us at <a href="mailto:privacy@vynix.pro" className="text-vynix-cyan hover:underline">privacy@vynix.pro</a>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                        <p className="text-white/70 mb-4">
                            We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Legal compliance (e.g., tax records)</li>
                            <li>Dispute resolution</li>
                            <li>Fraud prevention</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                        <p className="text-white/70 mb-4">
                            Our Service is not intended for users under 18 years of age. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
                        <p className="text-white/70 mb-4">
                            Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Changes to Privacy Policy</h2>
                        <p className="text-white/70 mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                        <p className="text-white/70 mb-4">
                            For privacy-related questions or to exercise your rights, contact us at:
                        </p>
                        <p className="text-white/70">
                            Email: <a href="mailto:privacy@vynix.pro" className="text-vynix-cyan hover:underline">privacy@vynix.pro</a><br />
                            Address: Vynix AI, India<br />
                            Website: <a href="https://www.vynix.pro" className="text-vynix-cyan hover:underline">www.vynix.pro</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
