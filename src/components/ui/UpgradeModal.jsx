import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Star } from 'lucide-react';
import Button from '../ui/Button';

const UpgradeModal = ({ isOpen, onClose, featureName = "This feature" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border border-yellow-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-yellow-500/10 relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header Image/Icon */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 p-8 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/40 animate-pulse">
                            <Crown className="w-10 h-10 text-white fill-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            <span className="text-yellow-400 font-bold">{featureName}</span> is available exclusively on the Pro plan. Unlock your full potential!
                        </p>

                        <div className="space-y-3 mb-8 text-left bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                Unlimited Practice Sessions
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                Access to Stress & Managerial Modes
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                Company Simulators (Google, Amazon)
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                AI Answer Polishing
                            </div>
                        </div>

                        <Button className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold text-base shadow-lg shadow-yellow-500/20">
                            Get Pro - ₹499/mo
                        </Button>
                        <p className="mt-3 text-[10px] text-slate-500">
                            Cancel anytime. 7-day money-back guarantee.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
