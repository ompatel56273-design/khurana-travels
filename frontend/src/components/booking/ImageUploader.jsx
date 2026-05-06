'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoCloudUpload, IoCamera, IoClose, IoCheckmarkCircle } from 'react-icons/io5';

const ImageUploader = ({ label, value, onChange, required = false, id }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, or WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#a0a0c0] mb-2">
        {label} {required && <span className="text-[#ff4757]">*</span>}
      </label>

      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden border border-black/10 group"
        >
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="p-2 bg-[#ff4757] rounded-full text-[var(--color-text-primary)] hover:bg-[#ff6b81] transition-colors cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          </div>
          <div className="absolute top-2 right-2">
            <IoCheckmarkCircle className="text-[#00c9a7] text-xl drop-shadow-lg" />
          </div>
        </motion.div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
            dragActive
              ? 'border-[#6c63ff] bg-[#6c63ff]/10'
              : 'border-black/10 bg-black/5 hover:border-black/10'
          }`}
        >
          <IoCloudUpload className="text-3xl text-[#a0a0c0] mx-auto mb-3" />
          <p className="text-sm text-[#a0a0c0] mb-3">
            Drag & drop or choose a method
          </p>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] bg-black/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <IoCloudUpload size={14} />
              Gallery
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] bg-[#6c63ff]/20 rounded-lg hover:bg-[#6c63ff]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <IoCamera size={14} />
              Camera
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
            id={`gallery-${id}`}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
            id={`camera-${id}`}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
