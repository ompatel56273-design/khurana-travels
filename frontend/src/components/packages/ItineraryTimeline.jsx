'use client';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { UPLOAD_URL } from '@/lib/constants';

const ItineraryTimeline = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-[#6c63ff] via-[#8b83ff] to-[#6c63ff]/20" />

      <div className="space-y-6">
        {itinerary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Node */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/40 flex items-center justify-center z-10 relative">
                <span className="text-xs font-bold text-[#6c63ff]">{item.day}</span>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[#6c63ff]/10 blur-md" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-4 hover:border-[#6c63ff]/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#6c63ff] font-semibold">
                    Day {item.day}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-[#a0a0c0] leading-relaxed">
                  {item.description}
                </p>
                {item.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-black/10">
                    <img 
                      src={`${UPLOAD_URL}${item.image}`} 
                      alt={`Day ${item.day} - ${item.title}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#00c9a7]/20 border border-[#00c9a7]/40 flex items-center justify-center relative z-10">
            <IoCheckmarkCircle className="text-[#00c9a7] text-lg" />
          </div>
          <span className="text-sm font-medium text-[#00c9a7]">Journey Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryTimeline;
