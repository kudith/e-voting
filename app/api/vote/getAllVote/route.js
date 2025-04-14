import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching all votes...");

    // Query semua suara dari database
    const votes = await prisma.vote.findMany({
      select: {
        id: true, // ID suara
        hashVote: true, // Hash suara
        timestamp: true, // Waktu suara diberikan
        voter: {
          select: {
            name: true, // Nama pemilih
            email: true, // Email pemilih
          },
        },
        candidate: {
          select: {
            name: true, // Nama kandidat
          },
        },
        election: {
          select: {
            title: true, // Judul pemilu
          },
        },
      },
    });

    // Jika tidak ada suara ditemukan
    if (votes.length === 0) {
      return NextResponse.json({ message: "No votes found." }, { status: 404 });
    }

    console.log("All votes retrieved successfully:", votes);

    return NextResponse.json({ votes }, { status: 200 });
  } catch (err) {
    console.error("[ERROR FETCHING ALL VOTES]", err);

    // Tangani error lainnya
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}