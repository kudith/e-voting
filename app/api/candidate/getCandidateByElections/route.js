import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req) {
    try {
        // Ambil parameter `electionId` dari query string
        const { searchParams } = new URL(req.url);
        const electionId = searchParams.get("electionId");

        // Validasi jika `electionId` tidak diberikan
        if (!electionId) {
            return NextResponse.json(
                { error: "Election ID is required." },
                { status: 400 }
            );
        }

        console.log(`Fetching candidates for electionId: ${electionId}`);

        // Fetch candidates berdasarkan `electionId`
        const candidates = await prisma.candidate.findMany({
            where: { electionId },
            include: {
                election: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });

        // Jika tidak ada kandidat ditemukan
        if (!candidates || candidates.length === 0) {
            console.log("No candidates found for this election.");
            return NextResponse.json(
                { error: "No candidates found for the given election ID." },
                { status: 404 }
            );
        }

        console.log(`Found ${candidates.length} candidates for election ID ${electionId}`);
        
        // Log detailed info for each candidate
        candidates.forEach((candidate, index) => {
            console.log(`\nCandidate ${index + 1}:`);
            console.log(`ID: ${candidate.id}`);
            console.log(`Name: ${candidate.name}`);
            console.log(`Photo: ${candidate.photo || "NO PHOTO"}`);
            console.log(`Vision: ${candidate.vision?.substring(0, 30) || "NO VISION"}...`);
            console.log(`Vote count: ${candidate.voteCount}`);
        });

        // Format data kandidat
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
                      description: candidate.election.description,
                      startDate: candidate.election.startDate,
                      endDate: candidate.election.endDate,
                  }
                : null,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
        }));

        console.log("Successfully retrieved candidates for the election.");
        return NextResponse.json(formattedCandidates, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching candidates:", error);

        // Return error response
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}