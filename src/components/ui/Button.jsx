import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import PropTypes from 'prop-types';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white hover:opacity-90 shadow-lg shadow-primary-500/25',
        secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10',
        outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10',
        ghost: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

Button.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    children: PropTypes.node.isRequired,
};

export default Button;
