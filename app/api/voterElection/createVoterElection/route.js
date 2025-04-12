import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema using Zod
const voterElectionSchema = z.object({
  voterId: z.string().min(1, "Voter ID cannot be empty"),
  electionId: z.string().min(1, "Election ID cannot be empty"),
  eligible: z.boolean().optional(), // Default to true if not provided
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const validatedData = voterElectionSchema.parse(body);

    // Validate voterId
    const voter = await prisma.voter.findUnique({
      where: { id: validatedData.voterId },
    });

    if (!voter) {
      return NextResponse.json(
        { error: "Invalid voterId, no matching voter found" },
        { status: 400 }
      );
    }

    // Validate electionId
    const election = await prisma.election.findUnique({
      where: { id: validatedData.electionId },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Invalid electionId, no matching election found" },
        { status: 400 }
      );
    }

    // Check if the voterElection already exists
    const existingVoterElection = await prisma.voterElection.findUnique({
      where: {
        voterId_electionId: {
          voterId: validatedData.voterId,
          electionId: validatedData.electionId,
        },
      },
    });

    if (existingVoterElection) {
      return NextResponse.json(
        { error: "VoterElection already exists for this voter and election" },
        { status: 400 }
      );
    }

    // Create VoterElection
    const newVoterElection = await prisma.voterElection.create({
      data: {
        voterId: validatedData.voterId,
        electionId: validatedData.electionId,
        eligible: validatedData.eligible ?? true, // Default to true if not provided
      },
    });

    console.log("VoterElection successfully created:", newVoterElection);
    return NextResponse.json(
      { message: "VoterElection successfully created", voterElection: newVoterElection },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      console.error("Validation Error:", error.errors);
      return NextResponse.json(
        { errors: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}