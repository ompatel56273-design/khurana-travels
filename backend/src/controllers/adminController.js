const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Please provide username and password');
    }

    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    res.json({
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    res.json({
      _id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create first admin (seed)
// @route   POST /api/admin/seed
// @access  Public (only works if no admin exists)
const seedAdmin = async (req, res, next) => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      res.status(400);
      throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });

    res.status(201).json({
      message: 'Admin created successfully',
      username: admin.username,
      defaultPassword: 'admin123',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginAdmin, getAdminProfile, seedAdmin };
