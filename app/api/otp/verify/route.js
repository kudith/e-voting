import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const { nim, otp, newPassword } = await req.json();
  const voter = await prisma.voter.findUnique({ where: { nim } });

  if (!voter) return Response.json({ message: "Voter tidak ditemukan" }, { status: 404 });

  if (voter.otpCode !== otp || new Date() > voter.otpExpiresAt) {
    return Response.json({ message: "OTP tidak valid atau sudah kedaluwarsa" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.voter.update({
    where: { nim },
    data: { password: hashedPassword, otpCode: null, otpExpiresAt: null },
  });

  return Response.json({ message: "Password berhasil direset, silakan login kembali." });
}
