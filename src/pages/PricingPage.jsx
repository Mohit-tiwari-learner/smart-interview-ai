import React from 'react';
import { Check, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const PricingPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple, Transparent Pricing</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Start for free and upgrade when you're ready to take your interview prep to the next level.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Free Plan */}
                <Card className="p-8 md:p-12 border-t-4 border-t-slate-500">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Free Starter</h3>
                        <p className="text-slate-400">Perfect for trying out the platform.</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-slate-500">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            "5 Practice Interview Sessions",
                            "Basic AI Feedback (Tone & Pace)",
                            "Access to Common Questions",
                            "Standard Support"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                <span className="text-slate-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth?mode=signup'}>Get Started Free</Button>
                </Card>

                {/* Pro Plan */}
                <Card className="p-8 md:p-12 border-t-4 border-t-primary-500 relative bg-slate-900/80">
                    <div className="absolute top-0 right-0 p-3 bg-primary-500 text-white text-xs font-bold rounded-bl-xl">POPULAR</div>
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            Pro Master <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </h3>
                        <p className="text-slate-400">For serious job seekers.</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">$19</span>
                        <span className="text-slate-500">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            "Unlimited Practice Sessions",
                            "Advanced AI Analysis (Content & Sentiment)",
                            "Filler Word Detection",
                            "Progress Tracking & Analytics",
                            "Custom Question Sets",
                            "Priority Support"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                <span className="text-slate-200">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full shadow-lg shadow-primary-500/25">Upgrade to Pro</Button>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;
