import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema using Zod
const updateVoterElectionSchema = z.object({
  voterId: z.string().min(1, "Voter ID cannot be empty").optional(),
  electionId: z.string().min(1, "Election ID cannot be empty").optional(),
  eligible: z.boolean().optional(),
});

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate input using Zod
    const validatedData = updateVoterElectionSchema.parse(body);

    // Check if the voterElection exists
    const existingVoterElection = await prisma.voterElection.findUnique({
      where: { id },
    });

    if (!existingVoterElection) {
      return NextResponse.json(
        { error: "VoterElection not found" },
        { status: 404 }
      );
    }

    // Update VoterElection
    const updatedVoterElection = await prisma.voterElection.update({
      where: { id },
      data: validatedData,
    });

    console.log("VoterElection successfully updated:", updatedVoterElection);
    return NextResponse.json(
      { message: "VoterElection successfully updated", voterElection: updatedVoterElection },
      { status: 200 }
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