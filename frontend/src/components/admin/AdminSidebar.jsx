'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import {
  IoGridOutline,
  IoCarOutline,
  IoDocumentTextOutline,
  IoLogOutOutline,
  IoChevronBack,
  IoBus,
  IoPeopleOutline,
} from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin/dashboard', icon: IoGridOutline, label: 'Dashboard' },
  { href: '/admin/users', icon: IoPeopleOutline, label: 'Users' },
  { href: '/admin/packages', icon: IoCarOutline, label: 'Packages' },
  { href: '/admin/bookings', icon: IoDocumentTextOutline, label: 'Bookings' },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-neutral-800 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
            <IoBus className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-['Outfit']">Khurana Travels</h1>
            <p className="text-[9px] uppercase tracking-widest text-red-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-red-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={18} className={isActive ? 'text-red-500' : ''} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <IoChevronBack size={18} />
          Back to Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#ff4757] hover:bg-[#ff4757]/10 transition-all cursor-pointer"
        >
          <IoLogOutOutline size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
