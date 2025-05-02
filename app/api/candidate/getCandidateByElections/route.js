import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API endpoint to get candidates by election ID
 */
export async function GET(req) {
    try {
        // Get electionId from query string
        const { searchParams } = new URL(req.url);
        const electionId = searchParams.get("electionId");

        // Validate if electionId is not provided
        if (!electionId) {
            return NextResponse.json(
                { error: "Election ID is required." },
                { status: 400 }
            );
        }

        console.log(`Fetching candidates for election ID: ${electionId}`);

        // Fetch candidates based on electionId
        const candidates = await prisma.candidate.findMany({
            where: { electionId },
            orderBy: {
                voteCount: 'desc'
            },
            include: {
                election: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        totalVotes: true,
                    },
                },
                socialMedia: true,
                education: {
                    orderBy: {
                        year: 'desc'
                    }
                },
                experience: {
                    orderBy: {
                        period: 'desc'
                    }
                },
                achievements: {
                    orderBy: {
                        year: 'desc'
                    }
                },
                programs: true,
                stats: true
            },
        });

        // If no candidates found
        if (!candidates || candidates.length === 0) {
            console.log("No candidates found for this election ID.");
            return NextResponse.json(
                { error: "No candidates found for the provided election ID." },
                { status: 404 }
            );
        }

        console.log(`Found ${candidates.length} candidates for election ID ${electionId}`);
        
        // Calculate total votes for the election
        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
        
        // Add vote percentage and ranking to each candidate
        const candidatesWithPercentage = candidates.map((candidate, index) => {
            // Calculate percentage with 1 decimal place precision
            const percentage = totalVotes > 0 
                ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) 
                : "0.0";
                
            return {
                ...candidate,
                votePercentage: percentage, // English key name for votePercentage
                ranking: index + 1          // English key name for ranking
            };
        });
        
        console.log("Successfully retrieved candidates with vote percentages for the election.");
        return NextResponse.json(candidatesWithPercentage, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching candidates:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}