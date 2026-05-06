const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
});

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
    },
    route: {
      type: [String],
      required: [true, 'Route is required'],
      validate: {
        validator: (v) => v.length >= 2,
        message: 'Route must have at least 2 stops',
      },
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    busType: {
      type: String,
      required: [true, 'Bus type is required'],
      enum: ['AC', 'Non-AC', 'AC Sleeper', 'Non-AC Sleeper'],
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 59,
      min: 1,
      max: 80,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    homePageImage: {
      type: String,
    },
    itinerary: {
      type: [itinerarySchema],
      default: [],
    },
    bookedSeats: {
      type: [Number],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
