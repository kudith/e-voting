import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Fetching all voters data...");

        // Fetch all voter data with faculty, major, voterElections, and votes details
        const voters = await prisma.voter.findMany({
            include: {
                faculty: {
                    select: {
                        name: true, 
                    },
                },
                major: {
                    select: {
                        name: true,
                    },
                },
                voterElections: {
                    include: {
                        election: {
                            select: {
                                id: true,
                                title: true, // Include election ID and title
                                startDate: true,
                                endDate: true,
                                status: true, // Include election status
                            },
                        },
                    },
                },
                votes: {
                    include: {
                        candidate: {
                            select: {
                                id: true,
                                name: true, // Include candidate ID and name
                            },
                        },
                        election: {
                            select: {
                                id: true,
                                title: true, // Include election ID and title
                            },
                        },
                    },
                },
            },
        });

        if (!voters || voters.length === 0) {
            console.warn("No voters found in the database.");
            return NextResponse.json(
                { error: "No voters found" },
                { status: 404 }
            );
        }

        // Map the response to include faculty, major, voterElections, and votes as objects
        const formattedVoters = voters.map((voter) => ({
            id: voter.id,
            kindeId: voter.kindeId,
            voterCode: voter.voterCode,
            name: voter.name,
            email: voter.email,
            phone: voter.phone,
            faculty: voter.faculty
                ? { id: voter.faculty.id, name: voter.faculty.name }
                : null, // Include faculty as an object
            major: voter.major
                ? { id: voter.major.id, name: voter.major.name }
                : null, // Include major as an object
            year: voter.year,
            status: voter.status,
            voterElections: voter.voterElections.map((ve) => ({
                id: ve.id,
                election: ve.election
                    ? {
                          id: ve.election.id,
                          title: ve.election.title,
                          startDate: ve.election.startDate,
                          endDate: ve.election.endDate,
                          status: ve.election.status,
                      }
                    : null, // Include election details
                isEligible: ve.isEligible,
                hasVoted: ve.hasVoted,
            })),
            createdAt: voter.createdAt,
            updatedAt: voter.updatedAt,
        }));

        console.log("Successfully retrieved all voters data.");
        return NextResponse.json(formattedVoters, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching voters data:", error);

        // Return a detailed error response for debugging
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}