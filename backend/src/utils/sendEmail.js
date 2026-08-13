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

/**
 * Send Course Curriculum PDF to user email
 * @param {string} toEmail       - recipient email
 * @param {string} fullName      - recipient name
 * @param {string} courseName    - name of the course
 * @param {string} curriculumUrl - Cloudinary or public URL of the PDF
 */
const sendCurriculumEmail = async (toEmail, fullName, courseName, curriculumUrl) => {
  try {
    const mailOptions = {
      from: `"Zint Education Institute" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Course Curriculum - ${courseName} | Zint Institute`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #7c3aed; margin: 0;">Zint Computer Education Institute</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">ISO 9001:2015 Certified Institute, Gwalior</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />

          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Hello <strong>${fullName}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Thank you for your interest in our <strong>${courseName}</strong> course at Zint Computer Education Institute!
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            We have attached the complete course curriculum PDF to this email for your reference. You can also view or download it directly using the button below:
          </p>

          ${curriculumUrl ? `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${curriculumUrl}" target="_blank" style="background-color: #7c3aed; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              📄 View / Download Curriculum PDF
            </a>
          </div>
          ` : ""}

          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            If you have any questions or would like to discuss admissions, feel free to contact our support team.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            Zint Computer Education Institute • Gwalior, MP • <a href="https://zintinstitute.in" style="color: #7c3aed;">zintinstitute.in</a>
          </p>
        </div>
      `,
      ...(curriculumUrl
        ? {
            attachments: [
              {
                filename: `${courseName.replace(/[^a-zA-Z0-9]/g, "_")}_Curriculum.pdf`,
                path: curriculumUrl,
              },
            ],
          }
        : {}),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Curriculum email sent successfully to ${toEmail}`);
  } catch (err) {
    console.error("Error sending curriculum email:", err.message || err);
  }
};

/**
 * Send Forgot Password OTP email to user
 * @param {string} toEmail  - recipient email
 * @param {string} otp      - 6-digit OTP string
 */
const sendPasswordResetEmail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: `"Zint Education Institute" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset OTP | Zint Institute",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 16px;">
            <h2 style="color: #8E1387; margin: 0;">Zint Computer Education Institute</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Request</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #334155; font-size: 15px;">We received a request to reset your password. Use the OTP below. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #B11FA8; margin: 24px 0; text-align: center;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 13px;">If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            Zint Computer Education Institute &bull; Gwalior, MP &bull; <a href="https://zintinstitute.in" style="color: #8E1387;">zintinstitute.in</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP email sent successfully to ${toEmail}`);
  } catch (err) {
    console.error("Error sending password reset email:", err.message || err);
    throw new Error("Failed to send OTP email. Please verify GMAIL_USER and GMAIL_APP_PASS in backend .env.");
  }
};


module.exports = { sendOTPEmail, sendCurriculumEmail, sendPasswordResetEmail };