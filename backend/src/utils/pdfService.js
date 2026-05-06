const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateBookingPDF = (booking, packageData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Title
      doc.fontSize(20).text('Booking Confirmation', { align: 'center' });
      doc.moveDown();

      // Booking Details
      doc.fontSize(14).text('Booking Details', { underline: true });
      doc.fontSize(12).text(`Booking ID: ${booking._id}`);
      doc.text(`Status: ${booking.status.toUpperCase()}`);
      doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`);
      doc.text(`Total Amount: ₹${booking.totalAmount}`);
      doc.text(`Total Passengers: ${booking.passengerCount}`);
      if (booking.seats && booking.seats.length > 0) {
        doc.text(`Seats: ${booking.seats.join(', ')}`);
      }
      doc.moveDown();

      // Package Details
      doc.fontSize(14).text('Package Details', { underline: true });
      doc.fontSize(12).text(`Title: ${packageData.title}`);
      doc.text(`Route: ${packageData.route}`);
      doc.text(`Duration: ${packageData.duration} days`);
      doc.text(`Bus Type: ${packageData.busType}`);
      doc.moveDown();

      const drawImage = (imagePath, label) => {
        if (imagePath) {
          // imagePath is like '/uploads/filename.jpg'
          const fullPath = path.join(__dirname, '../../', imagePath.replace(/^[\/\\]/, ''));
          if (fs.existsSync(fullPath)) {
            doc.moveDown();
            doc.text(`${label}:`);
            doc.image(fullPath, { fit: [200, 200], align: 'center' });
            doc.moveDown();
          } else {
            doc.moveDown();
            doc.text(`${label}: Image not found on server (${imagePath})`);
            doc.moveDown();
          }
        }
      };

      // Main User
      doc.fontSize(14).text('Main Passenger Details', { underline: true });
      doc.fontSize(12).text(`Name: ${booking.mainUser.name}`);
      doc.text(`Mobile: ${booking.mainUser.mobile}`);
      doc.text(`DOB: ${new Date(booking.mainUser.dob).toLocaleDateString()}`);
      
      drawImage(booking.mainUser.aadhaarImage, 'Aadhaar Card');
      drawImage(booking.mainUser.panImage, 'PAN Card');

      doc.addPage();

      // Other Passengers
      if (booking.passengers && booking.passengers.length > 0) {
        doc.fontSize(14).text('Other Passengers', { underline: true });
        doc.moveDown();

        booking.passengers.forEach((passenger, index) => {
          doc.fontSize(12).text(`Passenger ${index + 1}`);
          doc.text(`Name: ${passenger.name}`);
          doc.text(`DOB: ${new Date(passenger.dob).toLocaleDateString()}`);
          
          drawImage(passenger.aadhaarImage, `Aadhaar Card (Passenger ${index + 1})`);
          drawImage(passenger.panImage, `PAN Card (Passenger ${index + 1})`);
          
          doc.moveDown();
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateBookingPDF,
};
