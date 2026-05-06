const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { validateBookingInput } = require('../utils/validators');
const { generateBookingPDF } = require('../utils/pdfService');
const { sendEmailWithAttachment } = require('../utils/emailService');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const errors = validateBookingInput(req.body);
    if (errors.length > 0) {
      res.status(400);
      throw new Error(errors.join(', '));
    }

    // Check if package exists
    const pkg = await Package.findById(req.body.packageId);
    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }

    // Check spot availability
    const existingBookings = await Booking.find({
      packageId: req.body.packageId,
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSpots = existingBookings.reduce((acc, b) => acc + (b.passengerCount || 0), 0);
    const availableSpots = pkg.totalSeats - bookedSpots;

    if (req.body.passengerCount > availableSpots) {
      res.status(400);
      throw new Error(`Only ${availableSpots} spots are available`);
    }

    // Check total passengers match passengerCount
    const totalPassengers = 1 + (req.body.passengers ? req.body.passengers.length : 0);
    if (totalPassengers !== req.body.passengerCount) {
      res.status(400);
      throw new Error(`Total passenger details (${totalPassengers}) must match passenger count (${req.body.passengerCount})`);
    }

    const totalAmount = req.body.passengerCount * pkg.price;

    const booking = await Booking.create({
      ...req.body,
      user: req.user ? req.user._id : req.body.userId, // Associate with user if available
      totalAmount,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('packageId', 'title route duration busType price');

    // Generate and send PDF via email asynchronously if user email is available
    if (req.user && req.user.email) {
      try {
        const pdfBuffer = await generateBookingPDF(populatedBooking, populatedBooking.packageId);
        await sendEmailWithAttachment(
          req.user.email,
          'Your Booking Confirmation - Khurana Travels',
          `Hello ${populatedBooking.mainUser.name},\n\nYour booking for ${populatedBooking.packageId.title} has been received. Please find your booking details and provided documents attached as a PDF.\n\nThank you for choosing Khurana Travels!`,
          `booking_${populatedBooking._id}.pdf`,
          pdfBuffer
        );
      } catch (emailErr) {
        console.error('Failed to send booking confirmation email:', emailErr);
        // Do not throw to ensure booking creation succeeds even if email fails
      }
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const { status, packageId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (packageId) filter.packageId = packageId;

    const bookings = await Booking.find(filter)
      .populate('packageId', 'title route duration busType price')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('packageId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id).populate('packageId', 'title route duration busType price');

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/bookings/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const totalPackages = await Package.countDocuments();
    const activePackages = await Package.countDocuments({ isActive: true });

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('packageId', 'title route')
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue calculation
    const confirmedRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Seat occupancy per package
    const packages = await Package.find({ isActive: true });
    const seatOccupancy = await Promise.all(
      packages.map(async (pkg) => {
        const bookings = await Booking.find({
          packageId: pkg._id,
          status: { $in: ['pending', 'confirmed'] },
        });
        const bookedSeats = bookings.reduce((acc, b) => acc + (b.passengerCount || 0), 0);
        return {
          packageId: pkg._id,
          title: pkg.title,
          totalSeats: pkg.totalSeats,
          bookedSeats,
          occupancyRate: Math.round((bookedSeats / pkg.totalSeats) * 100),
        };
      })
    );

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalPackages,
      activePackages,
      revenue: confirmedRevenue[0]?.total || 0,
      recentBookings,
      seatOccupancy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('packageId', 'title route duration busType price image')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel user's own booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found or not authorized');
    }

    if (booking.status === 'cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Download booking PDF
// @route   GET /api/bookings/:id/download
// @access  Private
const downloadBookingPDF = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('packageId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const pdfBuffer = await generateBookingPDF(booking, booking.packageId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="booking_${booking._id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
  getMyBookings,
  cancelMyBooking,
  downloadBookingPDF,
};
