'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IoArrowForward, IoPlay, IoLocationOutline, IoCalendarOutline, IoPersonOutline, IoStar, IoRibbonOutline, IoShieldCheckmark, IoHeadsetOutline, IoPricetagOutline, IoWifi, IoSnow, IoCarOutline } from 'react-icons/io5';

const FeaturesStrip = () => {
  const features = [
    { icon: IoRibbonOutline, title: 'Premium Comfort', sub: 'Spacious AC Buses', color: 'text-[#6366F1]', bg: 'bg-[#EEF2FF]' },
    { icon: IoShieldCheckmark, title: 'On-Time Guarantee', sub: '99% On-Time Performance', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]' },
    { icon: IoShieldCheckmark, title: 'Safe & Secure', sub: 'Your Safety Our Priority', color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]' },
    { icon: IoHeadsetOutline, title: '24/7 Support', sub: 'Always Here to Help', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
    { icon: IoPricetagOutline, title: 'Best Prices', sub: 'Affordable & Transparent', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-50 py-5 px-6 mt-16 lg:mt-24 mx-auto relative z-30 w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.bg}`}>
              <f.icon className={`text-lg ${f.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{f.title}</h4>
              <p className="text-[10px] text-gray-500">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-16 min-h-[90vh] bg-[#F8FAFC] overflow-hidden flex flex-col justify-center">
      {/* Soft Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#EEF2FF] to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-[#F0F9FF] to-transparent rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[11px] font-semibold text-gray-600 tracking-wide uppercase">
                Premium Bus Travel Across India
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold font-['Outfit'] leading-[1.1] tracking-tight mb-6 text-[#1E293B]">
              Travel in <span className="text-[#3B82F6]">Comfort</span>
              <br />
              Arrive in <span className="text-[#F59E0B]">Style</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              Explore India's most iconic destinations with premium AC buses, handpicked routes, and unforgettable experiences.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#packages"
                className="group relative inline-flex items-center gap-2 px-6 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl overflow-hidden transition-all shadow-lg shadow-indigo-200"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Packages
                  <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-semibold transition-all shadow-sm"
              >
                <IoPlay className="text-[#F59E0B]" />
                Watch Journey
              </Link>
            </div>
          </motion.div>

          {/* Right Visual - Bus */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[400px] lg:max-w-[550px] aspect-square mx-auto flex items-center justify-center mt-10 lg:mt-0"
          >
            {/* Inner Ring (Solid Soft Circle) */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-[#EEF2FF] shadow-inner" />
            
            {/* Outer Ring (Thin Line) */}
            <div className="absolute w-[100%] h-[100%] rounded-full border border-dashed border-[#6366F1]/20" />

            {/* The Bus Image - Now perfectly transparent! */}
            <img 
              src="/images/bus-transparent.png" 
              alt="Premium Bus" 
              className="absolute z-10 w-[115%] lg:w-[125%] max-w-none object-contain brightness-[1.05] drop-shadow-2xl"
            />

            {/* Floating Icons on Outer Ring (In FRONT of Bus) */}
            {/* Top Left - Seat (~10:30 position -> 14.6%) */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[14%] left-[14%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#6366F1] shadow-lg shadow-indigo-200 flex items-center justify-center z-30">
              <IoPersonOutline className="text-white text-lg lg:text-xl" />
            </motion.div>

            {/* Bottom Left - Wifi (~8:00 position -> y=75%, x=6.7%) */}
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[25%] left-[7%] w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#3B82F6] shadow-lg shadow-blue-200 flex items-center justify-center z-30">
              <IoWifi className="text-white text-xl lg:text-2xl" />
            </motion.div>

            {/* Top Right - AC Snowflake (~2:00 position -> y=25%, x=93.3%) */}
            <motion.div animate={{ y: [-4, 6, -4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[25%] right-[7%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0EA5E9] shadow-lg shadow-sky-200 flex items-center justify-center z-30">
              <IoSnow className="text-white text-lg lg:text-xl" />
            </motion.div>
          </motion.div>

        </div>

        {/* Features */}
        <FeaturesStrip />

      </div>
    </section>
  );
};

export default HeroSection;
