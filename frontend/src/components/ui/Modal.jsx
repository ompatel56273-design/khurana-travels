'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative w-full ${maxWidth} bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden max-h-[85vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-between p-5 border-b border-neutral-800">
              <h2 className="text-lg font-bold text-white font-['Outfit']">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <IoClose size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
