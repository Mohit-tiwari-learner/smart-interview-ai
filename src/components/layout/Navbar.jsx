import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Menu, X, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import { ROUTES } from '../../routes';

import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth(); // Auth Hook

    const navLinks = [
        { name: 'Practice', path: ROUTES.PRACTICE },
        { name: 'Dashboard', path: ROUTES.PROGRESS },
        { name: 'Features', path: '/#features' }, // Hash links might remain as is
        { name: 'Pricing', path: ROUTES.PRICING },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                        <Mic className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        Next<span className="text-primary-400">Step</span>
                        <span className="text-slate-500 text-sm font-normal ml-1 hidden sm:inline-block">AI Coach</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary-400",
                                    isActive(link.path) ? "text-primary-400" : "text-slate-400"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-300">
                                    Hi, {user.name}
                                </span>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={logout}
                                    className="rounded-lg text-xs"
                                >
                                    Log Out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to={`${ROUTES.AUTH}?mode=login`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link to={`${ROUTES.AUTH}?mode=signup`}>
                                    <Button size="sm" className="rounded-lg">
                                        Get Started <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-slate-950 border-b border-white/5"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-base font-medium transition-colors py-2",
                                        isActive(link.path) ? "text-primary-400" : "text-slate-400"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2" />

                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-medium text-slate-300 py-2">
                                        Signed in as {user.name}
                                    </span>
                                    <Button onClick={() => { logout(); setIsOpen(false); }} variant="secondary" className="w-full">
                                        Log Out
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Link to={`${ROUTES.AUTH}?mode=login`} onClick={() => setIsOpen(false)} className="text-slate-300 py-2">
                                        Sign In
                                    </Link>
                                    <Link to={`${ROUTES.AUTH}?mode=signup`} onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
