"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.updateProfile = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.logout = exports.verifyEmail = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const generateToken_1 = require("../utils/generateToken");
const email_1 = require("../mailtrap/email");
const google_auth_library_1 = require("google-auth-library");
const signup = async (req, res) => {
    try {
        const { fullname, email, password, contact } = req.body;
        let user = await user_model_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user = await user_model_1.User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            isVerified: true,
        });
        const userWithoutPassword = await user_model_1.User.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }
        (0, generateToken_1.generateToken)(res, user);
        user.lastLogin = new Date();
        await user.save();
        // send user without passowrd
        const userWithoutPassword = await user_model_1.User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const user = await user_model_1.User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() },
        }).select("-password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token",
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyEmail = verifyEmail;
const logout = async (_, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist",
            });
        }
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();
        // send email
        await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await user_model_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }
        //update password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        // send success reset email
        await (0, email_1.sendResetSuccessEmail)(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await user_model_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkAuth = checkAuth;
const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;
        // upload image on cloudinary
        let cloudResponse;
        cloudResponse = await cloudinary_1.default.uploader.upload(profilePicture);
        const updatedData = {
            fullname,
            email,
            address,
            city,
            country,
            profilePicture,
        };
        const user = await user_model_1.User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");
        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google token is required",
            });
        }
        // Initialize Google OAuth client
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google token",
            });
        }
        const { email, name, picture } = payload;
        // Check if user already exists
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            // Create new user if doesn't exist
            user = new user_model_1.User({
                fullname: name || email.split("@")[0],
                email,
                password: crypto_1.default.randomBytes(20).toString("hex"), // Random password
                contact: 0, // Default contact
                isVerified: true, // Google users are pre-verified
                profilePicture: picture || "",
            });
            await user.save();
        }
        else {
            // Update existing user's profile picture if not set
            if (!user.profilePicture && picture) {
                user.profilePicture = picture;
                await user.save();
            }
        }
        // Generate JWT token
        const tokenValue = (0, generateToken_1.generateToken)(res, user);
        // Set HTTP-only cookie
        res.cookie("token", tokenValue, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(200).json({
            success: true,
            user,
            message: "Google authentication successful",
        });
    }
    catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during Google authentication",
        });
    }
};
exports.googleAuth = googleAuth;
