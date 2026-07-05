"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetSuccessEmail = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const htmlEmail_1 = require("./htmlEmail");
// Create multiple transporters for fallback
const createTransporter = (config, fastFail = false) => {
    return nodemailer_1.default.createTransport({
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
const fallbackTransporters = fallbackConfigs.map((config, index) => createTransporter(config, index === 0) // Fast fail only for port 587 (first fallback)
);
// Function to try sending email with fallback transporters
const sendMailWithFallback = async (mailOptions) => {
    const transporters = [primaryTransporter, ...fallbackTransporters];
    let lastError;
    for (let i = 0; i < transporters.length; i++) {
        try {
            const info = await transporters[i].sendMail(mailOptions);
            if (i === 0) {
                console.log("Email sent successfully using primary transporter");
            }
            else {
                console.log(`Email sent successfully using fallback transporter ${i}`);
            }
            console.log("Email delivery result:", {
                messageId: info.messageId,
                accepted: info.accepted,
                rejected: info.rejected,
                response: info.response,
            });
            return;
        }
        catch (error) {
            lastError = error;
            // Only log detailed errors for the last attempt (all failed)
            if (i === transporters.length - 1) {
                console.error("All email transporters failed:", error);
            }
            else {
                // Silent fail for fallback attempts
                console.log(`Transporter ${i + 1} failed, trying next...`);
            }
        }
    }
    throw lastError || new Error("All email transporters failed");
};
const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await sendMailWithFallback({
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
        await sendMailWithFallback({
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
        await sendMailWithFallback({
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
        await sendMailWithFallback({
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
