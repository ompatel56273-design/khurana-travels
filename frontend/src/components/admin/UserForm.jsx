'use client';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const UserForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
    isVerified: initialData?.isVerified !== undefined ? initialData.isVerified : false,
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          required
          theme="dark"
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          theme="dark"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
          theme="dark"
        />
        <Input
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => updateField('dob', e.target.value)}
          theme="dark"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateField('isVerified', !formData.isVerified)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
            formData.isVerified ? 'bg-[#00c9a7]' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
              formData.isVerified ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm text-neutral-400">
          {formData.isVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Update User
      </Button>
    </form>
  );
};

export default UserForm;
