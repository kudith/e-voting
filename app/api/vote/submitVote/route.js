import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";

const prisma = new PrismaClient();

// Zod schema untuk validasi input
const voteSchema = z.object({
  voterId: z.string().min(1, "Voter ID is required"),
  candidateId: z.string().min(1, "Candidate ID is required"),
});

function generateVoteHash(voterId, candidateId, electionId) {
  return crypto
    .createHash("sha256")
    .update(`${voterId}-${candidateId}-${electionId}-${Date.now()}`)
    .digest("hex");
}

// Fungsi untuk memperbarui statistik pemilu
async function updateElectionStatistics(electionId) {
  try {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        voterElections: true,
        candidates: true,
      },
    });

    if (!election) {
      throw new Error("Election not found");
    }

    const totalVoters = election.voterElections.length;
    const eligibleVoters = election.voterElections.filter((ve) => ve.isEligible).length;
    const votersWhoVoted = election.voterElections.filter((ve) => ve.hasVoted).length;
    const participationRate = eligibleVoters > 0
      ? (votersWhoVoted / eligibleVoters) * 100
      : 0;

    await prisma.electionStatistics.upsert({
      where: { electionId },
      update: {
        totalVoters,
        eligibleVoters,
        votersWhoVoted,
        participationRate,
        updatedAt: new Date(),
      },
      create: {
        electionId,
        totalVoters,
        eligibleVoters,
        votersWhoVoted,
        participationRate,
      },
    });

    console.log(`Election statistics updated for electionId: ${electionId}`);
  } catch (error) {
    console.error("Error updating election statistics:", error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = voteSchema.parse(body);

    // Validasi keberadaan pemilih
    const voter = await prisma.voter.findUnique({
      where: { id: data.voterId },
    });
    if (!voter) {
      return NextResponse.json({ error: "Voter not found." }, { status: 404 });
    }

    // Validasi keberadaan kandidat dan ambil relasi electionId
    const candidate = await prisma.candidate.findUnique({
      where: { id: data.candidateId },
      include: {
        election: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    const electionId = candidate.election.id;

    // Validasi apakah pemilih memenuhi syarat untuk pemilu ini
    const voterElection = await prisma.voterElection.findUnique({
      where: {
        voterId_electionId: {
          voterId: data.voterId,
          electionId: electionId,
        },
      },
    });
    if (!voterElection || !voterElection.isEligible) {
      return NextResponse.json({ error: "Voter is not eligible to vote in this election." }, { status: 403 });
    }

    // Validasi apakah pemilih sudah memberikan suara untuk pemilu ini
    if (voterElection.hasVoted) {
      return NextResponse.json({ error: "Voter has already voted in this election." }, { status: 400 });
    }

    // Generate hash suara
    const hashVote = generateVoteHash(data.voterId, data.candidateId, electionId);

    console.log("Submitting vote for voter:", data.voterId);

    // Simpan suara ke database
    await prisma.vote.create({
      data: {
        voterId: data.voterId,
        candidateId: data.candidateId,
        electionId: electionId,
        voteHash: hashVote,
      },
    });

    // Perbarui status voted di VoterElection
    await prisma.voterElection.update({
      where: {
        voterId_electionId: {
          voterId: data.voterId,
          electionId: electionId,
        },
      },
      data: {
        hasVoted: true, // Tandai bahwa pemilih telah memberikan suara
      },
    });

    // Tambahkan jumlah suara untuk kandidat
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { voteCount: { increment: 1 } },
    });

    // Tambahkan total suara untuk pemilu
    await prisma.election.update({
      where: { id: electionId },
      data: { totalVotes: { increment: 1 } },
    });

    // Perbarui statistik pemilu
    await updateElectionStatistics(electionId);

    console.log("Vote submitted successfully");

    // Respons sukses yang profesional
    return NextResponse.json(
      { message: "Vote submitted successfully." },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Tangani error validasi Zod
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR SUBMITTING VOTE]", err);

    // Tangani error lainnya
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}