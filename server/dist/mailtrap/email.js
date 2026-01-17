"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetSuccessEmail = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const htmlEmail_1 = require("./htmlEmail");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await transporter.sendMail({
            from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: htmlEmail_1.htmlContent.replace("{verificationToken}", verificationToken),
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification");
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendWelcomeEmail = async (email, name) => {
    try {
        const html = (0, htmlEmail_1.generateWelcomeEmailHtml)(name);
        await transporter.sendMail({
            from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to CraveCorner",
            html,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendPasswordResetEmail = async (email, otp) => {
    try {
        const html = (0, htmlEmail_1.generatePasswordResetOtpHtml)(otp);
        await transporter.sendMail({
            from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your password - OTP",
            html,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to reset password");
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendResetSuccessEmail = async (email) => {
    try {
        const html = (0, htmlEmail_1.generateResetSuccessEmailHtml)();
        await transporter.sendMail({
            from: `"Crave Corner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Successful",
            html,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
};
exports.sendResetSuccessEmail = sendResetSuccessEmail;
