const Package = require('../models/Package');
const Booking = require('../models/Booking');
const { validatePackageInput } = require('../utils/validators');

// @desc    Get all active packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all packages (including inactive) — admin
// @route   GET /api/packages/all
// @access  Private
const getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }

    // Get booked seats from bookings
    const bookings = await Booking.find({
      packageId: pkg._id,
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSpots = bookings.reduce((acc, booking) => {
      return acc + (booking.passengerCount || 0);
    }, 0);

    res.json({
      ...pkg.toObject(),
      bookedSeats: Array.from({ length: bookedSpots }).fill(1),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create package
// @route   POST /api/packages
// @access  Private
const createPackage = async (req, res, next) => {
  try {
    const errors = validatePackageInput(req.body);
    if (errors.length > 0) {
      res.status(400);
      throw new Error(errors.join(', '));
    }

    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }

    const updatedPkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedPkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }

    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
