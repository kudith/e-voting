import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hybridEncrypt, generateSecureHash } from "@/lib/encryption";


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
    const { electionId, candidateId, voterId } = await req.json();

    if (!electionId || !candidateId || !voterId) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            missingFields: {
              electionId: !electionId,
              candidateId: !candidateId,
              voterId: !voterId
            }
          }
        },
        { status: 400 }
      );
    }

    // Cek apakah pemilih sudah memilih di pemilu ini
    const existingVote = await prisma.vote.findFirst({
      where: {
        electionId: electionId,
        voterId: voterId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { 
          error: "You have already voted in this election",
          details: {
            suggestion: "Each voter can only vote once in an election"
          }
        },
        { status: 400 }
      );
    }

    // Cek apakah pemilih memenuhi syarat untuk pemilu ini
    const voterElection = await prisma.voterElection.findUnique({
      where: {
        voterId_electionId: {
          voterId: voterId,
          electionId: electionId,
        },
      },
    });

    if (!voterElection || !voterElection.isEligible) {
      return NextResponse.json(
        { 
          error: "You are not eligible to vote in this election",
          details: {
            suggestion: "Please check your voter eligibility status"
          }
        },
        { status: 403 }
      );
    }

    // Enkripsi data suara
    const voteData = {
      electionId,
      candidateId,
      voterId,
      timestamp: new Date().toISOString()
    };

    // Generate hash sebelum enkripsi
    const voteHash = generateSecureHash(JSON.stringify(voteData));
    
    // Enkripsi data
    const encryptedVote = hybridEncrypt(JSON.stringify(voteData));

    // Mulai transaksi database
    const result = await prisma.$transaction(async (tx) => {
      // 1. Simpan suara terenkripsi
      const vote = await tx.vote.create({
        data: {
          election: {
            connect: {
              id: electionId
            }
          },
          voterId: voterId,
          encryptedData: encryptedVote.encryptedData,
          encryptedKey: encryptedVote.encryptedKey,
          iv: encryptedVote.iv,
          authTag: encryptedVote.authTag,
          isCounted: false,
        },
      });

      // 2. Update status voted di VoterElection
      await tx.voterElection.update({
        where: {
          voterId_electionId: {
            voterId: voterId,
            electionId: electionId,
          },
        },
        data: {
          hasVoted: true,
        },
      });

      // 3. Update total votes di election
      await tx.election.update({
        where: {
          id: electionId,
        },
        data: {
          totalVotes: {
            increment: 1,
          },
        },
      });

      // 4. Update vote count di candidate
      await tx.candidate.update({
        where: {
          id: candidateId,
        },
        data: {
          voteCount: {
            increment: 1,
          },
        },
      });

      return vote;
    });

    // Update election statistics
    await updateElectionStatistics(electionId);

    // Kembalikan bukti suara yang bisa digunakan untuk verifikasi
    return NextResponse.json({
      success: true,
      message: "Vote submitted successfully",
      data: {
        voteId: result.id,
        voteHash: voteHash, // Hash hanya diberikan sekali ke pemilih
        electionId: electionId,
        timestamp: voteData.timestamp,
        verificationInstructions: {
          message: "Please save this hash securely. You will need it to verify your vote later.",
          warning: "This hash will only be shown once and cannot be retrieved if lost."
        }
      },
    });

  } catch (error) {
    console.error("Error submitting vote:", error);
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