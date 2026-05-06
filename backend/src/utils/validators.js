const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

const validateBookingInput = (data) => {
  const errors = [];

  if (!data.mainUser) {
    errors.push('Main user information is required');
    return errors;
  }

  const { name, mobile, dob, aadhaarImage } = data.mainUser;

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!mobile || !validateMobile(mobile)) {
    errors.push('Valid 10-digit Indian mobile number is required');
  }

  if (!dob) {
    errors.push('Date of birth is required');
  }

  if (!aadhaarImage) {
    errors.push('Aadhaar image is required');
  }

  if (!data.passengerCount || typeof data.passengerCount !== 'number' || data.passengerCount < 1) {
    errors.push('Passenger count must be at least 1');
  }

  if (!data.packageId) {
    errors.push('Package ID is required');
  }

  // Validate passengers
  if (data.passengers && Array.isArray(data.passengers)) {
    data.passengers.forEach((p, i) => {
      if (!p.name || p.name.trim().length < 2) {
        errors.push(`Passenger ${i + 1}: Name must be at least 2 characters`);
      }
      if (!p.dob) {
        errors.push(`Passenger ${i + 1}: Date of birth is required`);
      }
      if (!p.aadhaarImage) {
        errors.push(`Passenger ${i + 1}: Aadhaar image is required`);
      }
    });
  }

  return errors;
};

const validatePackageInput = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!data.route || !Array.isArray(data.route) || data.route.length < 2) {
    errors.push('Route must have at least 2 stops');
  }

  if (!data.duration) {
    errors.push('Duration is required');
  }

  if (!data.busType) {
    errors.push('Bus type is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (!data.description) {
    errors.push('Description is required');
  }

  if (!data.departureDate) {
    errors.push('Departure date is required');
  }

  return errors;
};

module.exports = { validateMobile, validateBookingInput, validatePackageInput };
