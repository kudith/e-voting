import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Buat instance Prisma sebagai singleton untuk menghindari too many connections
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'production') global.prisma = prisma;

export async function GET() {
  try {
    console.log("Fetching all votes...");

    // Query semua suara dari database dengan struktur yang benar sesuai schema
    const votes = await prisma.vote.findMany({
      select: {
        id: true,
        voteHash: true,      // Sesuai schema, field ini adalah voteHash bukan hashVote
        createdAt: true,     // Sesuai schema, field ini adalah createdAt bukan timestamp
        voter: {
          select: {
            name: true,
            email: true,
          },
        },
        candidate: {
          select: {
            name: true,
            photo: true,     // Tambahan informasi kandidat yang mungkin berguna
          },
        },
        election: {
          select: {
            title: true,
            status: true,    // Tambahan informasi status pemilu
          },
        },
      },
      orderBy: {
        createdAt: 'desc'    // Urutkan berdasarkan waktu terbaru
      }
    });

    // Jika tidak ada suara ditemukan
    if (!votes || votes.length === 0) {
      return NextResponse.json({ message: "No votes found." }, { status: 404 });
    }

    console.log("All votes retrieved successfully. Count:", votes.length);

    return NextResponse.json({ 
      success: true,
      count: votes.length,
      votes: votes 
    }, { status: 200 });
  } catch (err) {
    console.error("[ERROR FETCHING ALL VOTES]", err);
    
    // Berikan pesan error yang lebih spesifik
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch votes", 
      message: err.message,
      // Tambahkan stack trace di development mode
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }, { status: 500 });
  } finally {
    // Disconnect Prisma client jika bukan production
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}