import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req) {
  const { nim } = await req.json();
  const voter = await prisma.voter.findUnique({ where: { nim } });

  if (!voter) return Response.json({ message: "Voter tidak ditemukan" }, { status: 404 });

  // Generate OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Berlaku 10 menit

  await prisma.voter.update({
    where: { nim },
    data: { otpCode, otpExpiresAt },
  });

  // Kirim email OTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: voter.email,
    subject: "Kode OTP untuk Reset Password",
    text: `Kode OTP Anda adalah: ${otpCode}. Berlaku selama 10 menit.`,
  });

  return Response.json({ message: "OTP telah dikirim ke email." });
}
