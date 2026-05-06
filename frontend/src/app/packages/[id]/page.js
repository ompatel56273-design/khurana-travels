'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchPackageById } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import ItineraryTimeline from '@/components/packages/ItineraryTimeline';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import {
  IoArrowBack,
  IoCalendarOutline,
  IoLocationOutline,
  IoArrowForward,
  IoTimeOutline,
  IoPersonOutline,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
  IoSnow,
  IoSunny,
  IoBed,
  IoWifi,
  IoWater,
  IoMusicalNotes,
  IoCheckmarkCircle,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import toast from 'react-hot-toast';

const amenitiesMap = {
  'AC': [
    { icon: IoSnow, label: 'Air Conditioned' },
    { icon: IoBed, label: 'Reclining Seats' },
    { icon: IoWater, label: 'Water Bottle' },
    { icon: IoMusicalNotes, label: 'Music System' },
  ],
  'AC Sleeper': [
    { icon: IoSnow, label: 'Air Conditioned' },
    { icon: IoBed, label: 'Sleeper Berths' },
    { icon: IoWater, label: 'Water Bottle' },
    { icon: IoWifi, label: 'Charging Points' },
  ],
  'Non-AC': [
    { icon: IoSunny, label: 'Natural Ventilation' },
    { icon: IoBed, label: 'Padded Seats' },
    { icon: IoWater, label: 'Water Bottle' },
    { icon: IoMusicalNotes, label: 'Music System' },
  ],
  'Non-AC Sleeper': [
    { icon: IoSunny, label: 'Natural Ventilation' },
    { icon: IoBed, label: 'Sleeper Berths' },
    { icon: IoWater, label: 'Water Bottle' },
    { icon: IoMusicalNotes, label: 'Music System' },
  ],
};

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { passengerCount, setPassengerCount, setPackageData } = useBooking();

  useEffect(() => {
    loadPackage();
    setPassengerCount(1);
  }, [params.id]);

  const loadPackage = async () => {
    try {
      const data = await fetchPackageById(params.id);
      setPkg(data);
      setPackageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableSpots = pkg ? pkg.totalSeats - (pkg.bookedSeats?.length || 0) : 0;

  const handleProceedToBooking = () => {
    if (!user) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    if (passengerCount < 1 || passengerCount > availableSpots) return;
    router.push(`/booking/${params.id}`);
  };

  if (loading) return <div className="pt-24"><Loader text="Loading package details..." /></div>;
  if (error) {
    return (
      <div className="pt-24 text-center">
        <p className="text-[#ff4757] mb-4">{error}</p>
        <Link href="/" className="text-[#6c63ff] hover:underline">Back to Home</Link>
      </div>
    );
  }
  if (!pkg) return null;

  const busAmenities = amenitiesMap[pkg.busType] || amenitiesMap['AC'];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#a0a0c0] hover:text-[var(--color-text-primary)] transition-colors mb-8">
          <IoArrowBack size={16} />
          Back to Packages
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] font-['Outfit'] mb-3">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#a0a0c0]">
                <div className="flex items-center gap-1.5">
                  <IoLocationOutline className="text-[#6c63ff]" />
                  {pkg.route.join(' → ')}
                </div>
                <div className="flex items-center gap-1.5">
                  <IoCalendarOutline className="text-[#f5a623]" />
                  {formatDate(pkg.departureDate)}
                </div>
                <div className="flex items-center gap-1.5">
                  <IoTimeOutline className="text-[#00c9a7]" />
                  {pkg.duration}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-[#f5a623] to-[#ffc857] bg-clip-text text-transparent font-['Outfit']">
                {formatCurrency(pkg.price)}
              </p>
              <p className="text-xs text-[#a0a0c0]">per person</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6 mb-8"
        >
          <p className="text-sm text-[#a0a0c0] leading-relaxed">{pkg.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-4">
                Package Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-4 text-center">
                  <IoCalendarOutline className="text-[#f5a623] text-2xl mx-auto mb-2" />
                  <p className="text-xs text-[#a0a0c0] mb-1">Duration</p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.duration}</p>
                </div>
                <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-4 text-center">
                  <IoLocationOutline className="text-[#6c63ff] text-2xl mx-auto mb-2" />
                  <p className="text-xs text-[#a0a0c0] mb-1">Destinations</p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.route.length} Cities</p>
                </div>
                <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-4 text-center">
                  <IoPersonOutline className="text-[#00c9a7] text-2xl mx-auto mb-2" />
                  <p className="text-xs text-[#a0a0c0] mb-1">Available Spots</p>
                  <p className="text-sm font-semibold text-[#00c9a7]">{availableSpots}</p>
                </div>
                <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mx-auto mb-2 flex justify-center">
                    {pkg.busType.includes('AC') && !pkg.busType.includes('Non') ? (
                      <IoSnow className="text-[#6c9eff]" />
                    ) : (
                      <IoSunny className="text-[#f5a623]" />
                    )}
                  </div>
                  <p className="text-xs text-[#a0a0c0] mb-1">Bus Type</p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.busType}</p>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-4">
                Amenities
              </h2>
              <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {busAmenities.map((amenity, i) => {
                    const Icon = amenity.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm text-[#a0a0c0]">
                        <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center shrink-0">
                          <Icon className="text-[#6c63ff] text-lg" />
                        </div>
                        <span className="text-xs font-medium">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-6">
                  Itinerary
                </h2>
                <ItineraryTimeline itinerary={pkg.itinerary} />
              </motion.div>
            )}
          </div>

          {/* Right Column — Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-5">
                  Book This Package
                </h3>

                {/* Passenger Counter */}
                <div className="mb-5">
                  <label className="block text-xs text-[#a0a0c0] uppercase tracking-wider mb-3">
                    Number of Passengers
                  </label>
                  <div className="flex items-center justify-between bg-black/5 rounded-xl p-3 border border-black/10">
                    <button
                      type="button"
                      onClick={() => setPassengerCount(passengerCount - 1)}
                      disabled={passengerCount <= 1}
                      className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <IoRemoveCircleOutline size={22} />
                    </button>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-[var(--color-text-primary)] font-['Outfit']">
                        {passengerCount}
                      </span>
                      <p className="text-[10px] text-[#a0a0c0]">
                        {passengerCount === 1 ? 'Person' : 'Persons'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPassengerCount(passengerCount + 1)}
                      disabled={passengerCount >= availableSpots}
                      className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <IoAddCircleOutline size={22} />
                    </button>
                  </div>
                  {availableSpots <= 5 && availableSpots > 0 && (
                    <p className="text-[10px] text-[#f5a623] mt-2 text-center">
                      ⚡ Only {availableSpots} spot{availableSpots > 1 ? 's' : ''} left!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0c0]">Price per person</span>
                    <span className="text-[var(--color-text-primary)]">{formatCurrency(pkg.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0c0]">Passengers</span>
                    <span className="text-[var(--color-text-primary)]">× {passengerCount}</span>
                  </div>
                  <div className="h-px bg-black/10 my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Total</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-[#f5a623] to-[#ffc857] bg-clip-text text-transparent">
                      {formatCurrency(passengerCount * pkg.price)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToBooking}
                  className="w-full"
                  disabled={availableSpots === 0}
                >
                  <span className="flex items-center gap-2">
                    {availableSpots === 0 ? 'Fully Booked' : 'Proceed to Book'}
                    {availableSpots > 0 && <IoArrowForward />}
                  </span>
                </Button>

                <p className="text-[10px] text-[#a0a0c0]/50 text-center mt-4">
                  💰 Offline payment only — No online payment required
                </p>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#a0a0c0]">
                    <IoCheckmarkCircle className="text-[#00c9a7] text-lg shrink-0" />
                    <span className="text-xs">Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#a0a0c0]">
                    <IoShieldCheckmarkOutline className="text-[#6c63ff] text-lg shrink-0" />
                    <span className="text-xs">Documents stored securely</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#a0a0c0]">
                    <IoPersonOutline className="text-[#f5a623] text-lg shrink-0" />
                    <span className="text-xs">24/7 customer support</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
