import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 }
      );
    }

    // Get voter
    const voter = await prisma.voter.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!voter) {
      return new NextResponse(
        JSON.stringify({
          error: "Voter not found",
        }),
        { status: 404 }
      );
    }

    // Get voter elections with related data
    const voterElections = await prisma.election.findMany({
      where: {
        voterElections: {
          some: {
            voterId: voter.id,
          },
        },
      },
      include: {
        voterElections: {
          where: {
            voterId: voter.id,
          },
        },
        candidates: true,
      },
    });

    // Get total voters and voted count for each election
    const electionsWithStats = await Promise.all(
      voterElections.map(async (election) => {
        const totalVoters = await prisma.voterElection.count({
          where: {
            electionId: election.id,
          },
        });

        const votedCount = await prisma.voterElection.count({
          where: {
            electionId: election.id,
            hasVoted: true,
          },
        });

        return {
          ...election,
          totalVoters,
          votedCount,
          hasVoted: election.voterElections[0]?.hasVoted || false,
          isEligible: election.voterElections[0]?.isEligible || false,
        };
      })
    );

    return new NextResponse(JSON.stringify(electionsWithStats));
  } catch (error) {
    console.error("Error in getVoterElections:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
} 