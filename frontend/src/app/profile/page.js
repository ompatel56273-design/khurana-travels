'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/ui/Loader';
import { fetchMyBookings, cancelMyBooking, downloadBookingPDF } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { IoPersonOutline, IoTicketOutline, IoCloseCircleOutline, IoCheckmarkCircle, IoTimeOutline, IoCloseCircle, IoDownloadOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      toast.error('Please login to view your profile');
      return;
    }
    if (user) loadBookings();
  }, [user, authLoading]);

  const loadBookings = async () => {
    try {
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelMyBooking(id);
      toast.success('Booking cancelled successfully');
      loadBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  const handleDownloadPDF = async (id, title) => {
    try {
      toast.loading('Preparing PDF...', { id: 'downloadPdf' });
      const blob = await downloadBookingPDF(id);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Booking.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully', { id: 'downloadPdf' });
    } catch (err) {
      toast.error('Failed to download PDF', { id: 'downloadPdf' });
    }
  };

  if (authLoading || !user) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* User Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] sticky top-28"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center mb-4 shadow-lg shadow-[#6366F1]/20">
                  <IoPersonOutline className="text-white text-4xl" />
                </div>
                <h2 className="text-xl font-bold text-[#1E293B] font-['Outfit']">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-[#64748B] mb-6">{user.email}</p>
                
                <div className="w-full pt-6 border-t border-[#F1F5F9] text-left space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-[#1E293B]">{user.dob ? formatDate(user.dob) : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Status</p>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      user.isVerified ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {user.isVerified ? <IoCheckmarkCircle /> : <IoCloseCircle />}
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bookings Area */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#EEF2FF] rounded-xl">
                  <IoTicketOutline className="text-[#6366F1] text-xl" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E293B] font-['Outfit']">My Bookings</h1>
              </div>

              {loading ? (
                <div className="flex justify-center py-12"><Loader /></div>
              ) : bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                    <IoTicketOutline className="text-[#94A3B8] text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2 font-['Outfit']">No Bookings Found</h3>
                  <p className="text-[#64748B] max-w-md mx-auto mb-6">You haven't booked any travel packages yet. Explore our amazing destinations and book your next trip!</p>
                  <button onClick={() => router.push('/#packages')} className="btn-primary">
                    <span>Explore Packages</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, i) => {
                    const isPending = booking.status === 'pending';
                    const isConfirmed = booking.status === 'confirmed';
                    const isCancelled = booking.status === 'cancelled';
                    
                    return (
                      <motion.div 
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-row gap-6"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              isConfirmed ? 'bg-[#10B981]/10 text-[#10B981]' :
                              isCancelled ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                              'bg-[#F59E0B]/10 text-[#F59E0B]'
                            }`}>
                              {isConfirmed && <IoCheckmarkCircle />}
                              {isCancelled && <IoCloseCircle />}
                              {isPending && <IoTimeOutline />}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className="text-xs font-medium text-[#64748B]">
                              Booked on {formatDate(booking.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-[#1E293B] font-['Outfit'] mb-2">
                            {booking.packageId?.title || 'Unknown Package'}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748B] mb-4">
                            <p><strong>Primary Pax:</strong> {booking.mainUser?.name}</p>
                            <p><strong>Total Pax:</strong> {booking.passengerCount}</p>
                            <p><strong>Seats:</strong> {booking.seats?.join(', ') || 'N/A'}</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-lg font-bold text-[#F59E0B]">
                              {formatCurrency(booking.totalAmount)}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#F1F5F9] sm:pl-6">
                          <button
                            onClick={() => handleDownloadPDF(booking._id, booking.packageId?.title || 'Khurana_Travels')}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6366F1]/10 text-[#6366F1] rounded-xl text-sm font-semibold hover:bg-[#6366F1]/20 transition-colors"
                          >
                            <IoDownloadOutline size={18} /> Download PDF
                          </button>
                          {(isPending || isConfirmed) && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#EF4444] text-[#EF4444] rounded-xl text-sm font-semibold hover:bg-[#EF4444]/5 transition-colors"
                            >
                              <IoCloseCircleOutline size={18} /> Cancel
                            </button>
                          )}
                          <button
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F1F5F9] text-[#1E293B] rounded-xl text-sm font-semibold hover:bg-[#E2E8F0] transition-colors"
                          >
                            Need Help?
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
