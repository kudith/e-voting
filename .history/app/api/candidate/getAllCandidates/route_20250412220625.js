import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Fetching all candidates data...");

        // Fetch all candidate data with election details
        const candidates = await prisma.candidate.findMany({
            include: {
                election: {
                    select: {
                        id: true,
                        title: true, // Include election ID and title
                        description: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });

        if (!candidates || candidates.length === 0) {
            console.warn("No candidates found in the database.");
            return NextResponse.json(
                { error: "No candidates found" },
                { status: 404 }
            );
        }
 // mendapatkan 
        const getCandidatesByElection = async (electionId) => {
          try {
            const response = await fetch(
              `/api/candidate/getCandidateByElections?electionId=${electionId}`
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch candidates");
            }

            const candidates = await response.json();
            console.log("Candidates fetched successfully:", candidates);
            return candidates;
          } catch (error) {
            console.error("Error fetching candidates:", error);
            throw error;
          }
        };
        // Map the response to include election details as an object
        const formattedCandidates = candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            photo: candidate.photo,
            vision: candidate.vision,
            mission: candidate.mission,
            shortBio: candidate.shortBio,
            voteCount: candidate.voteCount,
            election: candidate.election
                ? {
                      id: candidate.election.id,
                      title: candidate.election.title,
                  }
                : null, // Include election details if available
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
        }));

        console.log("Successfully retrieved all candidates data.");
        return NextResponse.json(formattedCandidates, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching candidates data:", error);

        // Return a detailed error response for debugging
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}