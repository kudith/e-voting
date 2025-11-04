import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all elections with their related data
    const elections = await prisma.election.findMany({
      include: {
        candidates: true,
        votes: true,
        voterElections: {
          include: {
            voter: {
              select: {
                id: true,
                faculty: { select: { name: true } },
                major: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // If no elections found, return empty stats
    if (!elections || elections.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalElections: 0,
          activeElections: 0,
          completedElections: 0,
          upcomingElections: 0,
          totalVotes: 0,
          totalVoters: 0,
          totalCandidates: 0,
          participationRate: 0,
          recentActivity: [],
          votingTrend: [],
        },
      });
    }

    // Map status from database format to UI format
    const mapStatus = (status) => {
      switch (status) {
        case "ongoing":
          return "ACTIVE";
        case "completed":
          return "COMPLETED";
        case "upcoming":
          return "UPCOMING";
        default:
          return status.toUpperCase();
      }
    };

    // Process elections to calculate statistics
    const mappedElections = elections.map((election) => ({
      ...election,
      status: mapStatus(election.status),
    }));

    const totalElections = mappedElections.length;
    const activeElections = mappedElections.filter(
      (election) => election.status === "ACTIVE"
    ).length;
    const completedElections = mappedElections.filter(
      (election) => election.status === "COMPLETED"
    ).length;
    const upcomingElections = mappedElections.filter(
      (election) => election.status === "UPCOMING"
    ).length;

    // Calculate total votes
    const totalVotes = mappedElections.reduce(
      (sum, election) => sum + election.votes.length,
      0
    );

    // Calculate total candidates
    const totalCandidates = mappedElections.reduce(
      (sum, election) => sum + election.candidates.length,
      0
    );

    // Calculate voter participation
    let totalVoters = 0;
    let totalVotedVoters = 0;

    mappedElections.forEach((election) => {
      const votersInElection = election.voterElections.length;
      const votedInElection = election.voterElections.filter(
        (ve) => ve.hasVoted
      ).length;

      totalVoters += votersInElection;
      totalVotedVoters += votedInElection;
    });

    const participationRate =
      totalVoters > 0 ? Math.round((totalVotedVoters / totalVoters) * 100) : 0;

    // Create voting trend data (votes per day) - PERBAIKAN
    const votingTrend = [];

    // Ambil semua votes dari semua election
    const allVotes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 hari terakhir
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group votes by date
    const votesMap = new Map();
    allVotes.forEach((vote) => {
      const date = new Date(vote.createdAt).toISOString().split("T")[0];
      votesMap.set(date, (votesMap.get(date) || 0) + 1);
    });

    // Convert to array dan isi tanggal yang kosong dengan 0
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      return date.toISOString().split("T")[0];
    });

    last30Days.forEach((date) => {
      votingTrend.push({
        date,
        votes: votesMap.get(date) || 0,
      });
    });

    // Generate participation stats for each election
    const electionsWithParticipation = mappedElections.map((election) => {
      const totalVotersInElection = election.voterElections.length;
      const votedVotersInElection = election.voterElections.filter(
        (ve) => ve.hasVoted
      ).length;
      const participation = {
        totalVoters: totalVotersInElection,
        voted: votedVotersInElection,
        notVoted: totalVotersInElection - votedVotersInElection,
        percentage:
          totalVotersInElection > 0
            ? ((votedVotersInElection / totalVotersInElection) * 100).toFixed(2)
            : "0.00",
      };

      return {
        id: election.id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status,
        totalVotes: election.votes.length,
        participation,
        candidateCount: election.candidates.length,
      };
    });

    // Create recent activity from completed and active elections
    const recentActivity = electionsWithParticipation
      .filter((election) => election.status !== "UPCOMING")
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(0, 5)
      .map((election) => ({
        id: election.id,
        title: election.title,
        date: election.endDate,
        votes: election.totalVotes,
        status: election.status,
      }));

    // Return the dashboard statistics
    return NextResponse.json({
      success: true,
      data: {
        totalElections,
        activeElections,
        completedElections,
        upcomingElections,
        totalVotes,
        totalCandidates,
        totalVoters,
        participationRate,
        recentActivity,
        votingTrend,
        elections: electionsWithParticipation,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
