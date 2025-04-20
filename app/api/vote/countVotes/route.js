import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hybridDecrypt } from "@/lib/encryption";

export async function POST(req) {
  try {
    const { electionId } = await req.json();

    if (!electionId) {
      return NextResponse.json(
        { 
          error: "Missing electionId",
          details: {
            suggestion: "Please provide a valid election ID"
          }
        },
        { status: 400 }
      );
    }

    // Cek apakah election sudah selesai
    const election = await prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });

    if (!election) {
      return NextResponse.json(
        { 
          error: "Election not found",
          details: {
            electionId: electionId,
            suggestion: "Please check if the election ID is correct"
          }
        },
        { status: 404 }
      );
    }

    if (election.status !== "completed") {
      return NextResponse.json(
        { 
          error: "Election is not completed yet",
          details: {
            currentStatus: election.status,
            suggestion: "Please wait until the election is completed to count votes"
          }
        },
        { status: 400 }
      );
    }

    // Ambil semua suara yang belum dihitung
    const uncountedVotes = await prisma.vote.findMany({
      where: {
        electionId: electionId,
        isCounted: false,
      },
    });

    // Hitung suara untuk setiap kandidat
    const voteCounts = {};
    const voteDetails = [];

    for (const vote of uncountedVotes) {
      try {
        // Dekripsi data suara
        const decryptedData = hybridDecrypt(
          vote.encryptedData,
          vote.encryptedKey,
          vote.iv,
          vote.authTag
        );
        const voteData = JSON.parse(decryptedData);

        // Update jumlah suara untuk kandidat
        const candidateId = voteData.candidateId;
        voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;

        // Simpan detail suara
        voteDetails.push({
          voteId: vote.id,
          candidateId: candidateId,
          voterId: voteData.voterId,
          timestamp: voteData.timestamp
        });

        // Update status isCounted
        await prisma.vote.update({
          where: { id: vote.id },
          data: { isCounted: true }
        });

      } catch (error) {
        console.error(`Error processing vote ${vote.id}:`, error);
        // Lanjutkan ke suara berikutnya jika ada error
        continue;
      }
    }

    // Update jumlah suara untuk setiap kandidat
    for (const [candidateId, count] of Object.entries(voteCounts)) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { voteCount: { increment: count } }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Votes counted successfully",
      data: {
        totalVotesCounted: uncountedVotes.length,
        voteCounts: voteCounts,
        voteDetails: voteDetails,
      },
    });

  } catch (error) {
    console.error("Error counting votes:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: {
          message: error.message,
          suggestion: "Please try again later or contact support if the problem persists"
        }
      },
      { status: 500 }
    );
  }
} 