'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMenu, IoClose, IoBus, IoCall, IoPerson } from 'react-icons/io5';
import { NAV_LINKS } from '@/lib/constants';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, userLogout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleOpenAuth = () => setIsAuthOpen(true);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('openAuthModal', handleOpenAuth);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openAuthModal', handleOpenAuth);
    };
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-md shadow-[#6366F1]/20">
              <IoBus className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1E293B] font-['Outfit'] tracking-tight leading-none">Khurana</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#6366F1] font-semibold mt-0.5">Travels</p>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      isActive ? 'text-[#6366F1] bg-[#EEF2FF]' : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section - Phone Pill & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-full shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all group"
            >
              <IoCall className="text-[#6366F1] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[#1E293B]">+91 98765 43210</span>
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm font-semibold text-[#1E293B] bg-[#F1F5F9] px-4 py-2 rounded-full hover:bg-[#E2E8F0] transition-colors"
                >
                  <IoPerson className="text-[#6366F1]" />
                  Hi, {user.firstName}
                </Link>
                <button
                  onClick={userLogout}
                  className="px-5 py-2.5 bg-[#EF4444] text-white rounded-full text-sm font-semibold hover:bg-[#DC2626] transition-all shadow-sm shadow-[#EF4444]/20 hover:shadow-md hover:shadow-[#EF4444]/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] text-white rounded-full text-sm font-semibold hover:bg-[#0F172A] transition-all shadow-sm hover:shadow-md"
              >
                <IoPerson className="text-white" />
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            {isOpen ? <IoClose size={26} /> : <IoMenu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-all ${
                      isActive ? 'text-[#6366F1] bg-[#EEF2FF]' : 'text-[#64748B] hover:text-[#1E293B] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#1E293B]"
                >
                  <IoCall className="text-[#6366F1]" />
                  +91 98765 43210
                </a>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-[#1E293B] bg-[#F1F5F9] px-4 py-3 rounded-xl hover:bg-[#E2E8F0] transition-colors"
                    >
                      <IoPerson className="text-[#6366F1]" />
                      My Profile ({user.firstName})
                    </Link>
                    <button
                      onClick={() => {
                        userLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#EF4444] text-white rounded-xl text-sm font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1E293B] text-white rounded-xl text-sm font-semibold"
                  >
                    <IoPerson />
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
