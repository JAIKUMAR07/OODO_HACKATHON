import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/email.js";
import { AppError } from "../utils/AppError.js";

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      throw new AppError("All fields are required.", 400);
    }

    const validRoles = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];
    if (!validRoles.includes(role)) {
      throw new AppError("Invalid role.", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email already registered.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      message: "Registration successful.",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Email is required.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If that email exists, an OTP has been sent." });
    }

    // Generate 6-digit OTP safely
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Store hashed OTP
    const otpHash = await bcrypt.hash(otp, 10);
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token: otpHash, expiresAt },
    });

    // Send email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "If that email exists, an OTP has been sent." });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new AppError("Email and OTP are required.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid OTP.", 400);
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!resetToken) {
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    const isValid = await bcrypt.compare(otp, resetToken.token);
    if (!isValid) {
      throw new AppError("Invalid OTP.", 400);
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    next(error);
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      throw new AppError("All fields are required.", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid request.", 400);
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!resetToken) {
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    const isValid = await bcrypt.compare(otp, resetToken.token);
    if (!isValid) {
      throw new AppError("Invalid OTP.", 400);
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Clean up token
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};
