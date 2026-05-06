const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Passenger name is required'] },
  dob: { type: Date, required: [true, 'Date of birth is required'] },
  aadhaarImage: { type: String, required: [true, 'Aadhaar image is required'] },
  panImage: { type: String, default: '' },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    mainUser: {
      name: { type: String, required: [true, 'Name is required'] },
      mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
      },
      dob: { type: Date, required: [true, 'Date of birth is required'] },
      aadhaarImage: { type: String, required: [true, 'Aadhaar image is required'] },
      panImage: { type: String, default: '' },
    },
    passengers: {
      type: [passengerSchema],
      default: [],
    },
    passengerCount: {
      type: Number,
      required: [true, 'Passenger count is required'],
      min: 1,
    },
    seats: {
      type: [Number],
      default: [],
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
