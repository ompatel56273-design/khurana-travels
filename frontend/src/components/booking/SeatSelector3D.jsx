'use client';
import { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

/* ─── 3D Bus Shell (decorative, no Text) ─── */
function BusShell() {
  const busRef = useRef();
  useFrame((state) => {
    if (busRef.current) {
      busRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <group ref={busRef} position={[0, -0.5, 0]}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[3, 0.12, 7.5]} />
        <meshStandardMaterial color="#12122e" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-1.5, 0.7, 0]}>
        <boxGeometry args={[0.06, 1.3, 7.5]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.25} />
      </mesh>
      {/* Right wall */}
      <mesh position={[1.5, 0.7, 0]}>
        <boxGeometry args={[0.06, 1.3, 7.5]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.25} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[3, 0.08, 7.5]} />
        <meshStandardMaterial color="#0d0d20" transparent opacity={0.15} />
      </mesh>
      {/* Front windshield */}
      <mesh position={[0, 0.7, 3.8]}>
        <boxGeometry args={[2.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#6c63ff" transparent opacity={0.08} />
      </mesh>
      {/* Dashboard */}
      <mesh position={[0, 0.35, 3.5]}>
        <boxGeometry args={[2.5, 0.12, 0.8]} />
        <meshStandardMaterial color="#252547" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Steering wheel */}
      <mesh position={[-0.6, 0.6, 3.5]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 12, 24]} />
        <meshStandardMaterial color="#8b83ff" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Seat rows (simplified colored blocks) */}
      {Array.from({ length: 15 }).map((_, row) => (
        <group key={row}>
          {/* Left pair */}
          <mesh position={[-0.85, 0.25, 2.8 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.15, 0.32]} />
            <meshStandardMaterial color="#2d2d5e" emissive="#2d2d5e" emissiveIntensity={0.05} />
          </mesh>
          <mesh position={[-0.42, 0.25, 2.8 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.15, 0.32]} />
            <meshStandardMaterial color="#2d2d5e" emissive="#2d2d5e" emissiveIntensity={0.05} />
          </mesh>
          {/* Right pair */}
          <mesh position={[0.42, 0.25, 2.8 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.15, 0.32]} />
            <meshStandardMaterial color="#2d2d5e" emissive="#2d2d5e" emissiveIntensity={0.05} />
          </mesh>
          <mesh position={[0.85, 0.25, 2.8 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.15, 0.32]} />
            <meshStandardMaterial color="#2d2d5e" emissive="#2d2d5e" emissiveIntensity={0.05} />
          </mesh>
          {/* Seat backs */}
          <mesh position={[-0.85, 0.45, 2.65 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.3, 0.06]} />
            <meshStandardMaterial color="#2d2d5e" />
          </mesh>
          <mesh position={[-0.42, 0.45, 2.65 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.3, 0.06]} />
            <meshStandardMaterial color="#2d2d5e" />
          </mesh>
          <mesh position={[0.42, 0.45, 2.65 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.3, 0.06]} />
            <meshStandardMaterial color="#2d2d5e" />
          </mesh>
          <mesh position={[0.85, 0.45, 2.65 - row * 0.48]}>
            <boxGeometry args={[0.38, 0.3, 0.06]} />
            <meshStandardMaterial color="#2d2d5e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BusScene3DPreview() {
  return (
    <div className="w-full h-[200px] rounded-xl overflow-hidden mb-4 border border-black/5">
      <Canvas camera={{ position: [3, 3, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={0.6} />
        <pointLight position={[0, 3, 0]} intensity={0.2} color="#6c63ff" />
        <Suspense fallback={null}>
          <BusShell />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

/* ─── 2D Interactive Seat Map ─── */
function SeatButton({ number, state, onClick }) {
  const stateStyles = {
    available:
      'bg-[#1e1e42] border-[#2d2d5e] hover:bg-[#2d2d5e] hover:border-[#6c63ff] hover:shadow-[0_0_12px_rgba(108,99,255,0.25)] cursor-pointer text-[#a0a0c0] hover:text-[var(--color-text-primary)]',
    selected:
      'bg-[#6c63ff] border-[#8b83ff] shadow-[0_0_18px_rgba(108,99,255,0.4)] cursor-pointer text-[var(--color-text-primary)]',
    booked:
      'bg-[#ff4757]/15 border-[#ff4757]/30 cursor-not-allowed text-[#ff4757]/60',
  };

  return (
    <motion.button
      whileHover={state !== 'booked' ? { scale: 1.12 } : {}}
      whileTap={state !== 'booked' ? { scale: 0.92 } : {}}
      onClick={() => state !== 'booked' && onClick(number)}
      disabled={state === 'booked'}
      className={`
        w-9 h-9 sm:w-10 sm:h-10 rounded-lg border text-xs font-bold font-mono
        transition-all duration-200 flex items-center justify-center
        ${stateStyles[state]}
      `}
    >
      {number}
    </motion.button>
  );
}

function SeatMap({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) {
  const rows = useMemo(() => {
    const result = [];
    let seat = 1;
    while (seat <= totalSeats) {
      const row = [];
      // Left pair
      if (seat <= totalSeats) row.push(seat++);
      if (seat <= totalSeats) row.push(seat++);
      // Aisle (null)
      row.push(null);
      // Right pair
      if (seat <= totalSeats) row.push(seat++);
      if (seat <= totalSeats) row.push(seat++);
      result.push(row);
    }
    return result;
  }, [totalSeats]);

  const getSeatState = (num) => {
    if (bookedSeats.includes(num)) return 'booked';
    if (selectedSeats.includes(num)) return 'selected';
    return 'available';
  };

  return (
    <div className="relative bg-[#0c0c20] border border-black/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
      {/* Bus shape top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-[#6c63ff]/30 to-transparent" />

      {/* Driver area */}
      <div className="flex items-center justify-center gap-2 mb-5 pb-4 border-b border-dashed border-black/10">
        <div className="w-8 h-8 rounded-full border-2 border-[#6c63ff]/40 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#6c63ff]/60" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#6c63ff]/60 font-semibold ml-2">
          Driver
        </span>
        <div className="flex-1" />
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#a0a0c0]/40 font-medium">
          Front
        </span>
      </div>

      {/* Seat grid */}
      <div className="space-y-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center gap-1.5 sm:gap-2">
            {row.map((seat, colIdx) =>
              seat === null ? (
                <div key={`aisle-${rowIdx}`} className="w-5 sm:w-6 flex-shrink-0" />
              ) : (
                <SeatButton
                  key={seat}
                  number={seat}
                  state={getSeatState(seat)}
                  onClick={onSeatSelect}
                />
              )
            )}
          </div>
        ))}
      </div>

      {/* Rear indicator */}
      <div className="mt-5 pt-3 border-t border-dashed border-black/10 text-center">
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#a0a0c0]/40 font-medium">
          Rear
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
const SeatSelector3D = ({ totalSeats = 59, bookedSeats = [], selectedSeats = [], onSeatSelect }) => {
  const [show3D, setShow3D] = useState(true);

  const availableCount = totalSeats - bookedSeats.length;
  const selectedCount = selectedSeats.length;

  return (
    <div className="w-full space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2d2d5e]/30 border border-[#2d2d5e]/50">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#2d2d5e]" />
          <span className="text-[11px] text-[#a0a0c0]">Available ({availableCount})</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/30">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#6c63ff]" />
          <span className="text-[11px] text-[#a0a0c0]">Selected ({selectedCount})</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4757]/10 border border-[#ff4757]/30">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#ff4757]" />
          <span className="text-[11px] text-[#a0a0c0]">Booked ({bookedSeats.length})</span>
        </div>
      </div>

      {/* 3D Preview (decorative) */}
      {show3D && (
        <Suspense fallback={null}>
          <BusScene3DPreview />
        </Suspense>
      )}

      {/* 2D Interactive Seat Map (always works) */}
      <SeatMap
        totalSeats={totalSeats}
        bookedSeats={bookedSeats}
        selectedSeats={selectedSeats}
        onSeatSelect={onSeatSelect}
      />

      <p className="text-[10px] text-center text-[#a0a0c0]/40">
        Tap a seat to select • Tap again to deselect
      </p>
    </div>
  );
};

export default SeatSelector3D;
