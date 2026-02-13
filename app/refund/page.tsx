export default function RefundPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-display font-bold mb-8">Refund Policy</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 mb-6">
                        <strong>Last Updated:</strong> February 10, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7-Day Money-Back Guarantee</h2>
                        <p className="text-white/70 mb-4">
                            We offer a 7-day money-back guarantee for first-time subscribers to our Pro and Elite plans. If you're not satisfied with our Service, you can request a full refund within 7 days of your initial subscription purchase.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
                        <p className="text-white/70 mb-4">
                            You are eligible for a refund if:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>You are a first-time subscriber (new customer)</li>
                            <li>You request the refund within 7 days of your initial purchase</li>
                            <li>You have not violated our Terms of Service</li>
                            <li>You have not engaged in fraudulent activity</li>
                        </ul>

                        <p className="text-white/70 mb-4 mt-6">
                            <strong>Refunds are NOT available for:</strong>
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Subscription renewals (only first-time purchases)</li>
                            <li>Requests made after the 7-day period</li>
                            <li>Accounts that have been suspended or terminated for policy violations</li>
                            <li>Credit purchases or add-ons (only subscription fees)</li>
                            <li>Partial refunds for unused credits</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
                        <p className="text-white/70 mb-4">
                            To request a refund, please follow these steps:
                        </p>
                        <ol className="list-decimal list-inside text-white/70 mb-4 space-y-3">
                            <li>
                                <strong>Contact Support:</strong> Email us at <a href="mailto:refunds@vynix.pro" className="text-vynix-cyan hover:underline">refunds@vynix.pro</a> with the subject line "Refund Request"
                            </li>
                            <li>
                                <strong>Provide Information:</strong> Include your account email, subscription plan, and reason for the refund request
                            </li>
                            <li>
                                <strong>Wait for Confirmation:</strong> We will review your request within 2 business days
                            </li>
                            <li>
                                <strong>Receive Refund:</strong> If approved, refunds are processed within 5-7 business days to your original payment method
                            </li>
                        </ol>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Refund Processing Time</h2>
                        <p className="text-white/70 mb-4">
                            Once your refund is approved:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li><strong>Processing:</strong> 2-3 business days for internal processing</li>
                            <li><strong>Bank Transfer:</strong> 5-7 business days for the refund to appear in your account</li>
                            <li><strong>Credit/Debit Card:</strong> 5-10 business days depending on your bank</li>
                            <li><strong>UPI/Wallet:</strong> 3-5 business days</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Subscription Cancellation</h2>
                        <p className="text-white/70 mb-4">
                            You can cancel your subscription at any time from your account dashboard. Upon cancellation:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>You will retain access until the end of your current billing period</li>
                            <li>No further charges will be made</li>
                            <li>Your account will revert to the Free tier after the period ends</li>
                            <li>Cancellation does not automatically trigger a refund (refund policy applies separately)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Exceptional Circumstances</h2>
                        <p className="text-white/70 mb-4">
                            In exceptional cases (e.g., technical issues preventing service use, billing errors), we may offer refunds outside the standard policy. These are evaluated on a case-by-case basis.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Chargebacks</h2>
                        <p className="text-white/70 mb-4">
                            If you file a chargeback or payment dispute with your bank instead of contacting us first, we reserve the right to:
                        </p>
                        <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                            <li>Immediately suspend your account</li>
                            <li>Terminate your access to the Service</li>
                            <li>Pursue legal action for fraudulent chargebacks</li>
                        </ul>
                        <p className="text-white/70 mb-4">
                            Please contact us directly to resolve any billing issues before initiating a chargeback.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
                        <p className="text-white/70 mb-4">
                            If you have questions about our refund policy, please contact us:
                        </p>
                        <p className="text-white/70">
                            Email: <a href="mailto:refunds@vynix.pro" className="text-vynix-cyan hover:underline">refunds@vynix.pro</a><br />
                            Support: <a href="mailto:support@vynix.pro" className="text-vynix-cyan hover:underline">support@vynix.pro</a><br />
                            Website: <a href="https://www.vynix.pro" className="text-vynix-cyan hover:underline">www.vynix.pro</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
