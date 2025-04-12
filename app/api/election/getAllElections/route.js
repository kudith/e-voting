import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Fetching all elections with candidates...");

        // Fetch all elections with their candidates
        const elections = await prisma.election.findMany({
            include: {
                candidates: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        vision: true,
                        mission: true,
                        shortBio: true,
                        voteCount: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        if (!elections || elections.length === 0) {
            console.warn("No elections found in the database.");
            return NextResponse.json(
                { error: "No elections found" },
                { status: 404 }
            );
        }

        // Format the response
        const formattedElections = elections.map((election) => ({
            id: election.id,
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            createdAt: election.createdAt,
            updatedAt: election.updatedAt,
            candidates: election.candidates.map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                photo: candidate.photo,
                vision: candidate.vision,
                mission: candidate.mission,
                shortBio: candidate.shortBio,
                voteCount: candidate.voteCount,
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt,
            })),
        }));

        console.log("Successfully retrieved all elections with candidates.");
        return NextResponse.json(formattedElections, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching elections:", error);

        // Return a detailed error response for debugging
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}