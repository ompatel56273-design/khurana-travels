'use client';
import { IoSnow, IoSunny, IoBed, IoWifi, IoWater, IoMusicalNotes } from 'react-icons/io5';

const BusDetails = ({ pkg }) => {
  const amenities = {
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

  const busAmenities = amenities[pkg.busType] || amenities['AC'];

  return (
    <div className="bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] font-['Outfit'] mb-4">Bus Details</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/5 rounded-xl p-4 border border-black/5">
          <p className="text-xs text-[#a0a0c0] mb-1">Type</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.busType}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-4 border border-black/5">
          <p className="text-xs text-[#a0a0c0] mb-1">Total Seats</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.totalSeats}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-4 border border-black/5">
          <p className="text-xs text-[#a0a0c0] mb-1">Duration</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{pkg.duration}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-4 border border-black/5">
          <p className="text-xs text-[#a0a0c0] mb-1">Available</p>
          <p className="text-sm font-semibold text-[#00c9a7]">
            {pkg.totalSeats - (pkg.bookedSeats?.length || 0)} seats
          </p>
        </div>
      </div>

      {/* Amenities */}
      <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Amenities</h4>
      <div className="grid grid-cols-2 gap-3">
        {busAmenities.map((amenity, i) => {
          const Icon = amenity.icon;
          return (
            <div key={i} className="flex items-center gap-2.5 text-sm text-[#a0a0c0]">
              <div className="w-8 h-8 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center">
                <Icon className="text-[#6c63ff] text-sm" />
              </div>
              <span className="text-xs">{amenity.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusDetails;
