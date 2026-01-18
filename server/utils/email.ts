import nodemailer from "nodemailer";
import {
  generatePasswordResetOtpHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";

// Create multiple transporters for fallback
const createTransporter = (config: any) => {
  return nodemailer.createTransport({
    ...config,
    tls: {
      rejectUnauthorized: false,
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
};

// Primary transporter (custom SMTP if configured, otherwise Gmail)
const primaryTransporter = createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fallback transporter configurations
const fallbackConfigs = [
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
];

const fallbackTransporters = fallbackConfigs.map(createTransporter);

// Function to try sending email with fallback transporters
const sendMailWithFallback = async (mailOptions: any) => {
  const transporters = [primaryTransporter, ...fallbackTransporters];
  
  for (let i = 0; i < transporters.length; i++) {
    try {
      await transporters[i].sendMail(mailOptions);
      console.log(`Email sent successfully using transporter ${i + 1}`);
      return;
    } catch (error) {
      console.error(`Transporter ${i + 1} failed:`, error);
      if (i === transporters.length - 1) {
        throw error; // All transporters failed
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
