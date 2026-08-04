const nodemailer = require("nodemailer");

// Reusable SMTP transporter. Works with Gmail (using an App Password),
// Outlook, SendGrid SMTP, Mailtrap, or any standard SMTP provider —
// just fill in the EMAIL_* values in your .env file.
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465, false for 587/25
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email. Fails silently (logs a warning) instead of throwing,
 * so a broken email config never blocks a booking or registration from succeeding.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email not sent: EMAIL_HOST/EMAIL_USER/EMAIL_PASS not configured in .env");
    return { sent: false };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || `"RoveOn" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return { sent: false, error: error.message };
  }
};

module.exports = sendEmail;
