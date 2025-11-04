import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all elections with their results - removing status filter to get all elections
    const elections = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        totalVotes: true,
        statistics: true,
        candidates: {
          select: {
            id: true,
            name: true,
            photo: true,
            voteCount: true,
          },
        },
        voterElections: {
          select: {
            voterId: true,
            isEligible: true,
            hasVoted: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${elections.length} elections`);

    // Process elections to include additional statistics
    const processedElections = elections.map((election) => {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.voteCount - a.voteCount
      );
      const winner = sortedCandidates[0] || null;
      const voteChart = sortedCandidates.map((c) => ({
        id: c.id,
        name: c.name,
        voteCount: c.voteCount,
        percentage:
          election.totalVotes > 0
            ? ((c.voteCount / election.totalVotes) * 100).toFixed(2)
            : "0.00",
      }));

      // Calculate participation statistics
      const totalVoters = election.voterElections.length;
      const voted = election.voterElections.filter((ve) => ve.hasVoted).length;
      const notVoted = totalVoters - voted;
      const percentage =
        totalVoters > 0 ? ((voted / totalVoters) * 100).toFixed(2) : "0.00";

      return {
        id: election.id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status,
        totalVotes: election.totalVotes,
        statistics: election.statistics,
        candidates: voteChart,
        winner: winner
          ? {
              id: winner.id,
              name: winner.name,
              voteCount: winner.voteCount,
              percentage:
                election.totalVotes > 0
                  ? ((winner.voteCount / election.totalVotes) * 100).toFixed(2)
                  : "0.00",
            }
          : null,
        participation: {
          totalVoters,
          voted,
          notVoted,
          percentage,
        },
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: processedElections,
      },
      console.log(
        `Returning results for ${processedElections.length} elections`
      ),
      console.log(processedElections),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching election results:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
