import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate form submission
        try {
            // In a real app, this would send to your backend
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, show success
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 mb-6">
                        <Mail className="w-4 h-4" />
                        Get In Touch
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Let's <span className="gradient-text">Connect</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Have questions about NextStep AI? Want to collaborate? Or just want to share feedback?
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <p className="text-green-400">Message sent successfully! We'll get back to you within 24-48 hours.</p>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-400">Failed to send message. Please try again or contact us directly.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-slate-500"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-slate-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-slate-500"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-slate-500 resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Direct Contact */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6">Direct Contact</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Email</h4>
                                        <p className="text-slate-400 mb-2">Our primary communication channel</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open('mailto:mohit200409tiwari@gmail.com', '_blank')}
                                        >
                                            mohit200409tiwari@gmail.com
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-secondary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Location</h4>
                                        <p className="text-slate-400">Currently operating remotely</p>
                                        <p className="text-sm text-slate-500">Open to collaboration worldwide</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Response Time</h4>
                                        <p className="text-slate-400">Typically within 24-48 hours</p>
                                        <p className="text-sm text-slate-500">During business days</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Links */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open('https://www.linkedin.com/in/mohit-tiwari-426598338/', '_blank')}
                                >
                                    LinkedIn Profile
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open('https://github.com/Mohit-tiwari-learner', '_blank')}
                                >
                                    GitHub Projects
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.location.href = '/about'}
                                >
                                    About NextStep AI
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.location.href = '/careers'}
                                >
                                    Career Opportunities
                                </Button>
                            </div>
                        </Card>

                        {/* FAQ */}
                        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20">
                            <h3 className="text-xl font-bold mb-6">Common Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-white mb-1">How does the AI analysis work?</h4>
                                    <p className="text-slate-400 text-sm">Our system analyzes speech patterns, filler words, pacing, and content relevance using advanced AI algorithms.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Is my data secure?</h4>
                                    <p className="text-slate-400 text-sm">Yes, all recordings and data are processed locally and never stored permanently without your consent.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Do you offer enterprise solutions?</h4>
                                    <p className="text-slate-400 text-sm">We're currently focused on individual users, but open to discussing enterprise partnerships.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-16 text-center">
                    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/20 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
                        <p className="text-slate-400 mb-6">
                            For urgent technical issues or account-related questions, you can also reach out through our social channels or check our documentation.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" onClick={() => window.open('https://github.com/Mohit-tiwari-learner', '_blank')}>
                                Documentation
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = '/blog'}>
                                Help Articles
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = '/practice'}>
                                Try NextStep AI
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
