'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  IoCheckmarkCircle,
  IoCall,
  IoLogoWhatsapp,
  IoMail,
  IoHomeOutline,
  IoSparkles,
} from 'react-icons/io5';
import { CONTACT_INFO } from '@/lib/constants';

export default function SuccessPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        {/* Step Indicator - All Done */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-[var(--color-text-primary)] text-sm">
                <IoCheckmarkCircle size={18} />
              </div>
            </div>
            <div className="w-12 h-px bg-[#00c9a7]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-[var(--color-text-primary)] text-sm">
                <IoCheckmarkCircle size={18} />
              </div>
            </div>
            <div className="w-12 h-px bg-[#00c9a7]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-[var(--color-text-primary)] text-sm">
                <IoCheckmarkCircle size={18} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#00c9a7]/20 to-[#00c9a7]/5 flex items-center justify-center relative">
            <IoCheckmarkCircle className="text-[#00c9a7] text-6xl" />
            <div className="absolute inset-0 rounded-full bg-[#00c9a7]/10 animate-ping" />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-1 -right-1"
            >
              <IoSparkles className="text-[#f5a623] text-xl" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-3">Booking Confirmed!</h1>
          <p className="text-sm text-[#a0a0c0] leading-relaxed mb-8">
            Your booking has been successfully submitted. Our team will contact you shortly to confirm payment and finalize your reservation.
          </p>
        </motion.div>

        {/* Payment Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-2xl p-6 mb-8"
        >
          <p className="text-lg font-semibold text-[#f5a623] mb-2">💰 Offline Payment Only</p>
          <p className="text-sm text-[#a0a0c0] leading-relaxed">
            Please complete payment at our office or via bank transfer. Your reservation will be held for 24 hours.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="bg-black/5 border border-black/10 rounded-xl p-4 hover:border-[#6c63ff]/50 transition-all"
          >
            <IoCall className="text-[#6c63ff] text-xl mx-auto mb-2" />
            <p className="text-xs text-[#a0a0c0]">Call Us</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)] mt-1">{CONTACT_INFO.phone}</p>
          </a>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            className="bg-black/5 border border-black/10 rounded-xl p-4 hover:border-[#00c9a7]/50 transition-all"
          >
            <IoLogoWhatsapp className="text-[#00c9a7] text-xl mx-auto mb-2" />
            <p className="text-xs text-[#a0a0c0]">WhatsApp</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)] mt-1">{CONTACT_INFO.whatsapp}</p>
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="bg-black/5 border border-black/10 rounded-xl p-4 hover:border-[#f5a623]/50 transition-all overflow-hidden min-w-0"
          >
            <IoMail className="text-[#f5a623] text-xl mx-auto mb-2" />
            <p className="text-xs text-[#a0a0c0]">Email</p>
            <p className="text-xs font-medium text-[var(--color-text-primary)] mt-1 break-all">{CONTACT_INFO.email}</p>
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-[var(--color-text-primary)] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#6c63ff]/30 transition-all"
          >
            <IoHomeOutline size={18} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
