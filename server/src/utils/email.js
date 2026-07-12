import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"TransitOps" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Password Reset OTP — TransitOps",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; border-radius: 12px; color: #e2e8f0;">
        <h2 style="color: #6366f1; margin-bottom: 8px;">TransitOps</h2>
        <h3 style="color: #f1f5f9; margin-bottom: 24px;">Password Reset OTP</h3>
        <p style="color: #94a3b8;">Use the following OTP to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #6366f1;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
