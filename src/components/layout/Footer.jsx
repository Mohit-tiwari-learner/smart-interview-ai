import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { Twitter, Linkedin, Github, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">
                            Next<span className="text-primary-400">Step</span>
                        </h3>
                        <p className="text-slate-400 max-w-sm mb-6">
                            Master your interview skills with real-time AI feedback. Practice anytime, anywhere, and get hired faster.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/mohit-tiwari-426598338/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/Mohit-tiwari-learner" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><Link to="/features" className="hover:text-primary-400 transition-colors">Features</Link></li>
                            <li><Link to="/practice" className="hover:text-primary-400 transition-colors">Practice</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/success-stories" className="hover:text-primary-400 transition-colors">Success Stories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><Link to={ROUTES.ABOUT} className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link to={ROUTES.BLOG} className="hover:text-primary-400 transition-colors">Blog</Link></li>
                            <li><Link to={ROUTES.CAREERS} className="hover:text-primary-400 transition-colors">Careers</Link></li>
                            <li><Link to={ROUTES.CONTACT} className="hover:text-primary-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2024 NextStep AI. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
