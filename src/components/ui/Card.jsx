import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

import PropTypes from 'prop-types';

const Card = ({ className, children, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5 } : {}}
            className={cn(
                'glass-card p-6 overflow-hidden relative',
                hoverEffect && 'hover:shadow-primary-500/10 hover:border-primary-500/30 transition-colors',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

Card.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    hoverEffect: PropTypes.bool,
};

export default Card;
