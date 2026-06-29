import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedParagraph = ({ children, className, delay = 0 }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.p>
  );
};

export const AnimatedSpan = ({ children, className, delay = 0 }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={`inline-block ${className || ''}`}
    >
      {children}
    </motion.span>
  );
};
