import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // Get election ID from query params
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("id");

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching election with ID: ${electionId} including candidates`);

    // Get election with its candidates
    const election = await prisma.election.findUnique({
      where: {
        id: electionId,
      },
      include: {
        candidates: true,
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    console.log(`Found election: ${election.title}`);
    console.log(`Number of candidates: ${election.candidates.length}`);
    
    if (election.candidates.length > 0) {
      console.log("First candidate:", election.candidates[0].name);
    }

    return NextResponse.json(election, { status: 200 });
  } catch (error) {
    console.error("Error fetching election with candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch election", message: error.message },
      { status: 500 }
    );
  }
} 