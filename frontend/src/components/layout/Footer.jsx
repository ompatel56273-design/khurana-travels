'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCall, IoMail, IoLogoWhatsapp, IoLocationSharp, IoBus, IoLogoInstagram, IoLogoTwitter, IoLogoFacebook, IoArrowForward, IoChevronForward } from 'react-icons/io5';
import { CONTACT_INFO, NAV_LINKS } from '@/lib/constants';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');

  if (pathname.startsWith('/admin')) return null;

  const socials = [
    { icon: IoLogoInstagram, href: '#', color: '#E1306C', label: 'Instagram' },
    { icon: IoLogoTwitter, href: '#', color: '#1DA1F2', label: 'Twitter' },
    { icon: IoLogoFacebook, href: '#', color: '#4267B2', label: 'Facebook' },
    { icon: IoLogoWhatsapp, href: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`, color: '#25D366', label: 'WhatsApp' },
  ];

  return (
    <footer className="relative bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden mb-16 bg-gradient-to-r from-[#171B36] to-[#0D1120] border border-[#1F2937] shadow-2xl"
        >
          <div className="relative p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#1E2553] flex items-center justify-center flex-shrink-0">
                <IoMail className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mb-1">
                  Stay in the Loop
                </h3>
                <p className="text-sm text-gray-400">Get exclusive deals and travel updates straight to your inbox.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-80 bg-[#0B0F19] border border-[#1F2937] text-white placeholder-gray-500 py-3.5 px-5 rounded-xl text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
              />
              <button className="px-6 py-3.5 bg-[#6366F1] text-white rounded-xl hover:bg-[#4F46E5] transition-colors flex items-center justify-center flex-shrink-0">
                <IoArrowForward size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 mb-12">
          {/* Brand */}
          <div className="lg:pr-8 lg:border-r border-[#1F2937]">
            <Link href="/" className="flex items-center gap-2.5 mb-6 inline-flex">
              <div className="w-10 h-10 rounded-[10px] bg-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <IoBus className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] leading-tight">Khurana</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366F1] font-semibold">Travels</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your premium travel partner for unforgettable bus journeys across India&apos;s most beautiful destinations.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-[#131827] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#6366F1] transition-all duration-300 shadow-sm"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:px-8 lg:border-r border-[#1F2937]">
            <h4 className="text-[15px] font-bold text-white font-['Outfit'] mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center justify-between group">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{link.label}</span>
                    <IoChevronForward className="text-[#6366F1] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:px-8 lg:border-r border-[#1F2937]">
            <h4 className="text-[15px] font-bold text-white font-['Outfit'] mb-6 tracking-wide">Contact</h4>
            <ul className="space-y-5">
              {[
                { icon: IoCall, value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                { icon: IoLogoWhatsapp, value: CONTACT_INFO.whatsapp, href: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}` },
                { icon: IoMail, value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i}>
                    <a href={item.href} className="flex items-center gap-3 group">
                      <Icon size={18} className="text-[#6366F1]" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors break-all">{item.value}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Office */}
          <div className="lg:pl-8">
            <h4 className="text-[15px] font-bold text-white font-['Outfit'] mb-6 tracking-wide">Office</h4>
            <div className="flex items-start gap-3">
              <IoLocationSharp className="text-[#6366F1] flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm text-gray-400 leading-relaxed">{CONTACT_INFO.address}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1F2937] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-gray-500">
            © {new Date().getFullYear()} Khurana Travels. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-[#1F2937]">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
