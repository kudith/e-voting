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

    // Get voter data first
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

    // Get active election with voter election data
    const activeElection = await prisma.election.findFirst({
      where: {
        status: "active",
        endDate: {
          gt: new Date(),
        },
      },
      include: {
        voterElections: {
          where: {
            voterId: voter.id,
          },
          include: {
            voter: true,
          },
        },
        candidates: true,
        votes: {
          where: {
            voterId: voter.id,
          },
        },
        statistics: true,
      },
    });

    if (!activeElection) {
      return new NextResponse(
        JSON.stringify({
          error: "No active election found",
        }),
        { status: 404 }
      );
    }

    // Get voter's election status
    const voterElection = activeElection.voterElections[0];
    
    // Format response
    const response = {
      election: {
        id: activeElection.id,
        title: activeElection.title,
        description: activeElection.description,
        startDate: activeElection.startDate,
        endDate: activeElection.endDate,
        status: activeElection.status,
        totalVoters: activeElection.statistics?.totalVoters || 0,
        votedCount: activeElection.statistics?.votersWhoVoted || 0,
      },
      voterStatus: voterElection ? {
        isEligible: voterElection.isEligible,
        hasVoted: voterElection.hasVoted,
        voteHash: activeElection.votes[0]?.voteHash || null,
      } : null,
      candidates: activeElection.candidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        photo: candidate.photo,
        vision: candidate.vision,
        mission: candidate.mission,
        shortBio: candidate.shortBio,
        voteCount: candidate.voteCount,
      })),
    };

    return new NextResponse(JSON.stringify(response));
  } catch (error) {
    console.error("Error in getCurrentVoterElection:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
} 