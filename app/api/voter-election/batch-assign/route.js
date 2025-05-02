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

    // Check if at least one filter criteria is provided
    if (!facultyId && !majorId && !year) {
      return NextResponse.json(
        { error: "At least one filter criteria (faculty, major, or year) is required" },
        { status: 400 }
      );
    }

    // Build the where clause for voter filtering
    const voterWhereClause = {};
    if (facultyId) voterWhereClause.facultyId = facultyId;
    if (majorId) voterWhereClause.majorId = majorId;
    if (year) voterWhereClause.year = year;

    // Find eligible voters based on criteria
    const eligibleVoters = await prisma.voter.findMany({
      where: voterWhereClause,
      select: {
        id: true,
      },
    });

    if (eligibleVoters.length === 0) {
      return NextResponse.json(
        { message: "No eligible voters found for the specified criteria" },
        { status: 200 }
      );
    }

    // Create voter election entries for all eligible voters
    const voterElections = await prisma.voterElection.createMany({
      data: eligibleVoters.map((voter) => ({
        voterId: voter.id,
        electionId: electionId,
        isEligible: true,
        hasVoted: false,
      })),
      skipDuplicates: true, // Skip if voter already has voting rights for this election
    });

    return NextResponse.json(
      { 
        message: `Successfully assigned voting rights to ${voterElections.count} voters`,
        count: voterElections.count
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in batch assignment:", error);
    return NextResponse.json(
      { error: "Failed to assign voting rights" },
      { status: 500 }
    );
  }
} 