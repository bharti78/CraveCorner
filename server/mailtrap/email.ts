import nodemailer from "nodemailer";
import {
  generatePasswordResetOtpHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  try {
    await transporter.sendMail({
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
    await transporter.sendMail({
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
    await transporter.sendMail({
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
    await transporter.sendMail({
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
