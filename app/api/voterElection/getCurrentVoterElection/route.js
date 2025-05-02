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

    // Get active or completed election with voter election data
    const voterElection = await prisma.election.findFirst({
      where: {
        OR: [
          { status: "active" },
          { status: "ongoing" },
          { status: "completed" }
        ],
        voterElections: {
          some: {
            voterId: voter.id,
          }
        }
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
      orderBy: {
        endDate: 'desc' // Get the most recent election first
      },
    });

    if (!voterElection) {
      return new NextResponse(
        JSON.stringify({
          error: "No active or completed election found for this voter",
        }),
        { status: 404 }
      );
    }

    // Get voter's election status
    const voterElectionStatus = voterElection.voterElections[0];
    
    // Format response
    const response = {
      election: {
        id: voterElection.id,
        title: voterElection.title,
        description: voterElection.description,
        startDate: voterElection.startDate,
        endDate: voterElection.endDate,
        status: voterElection.status,
        totalVoters: voterElection.statistics?.totalVoters || 0,
        votedCount: voterElection.statistics?.votersWhoVoted || 0,
      },
      voterStatus: voterElectionStatus ? {
        isEligible: voterElectionStatus.isEligible,
        hasVoted: voterElectionStatus.hasVoted,
        voteHash: voterElection.votes[0]?.voteHash || null,
      } : null,
      candidates: voterElection.candidates.map(candidate => ({
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