import { NextResponse } from "next/server";
import { z } from "zod";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";

dotenv.config();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Schema untuk validasi
const setPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  sendEmail: z.boolean().optional().default(true), // Kirim email atau tidak
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = setPasswordSchema.parse(body);

    // Cari voter di database
    const voter = await prisma.voter.findUnique({
      where: { email: data.email }
    });

    if (!voter) {
      return NextResponse.json(
        { error: "Voter tidak ditemukan" },
        { status: 404 }
      );
    }

    if (data.sendEmail) {
      // Opsi 1: Kirim email reset password (voter set sendiri)
      const passwordResetRes = await fetch(`${KINDE_API_URL}/api/v1/user/password_reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KINDE_API_KEY}`,
        },
        body: JSON.stringify({
          email: data.email,
          redirect_url: `${process.env.KINDE_SITE_URL}/api/auth/login`
        }),
      });

      if (!passwordResetRes.ok) {
        const errorText = await passwordResetRes.text();
        console.error("[PASSWORD RESET ERROR]:", errorText);
        
        return NextResponse.json(
          { error: "Gagal mengirim email reset password", details: errorText },
          { status: 400 }
        );
      }

      console.log(`[PASSWORD RESET]: Email sent to ${data.email}`);

      return NextResponse.json(
        { 
          message: "Email reset password berhasil dikirim",
          email: data.email,
          voterCode: voter.voterCode,
          instruction: `Email telah dikirim ke ${data.email}. Voter dapat menggunakan voterCode: ${voter.voterCode} atau email untuk login setelah set password.`
        },
        { status: 200 }
      );
    } else {
      // Opsi 2: Set password default = voterCode (untuk testing)
      // CATATAN: Kinde API mungkin tidak support direct password set via API
      // Biasanya harus via email verification
      
      return NextResponse.json(
        { 
          message: "Untuk keamanan, gunakan opsi sendEmail: true untuk mengirim email reset password",
          voterCode: voter.voterCode,
          email: voter.email
        },
        { status: 200 }
      );
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("[VALIDATION ERROR]:", err.errors);
      return NextResponse.json(
        { errors: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("[ERROR SETTING PASSWORD]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
