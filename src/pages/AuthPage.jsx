import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, signup, verifyOtp } = useAuth();

    // UI Stages: 'login', 'signup', 'otp'
    const [stage, setStage] = useState('login');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: ''
    });

    // Status State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const mode = searchParams.get('mode');
        // Only set stage if not in OTP flow
        if (stage !== 'otp') {
            setStage(mode === 'signup' ? 'signup' : 'login');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on edit
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (stage === 'login') {
                await login(formData.email, formData.password);
                navigate(ROUTES.PROGRESS); // Success redirect
            } else if (stage === 'signup') {
                await signup(formData.email, formData.password, formData.name);
                setStage('otp'); // Move to OTP
                // In a real app, API would trigger email here
            } else if (stage === 'otp') {
                await verifyOtp(formData.email, formData.otp);
                navigate(ROUTES.PROGRESS); // Success redirect
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center relative overflown-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {stage === 'login' && 'Welcome Back'}
                        {stage === 'signup' && 'Create Account'}
                        {stage === 'otp' && 'Verify Email'}
                    </h1>
                    <p className="text-slate-400">
                        {stage === 'login' && 'Enter your details to access your account'}
                        {stage === 'signup' && 'Start your journey to interview success'}
                        {stage === 'otp' && `We sent a code to ${formData.email}`}
                    </p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-slate-900/80">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* OTP Verification Stage */}
                        {stage === 'otp' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Enter Verification Code</label>
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="1234" // Hint for mock
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors tracking-widest text-lg"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-slate-500">Hint: Use code 1234 for testing.</p>
                            </div>
                        )}

                        {/* Login/Signup Stages */}
                        {stage !== 'otp' && (
                            <>
                                {stage === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {stage === 'login' && (
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-primary-400 hover:text-primary-300">Forgot Password?</a>
                            </div>
                        )}

                        <Button className="w-full mt-4" size="lg" disabled={loading}>
                            {loading ? 'Processing...' : (
                                <>
                                    {stage === 'login' && 'Sign In'}
                                    {stage === 'signup' && 'Send Code'}
                                    {stage === 'otp' && 'Verify & Login'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {stage !== 'otp' && (
                        <>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="secondary" className="w-full">
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="secondary" className="w-full">
                                    <Github className="w-5 h-5 mr-2" />
                                    Github
                                </Button>
                            </div>

                            <div className="mt-8 text-center text-sm text-slate-400">
                                {stage === 'login' ? "Don't have an account?" : "Already have an account?"} {' '}
                                <button
                                    onClick={() => setStage(stage === 'login' ? 'signup' : 'login')}
                                    className="text-primary-400 font-medium hover:text-primary-300"
                                >
                                    {stage === 'login' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </div>
                        </>
                    )}

                    {stage === 'otp' && (
                        <div className="mt-8 text-center text-sm text-slate-400">
                            <button
                                onClick={() => setStage('signup')}
                                className="text-primary-400 font-medium hover:text-primary-300"
                            >
                                Back to Signup
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
