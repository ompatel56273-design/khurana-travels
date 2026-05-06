const axios = require('axios');

const sendEmail = async (options) => {
  const apiKey = process.env.BREVO_API_KEY;
  
  const data = {
    sender: {
      name: 'Om Patel',
      email: 'nehalpatelpn35812@gmail.com',
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: options.htmlMessage || `<p>${options.message}</p>`,
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Email sent successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = sendEmail;
