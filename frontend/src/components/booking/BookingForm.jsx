'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';
import PassengerForm from './PassengerForm';
import { IoAddCircleOutline, IoPersonOutline } from 'react-icons/io5';
import { useBooking } from '@/context/BookingContext';

const BookingForm = () => {
  const {
    mainUser,
    passengers,
    passengerCount,
    setMainUser,
    addPassenger,
    updatePassenger,
    removePassenger,
  } = useBooking();

  const maxAdditionalPassengers = passengerCount - 1; // main user counts as 1

  return (
    <div className="space-y-8">
      {/* Main User Form */}
      <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center">
            <IoPersonOutline className="text-[#6c63ff]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] font-['Outfit']">Primary Passenger</h3>
            <p className="text-xs text-[#a0a0c0]">Main booking contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={mainUser.name}
            onChange={(e) => setMainUser({ name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={mainUser.mobile}
            onChange={(e) => setMainUser({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="10-digit mobile number"
            required
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={mainUser.dob}
            onChange={(e) => setMainUser({ dob: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <ImageUploader
            label="Aadhaar Card Image"
            value={mainUser.aadhaarImage}
            onChange={(file) => setMainUser({ aadhaarImage: file })}
            required
            id="main-aadhaar"
          />
          <ImageUploader
            label="PAN Card Image (Optional)"
            value={mainUser.panImage}
            onChange={(file) => setMainUser({ panImage: file })}
            id="main-pan"
          />
        </div>
      </div>

      {/* Additional Passengers Section */}
      {passengerCount > 1 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] font-['Outfit']">
                Additional Passengers
              </h3>
              <p className="text-xs text-[#a0a0c0] mt-1">
                {passengers.length} of {maxAdditionalPassengers} additional passenger{maxAdditionalPassengers > 1 ? 's' : ''} added
              </p>
            </div>
            {passengers.length < maxAdditionalPassengers && (
              <Button
                variant="secondary"
                size="sm"
                onClick={addPassenger}
              >
                <IoAddCircleOutline size={18} />
                Add Passenger
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {passengers.map((passenger, index) => (
                <PassengerForm
                  key={passenger.id}
                  passenger={passenger}
                  index={index}
                  onUpdate={updatePassenger}
                  onRemove={removePassenger}
                />
              ))}
            </AnimatePresence>
          </div>

          {passengers.length === 0 && maxAdditionalPassengers > 0 && (
            <div className="text-center py-8 bg-black/5 rounded-xl border border-dashed border-black/10">
              <IoPersonOutline className="text-3xl text-[#a0a0c0]/40 mx-auto mb-2" />
              <p className="text-sm text-[#a0a0c0]">
                You need to add {maxAdditionalPassengers} more passenger{maxAdditionalPassengers > 1 ? 's' : ''}.
              </p>
              <p className="text-xs text-[#a0a0c0]/60 mt-1">
                Click "Add Passenger" to provide their details and documents.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingForm;
