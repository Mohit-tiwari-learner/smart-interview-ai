import React from 'react';
import { GraduationCap, MessageSquare, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 mb-6">
                        <Users className="w-4 h-4" />
                        About NextStep AI
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Building the Future of <br />
                        <span className="gradient-text">Interview Preparation</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        NextStep AI is an AI-powered interview preparation platform built by Mohit Tiwari,
                        designed to help students and freshers improve their interview performance through
                        real-time feedback on communication, confidence, and clarity.
                    </p>
                </div>

                {/* Creator Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Meet the Creator</h2>
                        <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                            <p>
                                Hi, I'm <strong className="text-white">Mohit Tiwari</strong>, a B.Tech student in
                                Artificial Intelligence & Data Science. NextStep AI started as a personal project
                                to solve a problem I noticed during my own interview preparation journey.
                            </p>
                            <p>
                                Most interview preparation focuses on <strong>what</strong> to say, but not
                                <strong>how</strong> to say it. Through my academic projects and personal
                                experience, I realized that communication skills, confidence, and clarity
                                are just as important as technical knowledge.
                            </p>
                            <p>
                                NextStep AI aims to bridge this gap using data-driven and AI-based analysis,
                                helping students not just practice answers, but become better communicators.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Button variant="outline" onClick={() => window.open('https://www.linkedin.com/in/mohit-tiwari-426598338/', '_blank')}>
                                LinkedIn Profile
                            </Button>
                            <Button variant="outline" onClick={() => window.open('https://github.com/Mohit-tiwari-learner', '_blank')}>
                                GitHub Profile
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Mohit Tiwari</h3>
                                <p className="text-slate-400 mb-4">B.Tech in AI & Data Science</p>
                                <p className="text-sm text-slate-500">
                                    Passionate about using AI to improve education and career development
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* What We Do */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card hoverEffect className="text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-8 h-8 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Convert Speech to Text</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Our platform uses advanced speech recognition to accurately transcribe
                                your spoken answers in real-time, capturing every word and nuance.
                            </p>
                        </Card>

                        <Card hoverEffect className="text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8 text-secondary-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Analyze Performance</h3>
                            <p className="text-slate-400 leading-relaxed">
                                We analyze confidence through filler word detection, pacing analysis,
                                and sentiment assessment to provide comprehensive feedback.
                            </p>
                        </Card>

                        <Card hoverEffect className="text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <Target className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Provide Actionable Feedback</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Receive personalized recommendations after each practice session,
                                helping you improve communication skills and interview performance.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Why It Exists */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6">Why NextStep AI Exists</h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Most interview preparation focuses on content, but communication skills are equally crucial
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <Card className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <Lightbulb className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">The Problem</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Traditional interview prep teaches you what to say, but not how to say it.
                                        Many candidates struggle with confidence, pacing, and clarity - skills that
                                        aren't adequately addressed by current preparation methods.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">The Solution</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        NextStep AI uses AI and data science to analyze speech patterns,
                                        providing real-time feedback on communication skills. We bridge the gap
                                        between knowing what to say and knowing how to say it effectively.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Focus Areas</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-white/5">
                                    <Users className="w-6 h-6 text-primary-400" />
                                    <span className="text-slate-300">Interview practice for students & freshers</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-white/5">
                                    <TrendingUp className="w-6 h-6 text-secondary-400" />
                                    <span className="text-slate-300">Data-driven feedback systems</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-white/5">
                                    <MessageSquare className="w-6 h-6 text-green-400" />
                                    <span className="text-slate-300">AI + communication skill improvement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center">
                    <Card className="p-12 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Interview Skills?</h2>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who are using NextStep AI to master their interview communication skills.
                        </p>
                        <Button size="lg" onClick={() => window.location.href = '/practice'}>
                            Start Practicing Now
                        </Button>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
