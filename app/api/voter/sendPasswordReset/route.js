import { NextResponse } from "next/server";
import { z } from "zod";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";

dotenv.config();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Zod schema for input validation
const sendPasswordResetSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = sendPasswordResetSchema.parse(body);

    // Cari voter di database
    const voter = await prisma.voter.findUnique({
      where: { email: data.email }
    });

    if (!voter) {
      return NextResponse.json(
        { error: "Voter tidak ditemukan dengan email tersebut" },
        { status: 404 }
      );
    }

    // Send password reset email via Kinde API yang benar
    const passwordResetRes = await fetch(`${KINDE_API_URL}/api/v1/users/${voter.kindeId}/password_reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KINDE_API_KEY}`,
      },
      body: JSON.stringify({
        redirect_url: `${process.env.KINDE_SITE_URL}/api/auth/login`
      }),
    });

    if (!passwordResetRes.ok) {
      const errorText = await passwordResetRes.text();
      console.error("[PASSWORD RESET ERROR]:", errorText);
      
      return NextResponse.json(
        { 
          error: "Gagal mengirim email reset password. Silakan coba lagi.",
          details: errorText
        },
        { status: 400 }
      );
    }

    console.log(`[PASSWORD RESET]: Email sent successfully to ${data.email} for voter ${voter.voterCode}`);

    return NextResponse.json(
      { 
        message: "Email reset password berhasil dikirim!",
        email: data.email,
        voterCode: voter.voterCode,
        instruction: `Email telah dikirim ke ${data.email}. Voter dapat menggunakan username: ${voter.voterCode} atau email untuk login setelah set password melalui link di email.`
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("[VALIDATION ERROR]:", err.errors);
      return NextResponse.json(
        { errors: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("[ERROR SENDING PASSWORD RESET]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
