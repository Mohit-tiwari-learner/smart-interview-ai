import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center relative z-10 max-w-lg mx-auto"
            >
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-800 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-slate-400 mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button className="w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" /> Go Home
                        </Button>
                    </Link>
                    <Link to="/practice">
                        <Button variant="secondary" className="w-full sm:w-auto">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Resume Practice
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
