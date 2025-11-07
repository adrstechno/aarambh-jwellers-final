import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP connection successful. Ready to send emails.");
  }
});

const mailOptions = {
  from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
  to: process.env.SMTP_USER, // send a test email to yourself
  subject: "Test Email from Vednine App",
  text: "This is a test email to confirm your Gmail SMTP setup is working.",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("❌ Error sending email:", err);
  } else {
    console.log("📩 Email sent successfully:", info.response);
  }
});
