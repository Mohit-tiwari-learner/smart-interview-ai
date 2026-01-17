import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, BarChart, Zap, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../routes';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 center w-full h-full hero-gradient pointer-events-none" />
                <div className="absolute top-20 right-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-primary-500/20 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-secondary-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                                AI-Powered Interview Coach
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                Master Your <br />
                                <span className="gradient-text">Interview Skills</span>
                            </h1>
                            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
                                Practice with our AI interviewer, get instant feedback on your confidence, clarity, and relevance, and land your dream job.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to={ROUTES.PRACTICE}>
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Start Free Practice <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="#how-it-works">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                        <Play className="mr-2 w-5 h-5" /> See How It Works
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-white">
                                            User
                                        </div>
                                    ))}
                                </div>
                                <p>Trusted by 10,000+ candidates</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                                <img
                                    src="/hero-bg.jpg"
                                    alt="AI Interview Interface"
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Floating API Analysis Cards */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute bottom-8 left-8 right-8 z-20"
                                >
                                    <Card className="bg-slate-950/80 backdrop-blur-xl border-white/20 p-4">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">Analysis Complete</h4>
                                                <p className="text-xs text-slate-400">Just now</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <span className="text-2xl font-bold text-green-400">92%</span>
                                                <p className="text-xs text-slate-400">Score</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-slate-300">
                                                <span>Confidence</span>
                                                <span className="text-white">High</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 w-[92%]" />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-950 relative" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Practice with <span className="gradient-text">NextStep</span>?</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                            Our advanced AI analyzes every aspect of your response to give you the competitive edge.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Mic className="w-6 h-6 text-primary-400" />,
                                title: "Voice Analysis",
                                desc: "Get feedback on your tone, pace, and clarity to speak with confidence."
                            },
                            {
                                icon: <BarChart className="w-6 h-6 text-secondary-400" />,
                                title: "Smart Scoring",
                                desc: "Detailed metrics on relevance, confidence, and keyword usage."
                            },
                            {
                                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                                title: "Instant Feedback",
                                desc: "No waiting. Get actionable insights seconds after you finish speaking."
                            }
                        ].map((feature, i) => (
                            <Card key={i} hoverEffect className="group">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">How It Works</h2>
                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Select a Question", desc: "Choose from our curated list of 500+ common interview questions." },
                                    { step: "02", title: "Record Your Answer", desc: "Speak naturally. our AI listens to your voice and content." },
                                    { step: "03", title: "Get Deep Analysis", desc: "Receive comprehensive breakdown of your performance." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <span className="text-3xl font-bold text-white/10">{item.step}</span>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-slate-300">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-3xl rounded-full" />
                            <Card className="relative p-8 bg-slate-900/90 border-white/10">
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-xs font-mono text-slate-400">RECORDING...</span>
                                        </div>
                                        <div className="flex gap-1 h-8 items-end justify-center">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [8, 24, 8] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                                                    className="w-1 bg-primary-500 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-3/4 bg-slate-800 rounded-full" />
                                        <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <Card className="text-center p-12 md:p-20 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Ace Your Interview?</h2>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of job seekers who improved their interview skills with NextStep AI.
                        </p>
                        <Link to={ROUTES.PRACTICE}>
                            <Button size="lg" className="px-10 py-6 text-lg shadow-xl shadow-primary-500/20">
                                Start Practicing Now
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
