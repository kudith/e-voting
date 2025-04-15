import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { electionId, facultyId, majorId, year } = await request.json();

    // Validate required fields
    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    // Check if at least one filter criterion is provided
    if (!facultyId && !majorId && !year) {
      return NextResponse.json(
        { error: "At least one filter criterion (faculty, major, or year) is required" },
        { status: 400 }
      );
    }

    // Build the where clause for finding eligible voters
    const whereClause = {
      AND: [
        // Base conditions
        { isActive: true },
        // Optional filters
        ...(facultyId ? [{ facultyId }] : []),
        ...(majorId ? [{ majorId }] : []),
        ...(year ? [{ year }] : []),
      ],
    };

    // Find all eligible voters
    const eligibleVoters = await prisma.voter.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (eligibleVoters.length === 0) {
      return NextResponse.json(
        { error: "No eligible voters found with the specified criteria" },
        { status: 404 }
      );
    }

    // Get existing voting rights to avoid duplicates
    const existingRights = await prisma.votingRight.findMany({
      where: {
        electionId,
        voterId: {
          in: eligibleVoters.map(voter => voter.id),
        },
      },
      select: { voterId: true },
    });

    const existingVoterIds = new Set(existingRights.map(right => right.voterId));
    const newVoterIds = eligibleVoters
      .map(voter => voter.id)
      .filter(id => !existingVoterIds.has(id));

    if (newVoterIds.length === 0) {
      return NextResponse.json(
        { message: "All eligible voters already have voting rights for this election" },
        { status: 200 }
      );
    }

    // Create voting rights for new eligible voters
    const votingRights = await prisma.votingRight.createMany({
      data: newVoterIds.map(voterId => ({
        electionId,
        voterId,
        hasVoted: false,
      })),
    });

    return NextResponse.json({
      message: `Successfully assigned voting rights to ${votingRights.count} voters`,
      count: votingRights.count,
    });
  } catch (error) {
    console.error("Error in batch assignment:", error);
    return NextResponse.json(
      { error: "Failed to assign voting rights" },
      { status: 500 }
    );
  }
} 