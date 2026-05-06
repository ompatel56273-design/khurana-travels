'use client';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Orbiting loader */}
      <div className="relative w-12 h-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6366F1] border-r-[#22D3EE]"
        />
        <div className="absolute inset-2 rounded-full bg-[var(--color-bg-primary)]" />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-transparent border-b-[#6366F1]/30"
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)] tracking-wide">{text}</p>
    </div>
  );
};

export default Loader;
