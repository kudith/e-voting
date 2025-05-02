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

    // Get voter data
    const voter = await prisma.voter.findFirst({
      where: {
        email: user.email,
      },
      include: {
        faculty: true,
        major: true,
        voterElections: {
          include: {
            election: true,
          },
        },
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

    // Calculate if voter has voted in any active election
    const hasVoted = voter.voterElections.some(
      (ve) => ve.hasVoted && ve.election.status === "active"
    );

    // Get vote hash from the most recent vote
    const latestVote = voter.voterElections
      .filter((ve) => ve.hasVoted)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];

    return new NextResponse(JSON.stringify({
      ...voter,
      hasVoted,
      voteHash: latestVote?.voteHash || null,
    }));
  } catch (error) {
    console.error("Error in getCurrentVoter:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
} 