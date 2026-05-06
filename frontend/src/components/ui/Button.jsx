'use client';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white hover:shadow-[0_12px_35px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 relative overflow-hidden group',
    secondary:
      'bg-[var(--color-surface)] backdrop-blur-xl border border-black/[0.08] text-[var(--color-text-primary)] hover:border-[#6366F1]/30 hover:bg-[#6366F1]/8 hover:-translate-y-0.5',
    ghost:
      'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5',
    danger:
      'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
