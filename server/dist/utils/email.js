"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetSuccessEmail = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const resend_1 = require("resend");
const htmlEmail_1 = require("./htmlEmail");
const createTransporter = (config) => {
    return nodemailer_1.default.createTransport({
        ...config,
        tls: {
            rejectUnauthorized: false,
        },
        requireTLS: true,
        pool: true,
        maxConnections: 1,
        rateDelta: 1000,
        rateLimit: 5,
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
    });
};
const primaryTransporter = createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
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
const sendViaResend = async (mailOptions) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey)
        throw new Error("RESEND_API_KEY not configured");
    const resend = new resend_1.Resend(apiKey);
    const from = process.env.EMAIL_FROM || mailOptions.from;
    const result = await resend.emails.send({
        from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
    });
    if (result.error)
        throw new Error("Resend email failed");
};
const sendMailWithFallback = async (mailOptions) => {
    const preferApi = process.env.EMAIL_PROVIDER === "resend" || !!process.env.RESEND_API_KEY;
    if (preferApi) {
        try {
            await sendViaResend(mailOptions);
            return;
        }
        catch (e) { }
    }
    const transporters = [primaryTransporter, ...fallbackTransporters];
    for (let i = 0; i < transporters.length; i++) {
        try {
            await transporters[i].sendMail(mailOptions);
            return;
        }
        catch (error) {
            if (i === transporters.length - 1) {
                throw error;
            }
        }
    }
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
