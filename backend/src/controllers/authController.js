const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const sendEmail = require('../utils/sendEmail');
const getOTPVerificationEmail = require('../utils/emailTemplate');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE || '30d',
  });
};

// @desc    Register user and send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
      } else {
        // Update unverified user details
        userExists.firstName = firstName;
        userExists.lastName = lastName;
        userExists.dob = dob;
        userExists.password = password; // pre-save hook will hash it
        await userExists.save();
      }
    } else {
      await User.create({
        firstName,
        lastName,
        dob,
        email,
        password,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp,
    });

    // Send email
    const htmlMessage = getOTPVerificationEmail(otp);

    const emailSent = await sendEmail({
      email,
      subject: 'Account Verification OTP',
      htmlMessage: htmlMessage,
    });

    if (!emailSent) {
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP.',
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOTP = await OTP.findOne({ email, otp });

    if (!validOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    // Delete the OTP as it has been used
    await OTP.deleteOne({ _id: validOTP._id });

    res.status(200).json({
      message: 'Account verified successfully',
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Email not verified. Please verify your email first.' });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getUserProfile,
};
