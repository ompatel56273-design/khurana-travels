'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { fetchPackageById, uploadFile } from '@/lib/api';
import BookingForm from '@/components/booking/BookingForm';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  IoArrowBack,
  IoArrowForward,
  IoPersonOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { packageData, passengerCount, mainUser, passengers, setPackageData, setPassengerCount } = useBooking();
  const [loading, setLoading] = useState(!packageData);

  useEffect(() => {
    if (!packageData) {
      fetchPackageById(params.id)
        .then((data) => {
          setPackageData(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load');
          router.push('/');
        });
    }
  }, [params.id]);

  useEffect(() => {
    if (!loading && passengerCount < 1) {
      toast.error('Select number of passengers first');
      router.push(`/packages/${params.id}`);
    }
  }, [loading, passengerCount]);

  const validateForm = () => {
    // Validate main user
    if (!mainUser.name || mainUser.name.trim().length < 2) {
      toast.error('Enter your full name');
      return false;
    }
    if (!mainUser.mobile || !/^[6-9]\d{9}$/.test(mainUser.mobile)) {
      toast.error('Enter valid 10-digit mobile number');
      return false;
    }
    if (!mainUser.dob) {
      toast.error('Enter date of birth');
      return false;
    }
    if (!mainUser.aadhaarImage) {
      toast.error('Upload Aadhaar Card image');
      return false;
    }

    // Validate additional passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || passengers[i].name.trim().length < 2) {
        toast.error(`Enter full name for Passenger ${i + 1}`);
        return false;
      }
      if (!passengers[i].dob) {
        toast.error(`Enter date of birth for Passenger ${i + 1}`);
        return false;
      }
      if (!passengers[i].aadhaarImage) {
        toast.error(`Upload Aadhaar Card image for Passenger ${i + 1}`);
        return false;
      }
    }

    // Check total passengers count
    const totalPassengers = 1 + passengers.length;
    if (totalPassengers !== passengerCount) {
      toast.error(`Please add ${passengerCount - 1} additional passenger${passengerCount - 1 > 1 ? 's' : ''}`);
      return false;
    }

    return true;
  };

  const handleProceed = async () => {
    if (!validateForm()) return;
    try {
      const tid = toast.loading('Uploading documents...');

      // Upload main user documents
      let aadhaarUrl = '', panUrl = '';
      if (mainUser.aadhaarImage instanceof File) {
        const r = await uploadFile(mainUser.aadhaarImage);
        aadhaarUrl = r.file;
      }
      if (mainUser.panImage instanceof File) {
        const r = await uploadFile(mainUser.panImage);
        panUrl = r.file;
      }

      // Upload passenger documents
      const uploadedPassengers = [];
      for (const p of passengers) {
        let au = '', pu = '';
        if (p.aadhaarImage instanceof File) {
          const r = await uploadFile(p.aadhaarImage);
          au = r.file;
        }
        if (p.panImage instanceof File) {
          const r = await uploadFile(p.panImage);
          pu = r.file;
        }
        uploadedPassengers.push({
          name: p.name,
          dob: p.dob,
          aadhaarImage: au,
          panImage: pu,
        });
      }

      sessionStorage.setItem(
        'pendingBooking',
        JSON.stringify({
          mainUser: {
            name: mainUser.name,
            mobile: mainUser.mobile,
            dob: mainUser.dob,
            aadhaarImage: aadhaarUrl,
            panImage: panUrl,
          },
          passengers: uploadedPassengers,
          passengerCount,
          packageId: params.id,
          packageTitle: packageData.title,
          packageRoute: packageData.route,
          packageDepartureDate: packageData.departureDate,
          packageDuration: packageData.duration,
          packagePrice: packageData.price,
          totalAmount: passengerCount * packageData.price,
        })
      );

      toast.dismiss(tid);
      toast.success('Documents uploaded successfully');
      router.push('/confirmation');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
  };

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (!packageData || passengerCount < 1) return null;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Package */}
        <Link
          href={`/packages/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-[#a0a0c0] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <IoArrowBack size={16} /> Back to Package
        </Link>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#6c63ff] flex items-center justify-center text-[var(--color-text-primary)] text-sm font-bold">1</div>
              <span className="text-sm text-[var(--color-text-primary)] font-medium hidden sm:inline">Add Passengers</span>
            </div>
            <div className="flex-1 h-px bg-black/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#a0a0c0] text-sm font-bold">2</div>
              <span className="text-sm text-[#a0a0c0] hidden sm:inline">Review & Confirm</span>
            </div>
            <div className="flex-1 h-px bg-black/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#a0a0c0] text-sm font-bold">3</div>
              <span className="text-sm text-[#a0a0c0] hidden sm:inline">Success</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-2">Add Passenger Details</h1>
          <p className="text-sm text-[#a0a0c0]">
            {packageData.title} • {passengerCount} {passengerCount === 1 ? 'person' : 'persons'}
          </p>
        </motion.div>

        {/* Package Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-5 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] uppercase text-[#a0a0c0] tracking-wider mb-1">Package</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{packageData.title}</p>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div>
                <p className="text-[10px] uppercase text-[#a0a0c0] tracking-wider mb-1">Passengers</p>
                <div className="flex items-center gap-1.5">
                  <IoPersonOutline className="text-[#6c63ff] text-sm" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{passengerCount}</span>
                </div>
              </div>
              <div className="h-8 w-px bg-black/10 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase text-[#a0a0c0] tracking-wider mb-1">Departure</p>
                <div className="flex items-center gap-1.5">
                  <IoCalendarOutline className="text-[#f5a623] text-sm" />
                  <span className="text-xs text-[var(--color-text-primary)]">{formatDate(packageData.departureDate)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#a0a0c0] tracking-wider mb-1">Total</p>
              <p className="text-lg font-bold bg-gradient-to-r from-[#f5a623] to-[#ffc857] bg-clip-text text-transparent">
                {formatCurrency(passengerCount * packageData.price)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BookingForm />
        </motion.div>

        {/* Proceed Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button onClick={handleProceed} className="w-full" size="lg">
            <span className="flex items-center gap-2">
              Review & Confirm
              <IoArrowForward />
            </span>
          </Button>
          <p className="text-xs text-[#a0a0c0]/50 text-center mt-3">
            Review all details before final submission
          </p>
        </motion.div>
      </div>
    </div>
  );
}
