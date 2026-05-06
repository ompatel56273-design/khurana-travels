'use client';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import ImageUploader from './ImageUploader';
import { IoTrashOutline } from 'react-icons/io5';

const PassengerForm = ({ passenger, index, onUpdate, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] font-['Outfit']">
          Passenger {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 rounded-lg bg-[#ff4757]/10 text-[#ff4757] hover:bg-[#ff4757]/20 transition-colors cursor-pointer"
        >
          <IoTrashOutline size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name={`passenger-name-${index}`}
          value={passenger.name}
          onChange={(e) => onUpdate(index, { name: e.target.value })}
          placeholder="Enter full name"
          required
        />
        <Input
          label="Date of Birth"
          name={`passenger-dob-${index}`}
          type="date"
          value={passenger.dob}
          onChange={(e) => onUpdate(index, { dob: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <ImageUploader
          label="Aadhaar Card Image"
          value={passenger.aadhaarImage}
          onChange={(file) => onUpdate(index, { aadhaarImage: file })}
          required
          id={`passenger-aadhaar-${index}`}
        />
        <ImageUploader
          label="PAN Card Image (Optional)"
          value={passenger.panImage}
          onChange={(file) => onUpdate(index, { panImage: file })}
          id={`passenger-pan-${index}`}
        />
      </div>
    </motion.div>
  );
};

export default PassengerForm;
