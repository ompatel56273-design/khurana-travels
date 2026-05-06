const getOTPVerificationEmail = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - Khurana Travels</title>
  <style>
    /* Email clients sometimes strip out style blocks, but we provide fallbacks */
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 20px !important;
      }
      .card {
        padding: 30px 20px !important;
      }
      .otp-box {
        font-size: 32px !important;
        letter-spacing: 6px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header Accent Bar -->
          <tr>
            <td height="6" style="background: linear-gradient(135deg, #4f46e5, #818cf8); background-color: #4f46e5;"></td>
          </tr>
          
          <!-- Card Content -->
          <tr>
            <td class="card" style="padding: 48px 40px; text-align: center;">
              
              <!-- Brand Logo/Text -->
              <div style="margin-bottom: 32px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">Khurana Travels</h1>
              </div>
              
              <!-- Title -->
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1f2937;">Email Verification</h2>
              
              <!-- Subtitle -->
              <p style="margin: 0 0 32px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
                Use the OTP below to verify your account and complete your registration.
              </p>
              
              <!-- OTP Box -->
              <div style="margin: 0 auto 32px auto; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; width: fit-content;">
                <p class="otp-box" style="margin: 0; font-size: 38px; font-weight: 700; color: #4f46e5; letter-spacing: 10px; font-family: monospace;">${otp}</p>
              </div>
              
              <!-- Expiry & Security Note -->
              <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; margin-top: 16px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #ef4444;">
                  This OTP will expire in 10 minutes.
                </p>
                <p style="margin: 0; font-size: 13px; color: #6b7280;">
                  <strong>Security Note:</strong> Do not share this code with anyone. Our team will never ask you for your password or OTP.
                </p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                &copy; 2026 Khurana Travels. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>
`;

module.exports = getOTPVerificationEmail;
