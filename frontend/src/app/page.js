'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import PackageCard from '@/components/home/PackageCard';
import Loader from '@/components/ui/Loader';
import { fetchPackages } from '@/lib/api';
import { CONTACT_INFO } from '@/lib/constants';
import { IoCall, IoLogoWhatsapp, IoMail, IoShieldCheckmark, IoBus, IoStar, IoRocket, IoSparkles } from 'react-icons/io5';

/* ── Section Heading ── */
function SectionHeading({ badge, title, highlight, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-5">
        <IoSparkles size={12} className="text-[#6366F1]" />
        <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-text-secondary)] font-semibold">{badge}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] font-['Outfit'] tracking-tight">
        {title}{' '}
        <span className="gradient-text">{highlight}</span>
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-[var(--color-text-muted)] mt-4 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon: Icon, title, desc, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-black/[0.05] p-7 transition-all duration-500 hover:border-[#6366F1]/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(124,58,237,0.06)]"
    >
      {/* Glow on hover */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ backgroundColor: `${color}10` }}
      />

      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}10`, boxShadow: `0 0 0 1px ${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-2.5 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{desc}</p>
      </div>

      {/* Bottom gradient line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

/* ── Contact Card ── */
function ContactCard({ icon: Icon, label, value, color, href, index }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative text-center rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-black/[0.05] p-8 transition-all duration-500 hover:border-[#6366F1]/20 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(124,58,237,0.06)]"
    >
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: `${color}10` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-1.5">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-text-primary)] break-all">{value}</p>
    </motion.a>
  );
}

/* ── Home Page ── */
export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── WHY CHOOSE US ── */}
      <section className="relative py-24 overflow-hidden" id="about">
        {/* BG Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/4 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Why Choose Us"
            title="Travel With"
            highlight="Confidence"
            subtitle="Experience the difference with India's most trusted bus travel partner"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={IoShieldCheckmark}
              title="Safe & Secure"
              desc="GPS-tracked fleet with experienced drivers, regular inspections, and 24/7 support for complete peace of mind."
              color="#10B981"
              index={0}
            />
            <FeatureCard
              icon={IoBus}
              title="Premium Fleet"
              desc="Modern AC buses with reclining seats, charging points, and entertainment — making every journey comfortable."
              color="#7C3AED"
              index={1}
            />
            <FeatureCard
              icon={IoStar}
              title="Best Experience"
              desc="Handpicked routes, local guides, and curated stops — turning every trip into a story worth telling."
              color="#F59E0B"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="relative py-24 overflow-hidden" id="packages">
        {/* Ambient BG */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366F1]/3 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#22D3EE]/3 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Popular Destinations"
            title="Our Tour"
            highlight="Packages"
            subtitle="Explore handpicked destinations across India with our premium bus tours"
          />

          {loading ? (
            <Loader text="Loading packages..." />
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--color-text-muted)]">No packages available at the moment.</p>
              <p className="text-xs text-[var(--color-text-muted)]/60 mt-2">Check back soon for exciting tours!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg, i) => (
                <PackageCard key={pkg._id} pkg={pkg} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/[0.04] via-transparent to-[#22D3EE]/[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/10 to-transparent" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Happy Travelers', icon: '🧳' },
              { value: '20+', label: 'Destinations', icon: '📍' },
              { value: '99%', label: 'On-Time Rate', icon: '⏱️' },
              { value: '4.9', label: 'Avg Rating', icon: '⭐' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="text-3xl sm:text-4xl font-bold font-['Outfit'] gradient-text">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="relative py-24 overflow-hidden" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="Get In Touch"
            title="Contact"
            highlight="Us"
          />

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ContactCard icon={IoCall} label="Call Us" value={CONTACT_INFO.phone} color="#7C3AED" href={`tel:${CONTACT_INFO.phone}`} index={0} />
            <ContactCard icon={IoLogoWhatsapp} label="WhatsApp" value={CONTACT_INFO.whatsapp} color="#10B981" href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`} index={1} />
            <ContactCard icon={IoMail} label="Email" value={CONTACT_INFO.email} color="#F59E0B" href={`mailto:${CONTACT_INFO.email}`} index={2} />
          </div>
        </div>
      </section>
    </>
  );
}
