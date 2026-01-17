import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, Check, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "HR / Recruiter",
    "Marketing Specialist",
    "Other"
];

const EXPERIENCE_LEVELS = [
    "Fresher (0-1 years)",
    "Junior (1-3 years)",
    "Mid-Level (3-5 years)",
    "Senior (5+ years)"
];

const OnboardingModal = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useAuth();
    const [role, setRole] = useState(user?.role || "");
    const [experience, setExperience] = useState(user?.experience || "");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!role || !experience) return;
        setLoading(true);
        try {
            await updateUserProfile({ role, experience });
            onClose();
        } catch (error) {
            console.error("Failed to save profile", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome! 👋</h2>
                        <p className="text-slate-400 mb-6">Tell us a bit about yourself so we can personalize your interview questions.</p>

                        <div className="space-y-6">
                            {/* Role Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-primary-400" /> Target Role
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLES.slice(0, 6).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRole(r)}
                                            className={`p-2 text-xs rounded-lg border transition-all text-left truncate ${role === r
                                                ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary-400" /> Experience Level
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {EXPERIENCE_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setExperience(level)}
                                            className={`p-3 text-sm rounded-lg border transition-all flex justify-between items-center ${experience === level
                                                ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {level}
                                            {experience === level && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={!role || !experience || loading}
                                className="w-full"
                            >
                                {loading ? "Saving..." : "Start Practicing"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OnboardingModal;
