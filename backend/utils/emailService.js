// backend/utils/emailService.js
import nodemailer from "nodemailer";

// Verify that env variables exist
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("❌ Missing SMTP_USER or SMTP_PASS in .env file");
}

// Create reusable transporter for Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Optional: verify transporter connection once at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

/**
 * Send Email Helper
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "Vednine Jewellers"}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Failed to send email");
  }
};
