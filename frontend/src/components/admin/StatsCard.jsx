'use client';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = '#ef4444', trend, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0
                ? 'bg-[#00c9a7]/10 text-[#00c9a7]'
                : 'bg-[#ff4757]/10 text-[#ff4757]'
            }`}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white font-['Outfit']">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{title}</p>
    </motion.div>
  );
};

export default StatsCard;
