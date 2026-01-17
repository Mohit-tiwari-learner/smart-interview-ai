import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, MessageSquare, TrendingUp, Users, Code, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const blogPosts = [
        {
            id: 1,
            title: "The Hidden Truth About Interview Preparation",
            excerpt: "Most candidates focus on technical skills, but communication is equally crucial. Here's why soft skills matter more than you think.",
            category: "interview-prep",
            readTime: "5 min read",
            date: "Dec 15, 2024",
            tags: ["communication", "soft-skills", "interview-tips"],
            featured: true
        },
        {
            id: 2,
            title: "Common Mistakes Freshers Make in Interviews",
            excerpt: "From poor body language to unclear answers, learn from the most frequent mistakes and how to avoid them.",
            category: "interview-prep",
            readTime: "7 min read",
            date: "Dec 12, 2024",
            tags: ["freshers", "mistakes", "body-language"]
        },
        {
            id: 3,
            title: "How AI is Revolutionizing Interview Coaching",
            excerpt: "Explore how artificial intelligence is transforming the way we prepare for job interviews and assess candidates.",
            category: "ai-tech",
            readTime: "6 min read",
            date: "Dec 10, 2024",
            tags: ["AI", "technology", "future-of-work"]
        },
        {
            id: 4,
            title: "Mastering the STAR Method for Behavioral Questions",
            excerpt: "Learn how to structure your answers effectively using the Situation-Task-Action-Result framework.",
            category: "interview-prep",
            readTime: "4 min read",
            date: "Dec 8, 2024",
            tags: ["STAR-method", "behavioral", "structure"]
        },
        {
            id: 5,
            title: "Data Science Interview Questions You Must Prepare",
            excerpt: "A comprehensive guide to technical questions asked in data science and machine learning interviews.",
            category: "technical",
            readTime: "10 min read",
            date: "Dec 5, 2024",
            tags: ["data-science", "technical", "machine-learning"]
        },
        {
            id: 6,
            title: "Building Confidence: From Nervous to Natural",
            excerpt: "Practical techniques to overcome interview anxiety and present yourself authentically.",
            category: "communication",
            readTime: "8 min read",
            date: "Dec 3, 2024",
            tags: ["confidence", "anxiety", "presentation"]
        }
    ];

    const categories = [
        { id: 'all', name: 'All Posts', icon: BookOpen },
        { id: 'interview-prep', name: 'Interview Prep', icon: Target },
        { id: 'communication', name: 'Communication', icon: MessageSquare },
        { id: 'technical', name: 'Technical', icon: Code },
        { id: 'ai-tech', name: 'AI & Tech', icon: TrendingUp }
    ];

    const filteredPosts = selectedCategory === 'all'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 mb-6">
                        <BookOpen className="w-4 h-4" />
                        NextStep AI Blog
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Insights for <span className="gradient-text">Interview Success</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Practical insights on interview preparation, communication skills, and AI-powered
                        learning. Written from real experience, not generic theory.
                    </p>
                </div>

                {/* Blog Purpose */}
                <div className="mb-16">
                    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20">
                        <h2 className="text-2xl font-bold mb-6 text-center">Why This Blog Exists</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-6 h-6 text-primary-400" />
                                </div>
                                <h3 className="font-bold mb-2">Help Learners Improve</h3>
                                <p className="text-slate-400 text-sm">Share practical guidance to help students and freshers improve their interview outcomes</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-6 h-6 text-secondary-400" />
                                </div>
                                <h3 className="font-bold mb-2">Share Real Experience</h3>
                                <p className="text-slate-400 text-sm">Content based on actual interview preparation, academic projects, and personal learning</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="font-bold mb-2">Build Awareness</h3>
                                <p className="text-slate-400 text-sm">Educate about AI-based feedback systems and modern interview preparation techniques</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedCategory === category.id
                                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredPosts.map((post) => (
                        <Card key={post.id} hoverEffect className={`p-6 ${post.featured ? 'border-primary-500/30 bg-slate-900/80' : ''}`}>
                            {post.featured && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium mb-4">
                                    <TrendingUp className="w-3 h-3" />
                                    Featured
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary-400 transition-colors cursor-pointer">
                                {post.title}
                            </h3>

                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                                <span>Read More</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Topics Covered */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Topics We Cover</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Target className="w-6 h-6 text-primary-400" />
                                Interview Preparation
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Common behavioral questions and answers
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Technical interview strategies
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Mistakes to avoid in interviews
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Industry-specific preparation tips
                                </li>
                            </ul>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-secondary-400" />
                                Communication Skills
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                    Overcoming interview anxiety
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                    Building confidence in presentations
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                    Body language and non-verbal cues
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                                    Effective communication techniques
                                </li>
                            </ul>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Code className="w-6 h-6 text-green-400" />
                                Technical Insights
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Data Science interview questions
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Machine Learning concepts
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Coding problem solving strategies
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    System design fundamentals
                                </li>
                            </ul>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                AI & Technology
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    How AI is changing interviews
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    Machine learning in education
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    Automated feedback systems
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    Future of skill assessment
                                </li>
                            </ul>
                        </Card>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="text-center">
                    <Card className="p-12 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                            Get notified when we publish new articles on interview preparation,
                            communication skills, and AI-powered learning techniques.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-slate-500"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default BlogPage;
