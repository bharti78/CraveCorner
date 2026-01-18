import nodemailer from "nodemailer";
import {
  generatePasswordResetOtpHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";

// Create transporter with fallback options
const createTransporter = async () => {
  // Try Gmail first if credentials are available
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        pool: true, // Use connection pooling
        maxConnections: 1,
        rateDelta: 20000, // 20 seconds between emails
        rateLimit: 5, // Max 5 emails per 20 seconds
      });
      
      // Test the connection
      await transporter.verify();
      console.log("Gmail SMTP transporter created successfully");
      return transporter;
    } catch (error) {
      console.error("Gmail SMTP failed, trying Ethereal:", error);
    }
  }
  
  // Fallback to Ethereal for testing
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  
  console.log("Using Ethereal test email service");
  console.log("Ethereal credentials:", testAccount);
  return transporter;
};

let transporter: nodemailer.Transporter;

// Initialize transporter
createTransporter().then((t) => {
  transporter = t;
}).catch((error) => {
  console.error("Failed to create email transporter:", error);
});

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  try {
    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }
    
    const fromEmail = process.env.EMAIL_USER || "noreply@cravecorner.com";
    await transporter.sendMail({
      from: `"Crave Corner" <${fromEmail}>`,
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
    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }
    
    const html = generateWelcomeEmailHtml(name);
    const fromEmail = process.env.EMAIL_USER || "noreply@cravecorner.com";
    await transporter.sendMail({
      from: `"Crave Corner" <${fromEmail}>`,
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
    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }
    
    const html = generatePasswordResetOtpHtml(otp);
    const fromEmail = process.env.EMAIL_USER || "noreply@cravecorner.com";
    await transporter.sendMail({
      from: `"Crave Corner" <${fromEmail}>`,
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
    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }
    
    const html = generateResetSuccessEmailHtml();
    const fromEmail = process.env.EMAIL_USER || "noreply@cravecorner.com";
    await transporter.sendMail({
      from: `"Crave Corner" <${fromEmail}>`,
      to: email,
      subject: "Password Reset Successful",
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset success email");
  }
};
