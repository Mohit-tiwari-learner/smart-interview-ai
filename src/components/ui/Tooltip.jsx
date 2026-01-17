import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Tooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-slate-200 whitespace-nowrap shadow-xl z-50 pointer-events-none"
                    >
                        {content}
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

Tooltip.propTypes = {
    content: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
};

export default Tooltip;
