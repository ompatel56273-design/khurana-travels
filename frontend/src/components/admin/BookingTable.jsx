'use client';
import { motion } from 'framer-motion';
import { formatDate, formatCurrency } from '@/lib/utils';
import { IoEyeOutline, IoCheckmarkCircle, IoCloseCircle, IoTimeOutline, IoTrashOutline } from 'react-icons/io5';

const statusConfig = {
  pending: { color: '#f5a623', bg: 'bg-[#f5a623]/10', icon: IoTimeOutline, label: 'Pending' },
  confirmed: { color: '#00c9a7', bg: 'bg-[#00c9a7]/10', icon: IoCheckmarkCircle, label: 'Confirmed' },
  cancelled: { color: '#ff4757', bg: 'bg-[#ff4757]/10', icon: IoCloseCircle, label: 'Cancelled' },
};

const BookingTable = ({ bookings, onStatusChange, onView, onDelete }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-900 rounded-2xl border border-neutral-800">
        <p className="text-neutral-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-800">
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-900 border-b border-neutral-800">
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Passenger</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Package</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Seats</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Amount</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Date</th>
            <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, i) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.tr
                key={booking._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">{booking.mainUser?.name}</p>
                    <p className="text-xs text-neutral-400">{booking.mainUser?.mobile}</p>
                    {booking.user?.email && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">{booking.user.email}</p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white">{booking.packageId?.title || 'N/A'}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {booking.seats && booking.seats.length > 0 ? (
                      booking.seats.map((seat) => (
                        <span key={seat} className="px-2 py-0.5 bg-[#6c63ff]/10 text-[#6c63ff] text-xs rounded-md font-mono">
                          {seat}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded-md font-mono">
                        {booking.passengerCount || 0} {booking.passengerCount === 1 ? 'Seat' : 'Seats'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#f5a623]">{formatCurrency(booking.totalAmount)}</p>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => onStatusChange(booking._id, e.target.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full outline-none cursor-pointer ${status.bg} border-none`}
                    style={{ color: status.color }}
                  >
                    <option value="pending" className="bg-neutral-900 text-white">Pending</option>
                    <option value="confirmed" className="bg-neutral-900 text-white">Confirmed</option>
                    <option value="cancelled" className="bg-neutral-900 text-white">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-neutral-400">{formatDate(booking.createdAt)}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(booking)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                      title="View details"
                    >
                      <IoEyeOutline size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(booking._id)}
                      className="p-2 rounded-lg bg-[#ff4757]/10 hover:bg-[#ff4757]/20 text-[#ff4757] transition-all cursor-pointer"
                      title="Delete booking"
                    >
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
