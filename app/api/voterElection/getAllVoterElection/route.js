import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil semua data VoterElection dari database
    const voterElections = await prisma.voterElection.findMany({
      include: {
        voter: true, // Sertakan data Voter terkait
        election: true, // Sertakan data Election terkait
      },
    });

    // Kembalikan data dalam format JSON
    return NextResponse.json(voterElections, { status: 200 });
  } catch (error) {
    console.error("Error fetching voter elections:", error);
    return NextResponse.json(
      { error: "Failed to fetch voter elections" },
      { status: 500 }
    );
  }
}