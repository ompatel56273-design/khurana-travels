'use client';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BUS_TYPES, UPLOAD_URL } from '@/lib/constants';
import { IoAddCircleOutline, IoTrashOutline, IoImageOutline, IoCloseOutline } from 'react-icons/io5';
import { uploadHomeImage, uploadItineraryImage } from '@/lib/api';
import toast from 'react-hot-toast';

const PackageForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    route: initialData?.route || ['', ''],
    duration: initialData?.duration || '',
    busType: initialData?.busType || 'AC',
    totalSeats: initialData?.totalSeats || 59,
    price: initialData?.price || '',
    description: initialData?.description || '',
    homePageImage: initialData?.homePageImage || '',
    departureDate: initialData?.departureDate?.split('T')[0] || '',
    itinerary: initialData?.itinerary || [],
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingItineraryImageIndex, setUploadingItineraryImageIndex] = useState(null);
  
  // Need to import API functions at the top of the file. I will do that in the next chunk.

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRouteStop = () => {
    setFormData((prev) => ({ ...prev, route: [...prev.route, ''] }));
  };

  const updateRouteStop = (index, value) => {
    const newRoute = [...formData.route];
    newRoute[index] = value;
    setFormData((prev) => ({ ...prev, route: newRoute }));
  };

  const removeRouteStop = (index) => {
    if (formData.route.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      route: prev.route.filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '' },
      ],
    }));
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const removeItineraryDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const handleHomePageImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await uploadHomeImage(file);
      updateField('homePageImage', response.file);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleItineraryImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingItineraryImageIndex(index);
    try {
      const response = await uploadItineraryImage(file);
      updateItinerary(index, 'image', response.file);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingItineraryImageIndex(null);
    }
  };

  const removeHomePageImage = () => {
    updateField('homePageImage', '');
  };

  const removeItineraryImage = (index) => {
    updateItinerary(index, 'image', '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Package Title"
          name="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Golden Triangle Express"
          required
          theme="dark"
        />
        <Input
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={(e) => updateField('duration', e.target.value)}
          placeholder="e.g. 5 Days / 4 Nights"
          required
          theme="dark"
        />
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Bus Type <span className="text-[#ff4757]">*</span>
          </label>
          <select
            value={formData.busType}
            onChange={(e) => updateField('busType', e.target.value)}
            className="w-full bg-neutral-900 backdrop-blur-xl border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#6c63ff] transition-all"
          >
            {BUS_TYPES.map((type) => (
              <option key={type} value={type} className="bg-neutral-900 text-white">{type}</option>
            ))}
          </select>
        </div>
        <Input
          label="Total Seats"
          name="totalSeats"
          type="number"
          value={formData.totalSeats}
          onChange={(e) => updateField('totalSeats', e.target.value)}
          required
          theme="dark"
        />
        <Input
          label="Price per Seat (₹)"
          name="price"
          type="number"
          value={formData.price}
          onChange={(e) => updateField('price', e.target.value)}
          placeholder="e.g. 4500"
          required
          theme="dark"
        />
        <Input
          label="Departure Date"
          name="departureDate"
          type="date"
          value={formData.departureDate}
          onChange={(e) => updateField('departureDate', e.target.value)}
          required
          theme="dark"
        />
      </div>

      {/* Home Page Image */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Home Page Image
        </label>
        {formData.homePageImage ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden group">
            <img src={`${UPLOAD_URL}${formData.homePageImage}`} alt="Home Page" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={removeHomePageImage}
                className="p-2 bg-[#ff4757] text-white rounded-lg hover:bg-[#ff4757]/90 transition-colors"
              >
                <IoTrashOutline size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-800 rounded-xl hover:border-[#6c63ff] transition-colors cursor-pointer bg-neutral-900">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploadingImage ? (
                <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <IoImageOutline size={24} className="mb-2 text-neutral-400" />
                  <p className="text-sm text-neutral-400">Click to upload home page image</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleHomePageImageUpload} disabled={uploadingImage} />
          </label>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Description <span className="text-[#ff4757]">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          required
          className="w-full bg-neutral-900 backdrop-blur-xl border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#6c63ff] transition-all resize-none"
          placeholder="Describe the package..."
        />
      </div>

      {/* Route Stops */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-neutral-400">Route Stops</label>
          <Button type="button" variant="ghost" size="sm" onClick={addRouteStop}>
            <IoAddCircleOutline size={16} /> Add Stop
          </Button>
        </div>
        <div className="space-y-2">
          {formData.route.map((stop, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#6c63ff]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-[#6c63ff] font-bold">{i + 1}</span>
              </div>
              <input
                value={stop}
                onChange={(e) => updateRouteStop(i, e.target.value)}
                placeholder={`Stop ${i + 1}`}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#6c63ff] transition-all"
              />
              {formData.route.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeRouteStop(i)}
                  className="p-2 text-[#ff4757] hover:bg-[#ff4757]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <IoTrashOutline size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-neutral-400">Itinerary</label>
          <Button type="button" variant="ghost" size="sm" onClick={addItineraryDay}>
            <IoAddCircleOutline size={16} /> Add Day
          </Button>
        </div>
        <div className="space-y-3">
          {formData.itinerary.map((item, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6c63ff]">Day {item.day}</span>
                <button
                  type="button"
                  onClick={() => removeItineraryDay(i)}
                  className="p-1.5 text-[#ff4757] hover:bg-[#ff4757]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <IoTrashOutline size={14} />
                </button>
              </div>
              <input
                value={item.title}
                onChange={(e) => updateItinerary(i, 'title', e.target.value)}
                placeholder="Day title"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#6c63ff] mb-2 transition-all"
              />
              <textarea
                value={item.description}
                onChange={(e) => updateItinerary(i, 'description', e.target.value)}
                placeholder="Day description"
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#6c63ff] resize-none transition-all mb-3"
              />
              
              {/* Itinerary Image Upload */}
              {item.image ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden group mt-2">
                  <img src={`${UPLOAD_URL}${item.image}`} alt={`Day ${item.day}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeItineraryImage(i)}
                      className="p-1.5 bg-[#ff4757] text-white rounded-lg hover:bg-[#ff4757]/90 transition-colors"
                    >
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-neutral-800 rounded-lg hover:border-[#6c63ff] transition-colors cursor-pointer bg-neutral-900 mt-2">
                  <div className="flex flex-col items-center justify-center">
                    {uploadingItineraryImageIndex === i ? (
                      <div className="w-5 h-5 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <IoImageOutline size={18} className="mb-1 text-neutral-400" />
                        <span className="text-xs text-neutral-400">Upload slide image</span>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleItineraryImageUpload(e, i)} disabled={uploadingItineraryImageIndex !== null} />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateField('isActive', !formData.isActive)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
            formData.isActive ? 'bg-[#6c63ff]' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
              formData.isActive ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm text-neutral-400">
          {formData.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {initialData ? 'Update Package' : 'Create Package'}
      </Button>
    </form>
  );
};

export default PackageForm;
