const axios = require('axios');

const sendEmailWithAttachment = async (toEmail, subject, textContent, attachmentName, attachmentBuffer) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn('BREVO_API_KEY is not defined in environment variables. Email will not be sent.');
      return;
    }

    const payload = {
      sender: { name: 'Om Patel', email: 'nehalpatelpn35812@gmail.com' },
      to: [{ email: toEmail }],
      subject: subject,
      textContent: textContent,
      attachment: [
        {
          name: attachmentName,
          content: attachmentBuffer.toString('base64'),
        },
      ],
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Email sent successfully via Brevo. Message ID:', response.data.messageId);
    return response.data;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmailWithAttachment,
};
