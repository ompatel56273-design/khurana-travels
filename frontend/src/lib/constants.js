export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';

export const SEAT_STATES = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
};

export const SEAT_COLORS = {
  available: '#2d2d5e',
  selected: '#6c63ff',
  booked: '#ff4757',
  hover: '#8b83ff',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

export const BUS_TYPES = ['AC', 'Non-AC', 'AC Sleeper', 'Non-AC Sleeper'];

export const CONTACT_INFO = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@khuranatravels.com',
  address: 'Khurana Travels, Main Bus Stand, New Delhi - 110001',
  website: 'www.khuranatravels.com',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/#packages' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];
