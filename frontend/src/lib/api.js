import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const isAdminApi = config.url && config.url.startsWith('/admin');
    const isAdminPage = window.location.pathname.startsWith('/admin');
    
    // If we're calling an admin endpoint or we're on an admin page, use adminToken
    const token = (isAdminApi || isAdminPage) 
      ? localStorage.getItem('adminToken') 
      : localStorage.getItem('userToken');
      
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAdminApi = error.config?.url && error.config?.url.startsWith('/admin');
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      if (isAdminApi || isAdminPage) {
        localStorage.removeItem('adminToken');
      } else {
        localStorage.removeItem('userToken');
      }
    }
    return Promise.reject(new Error(message));
  }
);

// ==================== PACKAGES ====================

export const fetchPackages = async () => {
  const { data } = await api.get('/packages');
  return data;
};

export const fetchPackageById = async (id) => {
  const { data } = await api.get(`/packages/${id}`);
  return data;
};

export const fetchAllPackages = async () => {
  const { data } = await api.get('/packages/all');
  return data;
};

export const createPackage = async (packageData) => {
  const { data } = await api.post('/packages', packageData);
  return data;
};

export const updatePackage = async (id, packageData) => {
  const { data } = await api.put(`/packages/${id}`, packageData);
  return data;
};

export const deletePackage = async (id) => {
  const { data } = await api.delete(`/packages/${id}`);
  return data;
};

// ==================== BOOKINGS ====================

export const createBooking = async (bookingData) => {
  const { data } = await api.post('/bookings', bookingData);
  return data;
};

export const fetchBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/bookings?${params}`);
  return data;
};

export const fetchBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await api.put(`/bookings/${id}/status`, { status });
  return data;
};

export const deleteBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};

export const fetchMyBookings = async () => {
  const { data } = await api.get('/bookings/my-bookings');
  return data;
};

export const cancelMyBooking = async (id) => {
  const { data } = await api.put(`/bookings/${id}/cancel`);
  return data;
};

export const downloadBookingPDF = async (id) => {
  const response = await api.get(`/bookings/${id}/download`, {
    responseType: 'blob', // Important for downloading files
  });
  return response.data;
};

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/bookings/stats');
  return data;
};

// ==================== ADMIN ====================

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/admin/login', credentials);
  return data;
};

export const getAdminProfile = async () => {
  const { data } = await api.get('/admin/profile');
  return data;
};

// ==================== USER AUTH ====================

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const verifyOTP = async (verifyData) => {
  const { data } = await api.post('/auth/verify-otp', verifyData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// ==================== UPLOAD ====================

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadMultipleFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadHomeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload/home-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadItineraryImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload/home-second-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ==================== USERS (ADMIN) ====================

export const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export default api;
