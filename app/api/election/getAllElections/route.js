import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        console.log("Fetching all elections with essential fields...");

        // Fetch all elections with selected fields and their candidates
        const elections = await prisma.election.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                endDate: true,
                status: true,
                totalVotes: true,
                candidates: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        voteCount: true,
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
            status: election.status,
            totalVotes: election.totalVotes,
            candidates: election.candidates.map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                photo: candidate.photo,
                voteCount: candidate.voteCount,
            })),
        }));

        console.log("Successfully retrieved all elections with essential fields.");
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