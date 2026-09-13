const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Development fallback transporter (logs to console)
  return {
    sendMail: async (mailOptions) => {
      console.log('====================================================');
      console.log('📧 [MOCK EMAIL SERVICE] OTP Email Dispatch Simulated');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body:\n${mailOptions.text}`);
      console.log('====================================================');
      return { messageId: 'mock-email-' + Date.now() };
    },
  };
};

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"SkillBridge Auth" <no-reply@skillbridge.com>',
    to: toEmail,
    subject: 'SkillBridge - Password Reset OTP Code',
    text: `Your 6-digit OTP for resetting your SkillBridge password is: ${otp}\n\nThis OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
        <h2 style="color: #4f46e5; text-align: center;">SkillBridge Password Reset</h2>
        <p>You requested a password reset for your SkillBridge account.</p>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e293b;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #64748b;">This OTP code is valid for <strong>10 minutes</strong>. If you did not request this, please disregard this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
