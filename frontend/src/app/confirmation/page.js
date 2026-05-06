'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createBooking } from '@/lib/api';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency, formatDate, getFileUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  IoArrowBack,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoCalendarOutline,
  IoLocationOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
  const router = useRouter();
  const { resetBooking } = useBooking();
  const [bookingData, setBookingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('pendingBooking');
    if (!data) {
      toast.error('No booking data');
      router.push('/');
      return;
    }
    setBookingData(JSON.parse(data));
  }, []);

  const handleConfirm = async () => {
    if (!bookingData) return;
    setSubmitting(true);
    try {
      await createBooking({
        mainUser: bookingData.mainUser,
        passengers: bookingData.passengers,
        passengerCount: bookingData.passengerCount,
        packageId: bookingData.packageId,
      });
      sessionStorage.removeItem('pendingBooking');
      resetBooking();
      toast.success('Booking confirmed!');
      router.push('/success');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingData) return null;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#a0a0c0] hover:text-[var(--color-text-primary)] mb-8 cursor-pointer transition-colors"
        >
          <IoArrowBack size={16} /> Back
        </button>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-[var(--color-text-primary)] text-sm">
                <IoCheckmarkCircle size={18} />
              </div>
              <span className="text-sm text-[#00c9a7] font-medium hidden sm:inline">Add Passengers</span>
            </div>
            <div className="flex-1 h-px bg-[#00c9a7]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#6c63ff] flex items-center justify-center text-[var(--color-text-primary)] text-sm font-bold">2</div>
              <span className="text-sm text-[var(--color-text-primary)] font-medium hidden sm:inline">Review & Confirm</span>
            </div>
            <div className="flex-1 h-px bg-black/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#a0a0c0] text-sm font-bold">3</div>
              <span className="text-sm text-[#a0a0c0] hidden sm:inline">Success</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-2">Review Your Booking</h1>
          <p className="text-sm text-[#a0a0c0]">Please verify all details before confirming</p>
        </motion.div>

        {/* Package Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-sm font-semibold text-[#6c63ff] uppercase tracking-wider mb-3">
            Package Details
          </h3>
          <p className="text-lg font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-3">{bookingData.packageTitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Route</p>
              <div className="flex items-center gap-1.5">
                <IoLocationOutline className="text-[#6c63ff] text-xs" />
                <p className="text-xs text-[var(--color-text-primary)]">{bookingData.packageRoute?.join(' → ')}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Departure</p>
              <div className="flex items-center gap-1.5">
                <IoCalendarOutline className="text-[#f5a623] text-xs" />
                <p className="text-xs text-[var(--color-text-primary)]">{formatDate(bookingData.packageDepartureDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Passengers</p>
              <div className="flex items-center gap-1.5">
                <IoPersonOutline className="text-[#00c9a7] text-xs" />
                <p className="text-xs text-[var(--color-text-primary)]">{bookingData.passengerCount} {bookingData.passengerCount === 1 ? 'Person' : 'Persons'}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Total Amount</p>
              <p className="text-xl font-bold bg-gradient-to-r from-[#f5a623] to-[#ffc857] bg-clip-text text-transparent">
                {formatCurrency(bookingData.totalAmount)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main User */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#6c63ff]/20 flex items-center justify-center">
              <IoPersonOutline className="text-[#6c63ff]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Primary Passenger</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Name</p>
              <p className="text-[var(--color-text-primary)]">{bookingData.mainUser.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Mobile</p>
              <p className="text-[var(--color-text-primary)]">{bookingData.mainUser.mobile}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">DOB</p>
              <p className="text-[var(--color-text-primary)]">{formatDate(bookingData.mainUser.dob)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {bookingData.mainUser.aadhaarImage && (
              <div>
                <p className="text-[10px] text-[#a0a0c0] uppercase mb-2 flex items-center gap-1">
                  <IoDocumentTextOutline className="text-xs" /> Aadhaar Card
                </p>
                <img
                  src={getFileUrl(bookingData.mainUser.aadhaarImage)}
                  alt="Aadhaar"
                  className="w-full h-24 object-cover rounded-lg border border-black/10"
                />
              </div>
            )}
            {bookingData.mainUser.panImage && (
              <div>
                <p className="text-[10px] text-[#a0a0c0] uppercase mb-2 flex items-center gap-1">
                  <IoDocumentTextOutline className="text-xs" /> PAN Card
                </p>
                <img
                  src={getFileUrl(bookingData.mainUser.panImage)}
                  alt="PAN"
                  className="w-full h-24 object-cover rounded-lg border border-black/10"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Additional Passengers */}
        {bookingData.passengers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-6"
          >
            {bookingData.passengers.map((p, i) => (
              <div key={i} className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center text-xs text-[#6c63ff] font-bold">
                    {i + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Passenger {i + 1}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">Name</p>
                    <p className="text-[var(--color-text-primary)]">{p.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#a0a0c0] uppercase mb-1">DOB</p>
                    <p className="text-[var(--color-text-primary)]">{formatDate(p.dob)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {p.aadhaarImage && (
                    <div>
                      <p className="text-[10px] text-[#a0a0c0] uppercase mb-2 flex items-center gap-1">
                        <IoDocumentTextOutline className="text-xs" /> Aadhaar Card
                      </p>
                      <img
                        src={getFileUrl(p.aadhaarImage)}
                        alt="Aadhaar"
                        className="w-full h-20 object-cover rounded-lg border border-black/10"
                      />
                    </div>
                  )}
                  {p.panImage && (
                    <div>
                      <p className="text-[10px] text-[#a0a0c0] uppercase mb-2 flex items-center gap-1">
                        <IoDocumentTextOutline className="text-xs" /> PAN Card
                      </p>
                      <img
                        src={getFileUrl(p.panImage)}
                        alt="PAN"
                        className="w-full h-20 object-cover rounded-lg border border-black/10"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Confirm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#f5a623] font-medium">💰 Offline Payment Only</p>
            <p className="text-xs text-[#a0a0c0] mt-1">
              Payment will be collected at our office or via bank transfer.
            </p>
          </div>
          <Button onClick={handleConfirm} loading={submitting} className="w-full" size="lg">
            <span className="flex items-center gap-2">
              <IoCheckmarkCircle size={20} /> Confirm Booking
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
