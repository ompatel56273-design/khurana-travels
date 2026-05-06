const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
  getMyBookings,
  cancelMyBooking,
  downloadBookingPDF,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');

// Optional auth middleware to populate req.user if token exists
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protectUser(req, res, next);
  }
  next();
};

// Public routes (with optional user association)
router.post('/', optionalAuth, createBooking);

// User protected routes
router.get('/my-bookings', protectUser, getMyBookings);
router.put('/:id/cancel', protectUser, cancelMyBooking);
router.get('/:id/download', protectUser, downloadBookingPDF);

// Protected routes
router.get('/', protect, getBookings);
router.get('/stats', protect, getDashboardStats);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
