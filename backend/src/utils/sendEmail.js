const nodemailer = require("nodemailer");

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // your Gmail address
    pass: process.env.GMAIL_APP_PASS,   // Gmail App Password (not your login password)
  },
});

/**
 * Send OTP email to user
 * @param {string} toEmail  - recipient email
 * @param {string} otp      - 6-digit OTP string
 */
const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Your App" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="color: #555;">Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4F46E5; margin: 24px 0; text-align: center;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };