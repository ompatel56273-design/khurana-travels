'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import Loader from '@/components/ui/Loader';
import { fetchDashboardStats } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  IoDocumentTextOutline, IoCheckmarkCircle, IoTimeOutline,
  IoCloseCircle, IoCarOutline, IoCashOutline, IoStatsChart,
} from 'react-icons/io5';

export default function AdminDashboard() {
  const { admin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !admin) { router.push('/admin/login'); return; }
    if (admin) loadStats();
  }, [admin, authLoading]);

  const loadStats = async () => {
    try { const data = await fetchDashboardStats(); setStats(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (authLoading || !admin) return <Loader />;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white font-['Outfit'] mb-1">Dashboard</h1>
          <p className="text-sm text-neutral-400 mb-8">Welcome back, {admin.username}</p>
        </motion.div>

        {loading ? <Loader /> : stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Bookings" value={stats.totalBookings} icon={IoDocumentTextOutline} color="#ef4444" index={0} />
              <StatsCard title="Pending" value={stats.pendingBookings} icon={IoTimeOutline} color="#f5a623" index={1} />
              <StatsCard title="Confirmed" value={stats.confirmedBookings} icon={IoCheckmarkCircle} color="#00c9a7" index={2} />
              <StatsCard title="Revenue" value={formatCurrency(stats.revenue)} icon={IoCashOutline} color="#00c9a7" index={3} />
            </div>

            {/* Seat Occupancy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-white font-['Outfit'] mb-4 flex items-center gap-2">
                <IoStatsChart className="text-red-500" /> Seat Occupancy
              </h2>
              <div className="space-y-4">
                {stats.seatOccupancy?.map((pkg) => (
                  <div key={pkg.packageId}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-white">{pkg.title}</p>
                      <p className="text-xs text-neutral-400">{pkg.bookedSeats}/{pkg.totalSeats} ({pkg.occupancyRate}%)</p>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pkg.occupancyRate}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Bookings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white font-['Outfit'] mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {stats.recentBookings?.map((b) => (
                  <div key={b._id} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{b.mainUser?.name}</p>
                      <p className="text-xs text-neutral-400">{b.packageId?.title}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      b.status === 'confirmed' ? 'bg-[#00c9a7]/10 text-[#00c9a7]' :
                      b.status === 'cancelled' ? 'bg-[#ff4757]/10 text-[#ff4757]' :
                      'bg-[#f5a623]/10 text-[#f5a623]'
                    }`}>{b.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
