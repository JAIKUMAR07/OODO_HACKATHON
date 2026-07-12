import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/email.js";

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validRoles = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
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
    console.error("[REGISTER ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If that email exists, an OTP has been sent." });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
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
    console.error("[FORGOT PASSWORD ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(otp, resetToken.token);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("[VERIFY OTP ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(otp, resetToken.token);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Clean up token
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("[RESET PASSWORD ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
