import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema using Zod
const updateVoterElectionSchema = z.object({
  voterId: z.string().min(1, "Voter ID cannot be empty").optional(),
  electionId: z.string().min(1, "Election ID cannot be empty").optional(),
  isEligible: z.boolean().optional(),
  hasVoted: z.boolean().optional(),
});

export async function PATCH(req) {
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

    // Validate new electionId if provided
    if (validatedData.electionId) {
      const newElection = await prisma.election.findUnique({
        where: { id: validatedData.electionId },
      });

      if (!newElection) {
        return NextResponse.json(
          { error: "New electionId is invalid or does not exist" },
          { status: 404 }
        );
      }

      // Check if the voterElection already exists for the new election
      const duplicateVoterElection = await prisma.voterElection.findUnique({
        where: {
          voterId_electionId: {
            voterId: existingVoterElection.voterId,
            electionId: validatedData.electionId,
          },
        },
      });

      if (duplicateVoterElection) {
        return NextResponse.json(
          { error: "VoterElection already exists for the new electionId" },
          { status: 400 }
        );
      }
    }

    // Update VoterElection
    await prisma.voterElection.update({
      where: { id },
      data: validatedData,
    });

    console.log("VoterElection successfully updated");

    // Professional response
    return NextResponse.json(
      { message: "VoterElection successfully updated" },
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