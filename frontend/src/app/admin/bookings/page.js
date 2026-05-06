'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BookingTable from '@/components/admin/BookingTable';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Loader from '@/components/ui/Loader';
import { fetchBookings, updateBookingStatus, deleteBooking } from '@/lib/api';
import { formatCurrency, formatDate, getFileUrl } from '@/lib/utils';
import { IoPersonOutline, IoFunnelOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
  const { admin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [viewBooking, setViewBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    if (!authLoading && !admin) { router.push('/admin/login'); return; }
    if (admin) loadBookings();
  }, [admin, authLoading, filter]);

  const loadBookings = async () => {
    try {
      const filters = filter ? { status: filter } : {};
      const data = await fetchBookings(filters);
      setBookings(data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateBookingStatus(id, status); toast.success('Status updated'); loadBookings(); }
    catch (err) { toast.error(err.message); }
  };

  const handleDelete = (id) => {
    setBookingToDelete(id);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    try { 
      await deleteBooking(bookingToDelete); 
      toast.success('Booking deleted'); 
      loadBookings(); 
    }
    catch (err) { toast.error(err.message); }
    finally { setBookingToDelete(null); }
  };

  if (authLoading || !admin) return <Loader />;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">Bookings</h1>
            <p className="text-sm text-neutral-400">{bookings.length} bookings</p>
          </motion.div>
          <div className="flex items-center gap-2">
            <IoFunnelOutline className="text-neutral-400" />
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer focus:border-red-500">
              <option value="" className="bg-[#1a1a2e]">All</option>
              <option value="pending" className="bg-[#1a1a2e]">Pending</option>
              <option value="confirmed" className="bg-[#1a1a2e]">Confirmed</option>
              <option value="cancelled" className="bg-[#1a1a2e]">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? <Loader /> : (
          <BookingTable bookings={bookings} onStatusChange={handleStatusChange} onView={setViewBooking} onDelete={handleDelete} />
        )}

        {/* View Booking Modal */}
        <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} title="Booking Details" maxWidth="max-w-2xl">
          {viewBooking && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs text-red-500 uppercase tracking-wider mb-3 font-semibold">Package</h4>
                <p className="text-white font-semibold">{viewBooking.packageId?.title}</p>
                <p className="text-sm text-neutral-400 mt-1">Seats: {viewBooking.seats?.join(', ')}</p>
                <p className="text-sm text-[#f5a623] font-semibold mt-1">{formatCurrency(viewBooking.totalAmount)}</p>
              </div>
              <div>
                <h4 className="text-xs text-red-500 uppercase tracking-wider mb-3 font-semibold">Primary Passenger</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-neutral-400 text-xs">Name</p><p className="text-white">{viewBooking.mainUser?.name}</p></div>
                  <div><p className="text-neutral-400 text-xs">Mobile</p><p className="text-white">{viewBooking.mainUser?.mobile}</p></div>
                  <div><p className="text-neutral-400 text-xs">DOB</p><p className="text-white">{formatDate(viewBooking.mainUser?.dob)}</p></div>
                </div>
                {viewBooking.mainUser?.aadhaarImage && (
                  <div className="mt-3">
                     <p className="text-xs text-neutral-400 mb-1">Aadhaar</p>
                     <img src={getFileUrl(viewBooking.mainUser.aadhaarImage)} alt="Aadhaar" className="h-24 object-cover rounded-lg border border-neutral-800" />
                  </div>
                )}
              </div>
              {viewBooking.passengers?.length > 0 && (
                <div>
                  <h4 className="text-xs text-red-500 uppercase tracking-wider mb-3 font-semibold">Additional Passengers</h4>
                  {viewBooking.passengers.map((p, i) => (
                    <div key={i} className="bg-neutral-800/50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-white font-medium">{p.name}</p>
                      <p className="text-xs text-neutral-400">DOB: {formatDate(p.dob)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!bookingToDelete}
          onClose={() => setBookingToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </main>
    </div>
  );
}
