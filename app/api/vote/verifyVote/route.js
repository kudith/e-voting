import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hybridDecrypt, generateSecureHash } from "@/lib/encryption";

// Endpoint untuk memverifikasi suara
export async function POST(req) {
  try {
    const { voteId, voteHash } = await req.json();

    if (!voteId || !voteHash) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            missingFields: {
              voteId: !voteId,
              voteHash: !voteHash
            },
            suggestion: "Please provide both voteId and voteHash for verification"
          }
        },
        { status: 400 }
      );
    }

    // Cari suara berdasarkan ID
    const vote = await prisma.vote.findUnique({
      where: {
        id: voteId,
      },
      include: {
        election: true,
      },
    });

    if (!vote) {
      return NextResponse.json(
        { 
          error: "Vote not found",
          details: {
            voteId: voteId,
            suggestion: "Please check if the vote ID is correct"
          }
        },
        { status: 404 }
      );
    }

    // Dekripsi data suara
    try {
      const decryptedData = hybridDecrypt(
        vote.encryptedData,
        vote.encryptedKey,
        vote.iv,
        vote.authTag
      );
      const voteData = JSON.parse(decryptedData);

      // Verifikasi hash menggunakan data yang didekripsi
      const computedHash = generateSecureHash(JSON.stringify(voteData));
      
      if (computedHash !== voteHash) {
        return NextResponse.json(
          { 
            error: "Invalid vote hash",
            details: {
              possibleIssues: [
                "The provided hash does not match the vote data",
                "The vote might have been tampered with"
              ],
              suggestions: [
                "Make sure you're using the correct hash from your vote receipt",
                "Verify that you're checking the right vote",
                "Contact support if you believe this is an error"
              ],
              voteInfo: {
                electionId: vote.electionId,
                timestamp: vote.createdAt
              }
            }
          },
          { status: 400 }
        );
      }

      // Verifikasi bahwa suara sudah dihitung
      if (!vote.isCounted) {
        return NextResponse.json(
          { 
            error: "Vote has not been counted yet",
            details: {
              status: "pending",
              suggestion: "Please wait until the election is completed and votes are counted",
              voteInfo: {
                electionId: voteData.electionId,
                voterId: voteData.voterId,
                timestamp: voteData.timestamp
              }
            }
          },
          { status: 400 }
        );
      }

      // Verifikasi bahwa election masih valid
      if (vote.election.status !== "completed") {
        return NextResponse.json(
          { 
            error: "Election is not completed yet",
            details: {
              currentStatus: vote.election.status,
              suggestion: "Please wait until the election is completed to verify your vote",
              voteInfo: {
                electionId: voteData.electionId,
                voterId: voteData.voterId,
                timestamp: voteData.timestamp
              }
            }
          },
          { status: 400 }
        );
      }

      // Kembalikan bukti verifikasi
      return NextResponse.json({
        success: true,
        message: "Vote verified successfully",
        data: {
          voteId: vote.id,
          electionId: vote.electionId,
          isCounted: vote.isCounted,
          electionStatus: vote.election.status,
          electionTitle: vote.election.title,
          electionEndDate: vote.election.endDate,
          timestamp: voteData.timestamp,
          verificationDetails: {
            method: "Hybrid encryption (AES-256-GCM + RSA-4096)",
            hashAlgorithm: "SHA-512",
            verificationTime: new Date().toISOString()
          }
        },
      });

    } catch (decryptionError) {
      console.error("Decryption error:", decryptionError);
      
      // Cek apakah error terkait dengan RSA
      if (decryptionError.message.includes("RSA") || decryptionError.message.includes("OAEP")) {
        return NextResponse.json(
          { 
            error: "Failed to verify vote",
            details: {
              message: "The vote data could not be decrypted due to RSA key issues",
              possibleCauses: [
                "The RSA key pair might be invalid or corrupted",
                "The encrypted key might be malformed",
                "The RSA passphrase might be incorrect"
              ],
              suggestions: [
                "Please ensure the RSA keys are properly configured",
                "Check if the RSA_PASSPHRASE environment variable is set correctly",
                "Contact support if the issue persists"
              ],
              technicalDetails: {
                errorType: "RSA Decryption Error",
                errorCode: decryptionError.code,
                timestamp: new Date().toISOString()
              }
            }
          },
          { status: 400 }
        );
      }

      // Untuk error lainnya
      return NextResponse.json(
        { 
          error: "Failed to verify vote",
          details: {
            message: "The vote data could not be decrypted",
            possibleCauses: [
              "The vote data might be corrupted",
              "The encryption keys might be invalid",
              "The vote might have been tampered with"
            ],
            suggestions: [
              "Please ensure you have the correct vote ID and hash",
              "Contact support if you believe this is an error"
            ],
            technicalDetails: {
              errorType: "Decryption Error",
              errorMessage: decryptionError.message,
              timestamp: new Date().toISOString()
            }
          }
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error verifying vote:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: {
          message: error.message,
          suggestion: "Please try again later or contact support if the problem persists",
          supportInfo: {
            timestamp: new Date().toISOString(),
            errorCode: "VERIFY_ERROR_500"
          }
        }
      },
      { status: 500 }
    );
  }
} 