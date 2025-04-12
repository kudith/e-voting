import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching all voter elections...");

    // Ambil semua data VoterElection dari database
    const voterElections = await prisma.voterElection.findMany({
      include: {
        voter: {
          select: {
            id: true, // ID pemilih
            name: true, // Nama pemilih
            email: true, // Email pemilih
            voterCode: true, // Kode pemilih
          },
        },
        election: {
          select: {
            id: true, // ID pemilu
            title: true, // Judul pemilu
            startDate: true, // Tanggal mulai pemilu
            endDate: true, // Tanggal berakhir pemilu
            status: true, // Status pemilu
          },
        },
      },
    });

    if (!voterElections || voterElections.length === 0) {
      console.warn("No voter elections found in the database.");
      return NextResponse.json(
        { error: "No voter elections found" },
        { status: 404 }
      );
    }

    // Format respons agar lebih informatif
    const formattedResponse = voterElections.map((voterElection) => ({
      voter: {
        id: voterElection.voter.id,
        name: voterElection.voter.name,
        email: voterElection.voter.email,
        voterCode: voterElection.voter.voterCode,
      },
      election: {
        id: voterElection.election.id,
        title: voterElection.election.title,
        startDate: voterElection.election.startDate,
        endDate: voterElection.election.endDate,
        status: voterElection.election.status,
      },
      isEligible: voterElection.isEligible, // Apakah pemilih memenuhi syarat
      hasVoted: voterElection.hasVoted, // Apakah pemilih sudah memberikan suara
    }));

    console.log("Voter elections retrieved successfully:", formattedResponse);

    // Kembalikan data dalam format JSON
    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching voter elections:", error);
    return NextResponse.json(
      { error: "Failed to fetch voter elections" },
      { status: 500 }
    );
  }
}