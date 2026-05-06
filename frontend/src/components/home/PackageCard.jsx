'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { UPLOAD_URL } from '@/lib/constants';
import { IoBusOutline, IoPeopleOutline } from 'react-icons/io5';

const PackageCard = ({ pkg, index = 0 }) => {
  const available = pkg.totalSeats - (pkg.bookedSeats?.length || 0);

  // Helper to determine badge text and color based on index
  let badgeText = "Premium Route";
  let badgeColor = "bg-[#6366F1] text-white"; // Indigo
  if (index % 3 === 1) {
    badgeText = "Weekend Getaway";
    badgeColor = "bg-[#10B981] text-white"; // Emerald
  } else if (index % 3 === 2) {
    badgeText = "Spiritual Journey";
    badgeColor = "bg-[#F59E0B] text-white"; // Amber
  }

  // Fallback for route array if it's missing or empty
  const startPoint = pkg.route && pkg.route.length > 0 ? pkg.route[0] : "City A";
  const endPoint = pkg.route && pkg.route.length > 1 ? pkg.route[pkg.route.length - 1] : "City B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/packages/${pkg._id}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
          
          {/* Card Image Header */}
          <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
            {pkg.homePageImage ? (
              <img 
                src={`${UPLOAD_URL}${pkg.homePageImage}`} 
                alt={`${startPoint} to ${endPoint}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <IoBusOutline className="text-gray-400 opacity-50" size={48} />
              </div>
            )}
            
            {/* Top Badge overlaying the image */}
            <div className={`absolute bottom-4 left-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}>
              {badgeText}
            </div>
          </div>
          
          <div className="p-5">
            {/* Route Title */}
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-[#1E293B] font-['Outfit'] tracking-tight group-hover:text-[#4F46E5] transition-colors">
                {startPoint}
              </h3>
              <span className="text-gray-400">→</span>
              <h3 className="text-xl font-bold text-[#1E293B] font-['Outfit'] tracking-tight group-hover:text-[#4F46E5] transition-colors">
                {endPoint}
              </h3>
            </div>

            {/* Features Row */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <IoBusOutline className="text-gray-400" />
                <span>{pkg.busType || 'AC Sleeper'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <IoPeopleOutline className="text-gray-400" />
                <span>{pkg.totalSeats || 40} Seats</span>
              </div>
            </div>

            {/* Bottom Row: Price & Button */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
              <div>
                <p className="text-xl font-extrabold text-[#6366F1] font-['Outfit']">
                  {formatCurrency(pkg.price)}
                </p>
              </div>
              <button className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
