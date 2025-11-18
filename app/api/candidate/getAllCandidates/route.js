import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching all candidates data...");

    // Fetch all candidate data with detailed relations
    const candidates = await prisma.candidate.findMany({
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
            year: "desc",
          },
        },
        experience: {
          orderBy: {
            period: "desc",
          },
        },
        achievements: {
          orderBy: {
            year: "desc",
          },
        },
        programs: true,
        stats: true,
      },
    });

    if (!candidates || candidates.length === 0) {
      console.warn("No candidates found in the database.");
      return NextResponse.json(
        { error: "No candidates found" },
        { status: 404 }
      );
    }

    // Map the response to include all detailed information
    const formattedCandidates = candidates.map((candidate) => {
      // Calculate vote percentage
      const votePercentage =
        candidate.election?.totalVotes > 0
          ? (candidate.voteCount / candidate.election.totalVotes) * 100
          : 0;

      return {
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
    });

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
