import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

export async function POST(req) {
    try {
        const { voterIds } = await req.json();

        // Validasi input
        if (!voterIds || !Array.isArray(voterIds) || voterIds.length === 0) {
            console.error("Validation Error: voterIds array is required");
            return NextResponse.json({ error: "voterIds array is required" }, { status: 400 });
        }

        console.log(`Bulk deleting ${voterIds.length} voters`);

        // Ambil data voters beserta vote-nya dari database
        const voters = await prisma.voter.findMany({
            where: { 
                id: { in: voterIds } 
            },
            include: {
                votes: {
                    include: {
                        candidate: true,
                        election: true
                    }
                }
            }
        });

        if (voters.length === 0) {
            console.error("No voters found with the provided IDs");
            return NextResponse.json({ error: "No voters found" }, { status: 404 });
        }

        // Mulai transaksi database untuk menghapus semua voters
        await prisma.$transaction(async (tx) => {
            // Proses setiap voter
            for (const voter of voters) {
                // Jika voter memiliki vote, kurangi vote count kandidat
                if (voter.votes) {
                    console.log("Reducing vote count for candidate:", voter.votes.candidate?.id);
                    
                    // Update vote count kandidat
                    await tx.candidate.update({
                        where: { id: voter.votes.candidateId },
                        data: {
                            voteCount: {
                                decrement: 1
                            }
                        }
                    });

                    // Update total votes di election
                    await tx.election.update({
                        where: { id: voter.votes.electionId },
                        data: {
                            totalVotes: {
                                decrement: 1
                            }
                        }
                    });

                    // Hapus vote
                    await tx.vote.delete({
                        where: { voterId: voter.id }
                    });
                }

                // Hapus voter elections
                await tx.voterElection.deleteMany({
                    where: { voterId: voter.id }
                });
            }

            // Hapus semua voters dalam satu operasi
            await tx.voter.deleteMany({
                where: { id: { in: voterIds } }
            });
        });

        // Hapus users dari Kinde secara parallel
        const kindePromises = voters.map(voter => 
            fetch(`${KINDE_API_URL}/api/v1/user?id=${voter.kindeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${KINDE_API_KEY}`,
                },
            })
        );

        // Tunggu semua Kinde API calls selesai
        const kindeResponses = await Promise.all(kindePromises);
        
        // Cek jika ada error dari Kinde API
        const failedResponses = kindeResponses.filter(response => !response.ok);
        if (failedResponses.length > 0) {
            const errors = await Promise.all(failedResponses.map(response => response.text()));
            console.error("Error deleting users in Kinde:", errors);
            return NextResponse.json(
                { error: "Failed to delete some users in Kinde", details: errors },
                { status: 500 }
            );
        }

        console.log(`Successfully deleted ${voters.length} voters`);
        return NextResponse.json({ 
            message: `${voters.length} voters successfully deleted`,
            deletedCount: voters.length
        }, { status: 200 });

    } catch (error) {
        console.error("Error in bulk deleting voters:", error);
        return NextResponse.json({ 
            error: "Internal server error",
            message: error.message 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 