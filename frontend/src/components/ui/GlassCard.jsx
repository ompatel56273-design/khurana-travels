'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GlassCard = ({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      onClick={onClick}
      className={cn(
        'bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl',
        hover && 'transition-all duration-400 hover:border-[#6c63ff]/50 hover:shadow-[0_0_30px_rgba(108,99,255,0.15)]',
        onClick && 'cursor-pointer',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
