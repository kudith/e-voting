import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { 
                    error: "Missing candidate ID",
                    details: {
                        suggestion: "Please provide a valid candidate ID in the query parameters"
                    }
                },
                { status: 400 }
            );
        }

        console.log(`Fetching candidate with ID: ${id}`);

        const candidate = await prisma.candidate.findUnique({
            where: { 
                id: id 
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

        if (!candidate) {
            return NextResponse.json(
                { 
                    error: "Candidate not found",
                    details: {
                        candidateId: id,
                        suggestion: "Please check if the candidate ID is correct"
                    }
                },
                { status: 404 }
            );
        }

        // Calculate vote percentage
        const votePercentage = candidate.election?.totalVotes > 0 
            ? (candidate.voteCount / candidate.election.totalVotes) * 100 
            : 0;

        // Format the response
        const formattedCandidate = {
            id: candidate.id,
            name: candidate.name,
            photo: candidate.photo,
            vision: candidate.vision,
            mission: candidate.mission,
            shortBio: candidate.shortBio,
            details: candidate.details,
            voteCount: candidate.voteCount,
            votePercentage: votePercentage.toFixed(1),
            election: candidate.election
                ? {
                    id: candidate.election.id,
                    title: candidate.election.title,
                    description: candidate.election.description,
                    startDate: candidate.election.startDate,
                    endDate: candidate.election.endDate,
                    status: candidate.election.status,
                    totalVotes: candidate.election.totalVotes,
                }
                : null,
            socialMedia: candidate.socialMedia || null,
            education: candidate.education || [],
            experience: candidate.experience || [],
            achievements: candidate.achievements || [],
            programs: candidate.programs || [],
            stats: candidate.stats || null,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
        };

        return NextResponse.json(formattedCandidate, { status: 200 });
    } catch (error) {
        console.error("Error fetching candidate by ID:", error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2023') {
            return NextResponse.json(
                { 
                    error: "Invalid candidate ID format",
                    details: {
                        suggestion: "Please provide a valid MongoDB ObjectId"
                    }
                },
                { status: 400 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            { 
                error: "Internal server error",
                details: {
                    message: error.message,
                    suggestion: "Please try again later or contact support if the problem persists"
                }
            },
            { status: 500 }
        );
    }
}
