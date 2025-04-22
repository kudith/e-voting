import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API endpoint to get candidates by election ID
 * Note: This API uses English for backend code but returns responses in Indonesian
 * to maintain consistency with the frontend UI language
 */
export async function GET(req) {
    try {
        // Get electionId from query string
        const { searchParams } = new URL(req.url);
        const electionId = searchParams.get("electionId");

        // Validate if electionId is not provided
        if (!electionId) {
            return NextResponse.json(
                { error: "ID Pemilihan diperlukan." }, // Indonesian error message for frontend
                { status: 400 }
            );
        }

        console.log(`Fetching candidates for election ID: ${electionId}`);

        // Fetch candidates based on electionId
        const candidates = await prisma.candidate.findMany({
            where: { electionId },
            select: {
                id: true,
                name: true,
                photo: true,
                shortBio: true,
                voteCount: true,
                election: {
                    select: {
                        id: true,
                        title: true,
                        totalVotes: true,
                    },
                },
            },
            orderBy: {
                voteCount: 'desc'
            }
        });

        // If no candidates found
        if (!candidates || candidates.length === 0) {
            console.log("No candidates found for this election ID.");
            return NextResponse.json(
                { error: "Tidak ada kandidat yang ditemukan untuk ID pemilihan yang diberikan." }, // Indonesian error message
                { status: 404 }
            );
        }

        console.log(`Found ${candidates.length} candidates for election ID ${electionId}`);
        
        // Calculate total votes for the election
        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
        
        // Format candidate data with Indonesian field names for frontend
        const formattedCandidates = candidates.map((candidate, index) => {
            // Calculate vote percentage
            const votePercentage = totalVotes > 0 
                ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) 
                : "0.0";
                
            // Return candidate with Indonesian field names for frontend display
            return {
                id: candidate.id,
                name: candidate.name,
                photo: candidate.photo,
                shortBio: candidate.shortBio,
                voteCount: candidate.voteCount,
                persentaseSuara: votePercentage,  // Indonesian: vote percentage
                peringkat: index + 1,             // Indonesian: rank
                judulPemilihan: candidate.election?.title || "",  // Indonesian: election title
                idPemilihan: candidate.election?.id || "",        // Indonesian: election ID
            };
        });

        console.log("Successfully retrieved candidates for the election.");
        return NextResponse.json(formattedCandidates, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching candidates:", error);

        // Return error response in Indonesian for frontend display
        return NextResponse.json(
            { error: "Kesalahan server internal. Silakan coba lagi nanti." },
            { status: 500 }
        );
    }
}