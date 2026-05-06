export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateSeatLayout = (totalSeats) => {
  const rows = [];
  let seatNum = 1;
  
  // Driver's seat row
  rows.push({ type: 'driver', seats: [] });
  
  // Regular rows: 2 seats - aisle - 2 seats (standard bus layout)
  while (seatNum <= totalSeats) {
    const row = { type: 'regular', seats: [] };
    
    // Left pair
    if (seatNum <= totalSeats) { row.seats.push(seatNum++); }
    if (seatNum <= totalSeats) { row.seats.push(seatNum++); }
    
    // Aisle
    row.seats.push(null);
    
    // Right pair
    if (seatNum <= totalSeats) { row.seats.push(seatNum++); }
    if (seatNum <= totalSeats) { row.seats.push(seatNum++); }
    
    rows.push(row);
  }
  
  return rows;
};

export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';
  return `${uploadUrl}${filePath}`;
};
