import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`bg-white rounded-campus-lg border border-[#EEEEEC] p-5 shadow-subtle ${
        hoverEffect ? 'hover:shadow-elevated hover:border-[#D8D8D5] transition-all cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

