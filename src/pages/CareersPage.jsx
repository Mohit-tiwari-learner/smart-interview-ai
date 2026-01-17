import React from 'react';
import { Users, Code, TrendingUp, MessageSquare, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CareersPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 mb-6">
                        <Users className="w-4 h-4" />
                        Join Our Team
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Shape the Future of <span className="gradient-text">Interview Prep</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        NextStep AI is an early-stage project focused on revolutionizing how students prepare
                        for job interviews using AI and data science.
                    </p>
                </div>

                {/* Current Status */}
                <div className="mb-16">
                    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20 text-center">
                        <h2 className="text-2xl font-bold mb-4">We're Not Actively Hiring Right Now</h2>
                        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                            NextStep AI is currently an individual project led by Mohit Tiwari.
                            While we're not looking for full-time team members, we're always open to
                            connecting with talented individuals who share our vision.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => window.open('mailto:mohit200409tiwari@gmail.com?subject=Collaboration%20Interest', '_blank')}>
                                <Mail className="w-4 h-4 mr-2" />
                                Get In Touch
                            </Button>
                            <Button variant="outline" onClick={() => window.open('https://www.linkedin.com/in/mohit-tiwari-426598338/', '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                LinkedIn
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* What We're Looking For */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Areas of Interest</h2>
                    <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                        If you're passionate about education, AI, or interview preparation, we'd love to hear from you.
                        Here are the areas where we see potential collaboration opportunities:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card hoverEffect className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    <Code className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Frontend Development</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        React, TypeScript, modern web technologies. Help build the next generation
                                        of interview preparation interfaces.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    React & React Native expertise
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    UI/UX design experience
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    Modern JavaScript frameworks
                                </div>
                            </div>
                        </Card>

                        <Card hoverEffect className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-secondary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Data Science & AI</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Machine learning, NLP, speech analysis. Develop advanced algorithms
                                        for speech pattern recognition and feedback generation.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary-500" />
                                    Python, TensorFlow, PyTorch
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary-500" />
                                    Natural Language Processing
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary-500" />
                                    Speech recognition technologies
                                </div>
                            </div>
                        </Card>

                        <Card hoverEffect className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Content & Education</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Interview preparation content, educational materials, and blog writing.
                                        Help create resources that actually help students succeed.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Interview coaching experience
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Educational content creation
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Communication skills expertise
                                </div>
                            </div>
                        </Card>

                        <Card hoverEffect className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Research & Innovation</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Academic collaboration, research partnerships, and innovative approaches
                                        to interview assessment and skill development.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Academic research experience
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Educational technology expertise
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Assessment methodologies
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* How to Connect */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">How to Connect</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Email</h3>
                            <p className="text-slate-400 mb-4">
                                Send a detailed message about your background, interests, and how you'd like to contribute.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => window.open('mailto:mohit200409tiwari@gmail.com?subject=Collaboration%20Interest', '_blank')}>
                                mohit200409tiwari@gmail.com
                            </Button>
                        </Card>

                        <Card className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-6">
                                <ExternalLink className="w-8 h-8 text-secondary-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">LinkedIn</h3>
                            <p className="text-slate-400 mb-4">
                                Connect professionally and share your profile. Include a personalized message.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => window.open('https://www.linkedin.com/in/mohit-tiwari-426598338/', '_blank')}>
                                View Profile
                            </Button>
                        </Card>

                        <Card className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">GitHub</h3>
                            <p className="text-slate-400 mb-4">
                                Check out the project repository and contribute if you see opportunities for improvement.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => window.open('https://github.com/Mohit-tiwari-learner', '_blank')}>
                                View Projects
                            </Button>
                        </Card>
                    </div>
                </section>

                {/* Future Opportunities */}
                <section className="mb-16">
                    <Card className="p-12 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20">
                        <h2 className="text-3xl font-bold text-center mb-6">Future Opportunities</h2>
                        <p className="text-slate-400 text-center mb-8 max-w-3xl mx-auto">
                            As NextStep AI grows, we envision building a team that combines expertise in
                            education, AI, and user experience design. If you're interested in shaping the
                            future of interview preparation, we'd love to hear from you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-400" />
                                    What We Value
                                </h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        Passion for education and career development
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        Experience with AI and data science
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        Understanding of interview processes
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        Ability to work on impactful projects
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-secondary-400" />
                                    Collaboration Types
                                </h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                        Open source contributions
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                        Academic research partnerships
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                        Content creation and blogging
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                        Feature development and testing
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Let's Build Something Amazing Together</h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Whether you're a developer, researcher, educator, or just passionate about
                        improving interview outcomes, your expertise could make a real difference.
                    </p>
                    <Button size="lg" onClick={() => window.open('mailto:mohit200409tiwari@gmail.com?subject=Collaboration%20Interest', '_blank')}>
                        <Mail className="w-5 h-5 mr-2" />
                        Start a Conversation
                    </Button>
                </section>
            </div>
        </div>
    );
};

export default CareersPage;
