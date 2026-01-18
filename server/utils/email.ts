import nodemailer from "nodemailer";
import {
  generatePasswordResetOtpHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";

// Create multiple transporters for fallback
const createTransporter = (config: any, fastFail: boolean = false) => {
  return nodemailer.createTransport({
    ...config,
    tls: {
      rejectUnauthorized: false,
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: fastFail ? 10000 : 60000, // 10 seconds for fast fail, 60 seconds for normal
    greetingTimeout: fastFail ? 5000 : 30000, // 5 seconds for fast fail, 30 seconds for normal
    socketTimeout: fastFail ? 10000 : 60000, // 10 seconds for fast fail, 60 seconds for normal
  });
};

// Primary transporter (use port 465 as it's working on Render)
const primaryTransporter = createTransporter({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fallback transporter configurations
const fallbackConfigs = [
  {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  // Custom SMTP if configured (try last)
  ...(process.env.SMTP_HOST ? [{
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }] : []),
];

const fallbackTransporters = fallbackConfigs.map((config, index) => 
  createTransporter(config, index === 0) // Fast fail only for port 587 (first fallback)
);

// Function to try sending email with fallback transporters
const sendMailWithFallback = async (mailOptions: any) => {
  const transporters = [primaryTransporter, ...fallbackTransporters];
  
  for (let i = 0; i < transporters.length; i++) {
    try {
      await transporters[i].sendMail(mailOptions);
      if (i === 0) {
        console.log("Email sent successfully using primary transporter");
      } else {
        console.log(`Email sent successfully using fallback transporter ${i}`);
      }
      return;
    } catch (error) {
      // Only log detailed errors for the last attempt (all failed)
      if (i === transporters.length - 1) {
        console.error("All email transporters failed:", error);
      } else {
        // Silent fail for fallback attempts
        console.log(`Transporter ${i + 1} failed, trying next...`);
      }
    }
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  try {
    await sendMailWithFallback({
      from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: htmlContent.replace("{verificationToken}", verificationToken),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email verification");
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const html = generateWelcomeEmailHtml(name);
    await sendMailWithFallback({
      from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to CraveCorner",
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email: string, otp: string) => {
  try {
    const html = generatePasswordResetOtpHtml(otp);
    await sendMailWithFallback({
      from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password - OTP",
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to reset password");
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  try {
    const html = generateResetSuccessEmailHtml();
    await sendMailWithFallback({
      from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset success email");
  }
};
