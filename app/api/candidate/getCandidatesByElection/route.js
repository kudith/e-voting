import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // Get election ID from query params
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("electionId");

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching candidates for election ID: ${electionId}`);

    // Get candidates for the specified election
    const candidates = await prisma.candidate.findMany({
      where: {
        electionId: electionId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Found ${candidates.length} candidates for election ID: ${electionId}`);
    
    if (candidates.length === 0) {
      console.log("No candidates found for this election.");
    } else {
      console.log("First candidate data sample:", JSON.stringify(candidates[0], null, 2));
    }

    // Transform the data to match the expected format in the frontend
    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      photo: candidate.photo || "",
      position: "Candidate", // Default position since it's not in the schema
      vision: candidate.vision || "No vision statement provided",
      mission: candidate.mission || "No mission statement provided",
      shortBio: candidate.shortBio || "",
      voteCount: candidate.voteCount || 0, // Using the direct voteCount field
    }));

    return NextResponse.json(formattedCandidates, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates", message: error.message },
      { status: 500 }
    );
  }
} 