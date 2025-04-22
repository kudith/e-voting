import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hybridDecrypt, generateSecureHash } from "@/lib/encryption";

// Endpoint untuk memverifikasi suara hanya dengan hash
export async function POST(req) {
  try {
    const { voteHash } = await req.json();

    if (!voteHash) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            missingFields: {
              voteHash: !voteHash
            },
            suggestion: "Please provide voteHash for verification"
          }
        },
        { status: 400 }
      );
    }

    // Ambil semua suara (vote) untuk diverifikasi
    const votes = await prisma.vote.findMany({
      include: {
        election: true,
      },
    });

    let matchedVote = null;
    let matchedVoteData = null;
    let matchedCandidate = null;

    // Loop melalui semua vote untuk mencari yang hash-nya cocok
    for (const vote of votes) {
      try {
        // Dekripsi data suara
        const decryptedData = hybridDecrypt(
          vote.encryptedData,
          vote.encryptedKey,
          vote.iv,
          vote.authTag
        );
        const voteData = JSON.parse(decryptedData);

        // Hitung hash dari data yang didekripsi
        const computedHash = generateSecureHash(JSON.stringify(voteData));
        
        // Bandingkan dengan hash yang diberikan
        if (computedHash === voteHash) {
          matchedVote = vote;
          matchedVoteData = voteData;

          // Ambil kandidat berdasarkan candidateId dan electionId
          if (voteData.candidateId && vote.electionId) {
            matchedCandidate = await prisma.candidate.findFirst({
              where: {
                id: voteData.candidateId,
                electionId: vote.electionId,
              },
              select: {
                id: true,
                name: true,
              },
            });
          }
          break;
        }
      } catch (decryptionError) {
        // Lewati vote yang gagal didekripsi
        continue;
      }
    }

    // Jika tidak ada vote yang cocok
    if (!matchedVote) {
      return NextResponse.json(
        { 
          error: "Vote not found",
          details: {
            suggestion: "Please check if the vote hash is correct"
          }
        },
        { status: 404 }
      );
    }

    // Kembalikan bukti verifikasi
    return NextResponse.json({
      success: true,
      message: "Vote verified successfully",
      data: {
        voteId: matchedVote.id,
        electionId: matchedVote.electionId,
        isCounted: matchedVote.isCounted,
        electionStatus: matchedVote.election.status,
        electionTitle: matchedVote.election.title,
        electionEndDate: matchedVote.election.endDate,
        candidate: matchedCandidate ? {
          id: matchedCandidate.id,
          name: matchedCandidate.name,
        } : null,
        timestamp: matchedVoteData.timestamp,
        verificationDetails: {
          method: "Hybrid encryption (AES-256-GCM + RSA-4096)",
          hashAlgorithm: "SHA-512",
          verificationTime: new Date().toISOString()
        }
      },
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: {
          message: "An unexpected error occurred during vote verification",
          suggestion: "Please try again later or contact support"
        }
      },
      { status: 500 }
    );
  }
}
