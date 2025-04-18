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
      include: {
        voter: true,
        election: true
      }
    });

    if (!existingVoterElection) {
      return NextResponse.json(
        { error: "VoterElection not found" },
        { status: 404 }
      );
    }

    // If electionId is being updated
    if (validatedData.electionId && validatedData.electionId !== existingVoterElection.electionId) {
      // Check if the new election exists
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
      const duplicateVoterElection = await prisma.voterElection.findFirst({
        where: {
          voterId: existingVoterElection.voterId,
          electionId: validatedData.electionId,
          NOT: {
            id: id
          }
        },
      });

      if (duplicateVoterElection) {
        return NextResponse.json(
          { error: "VoterElection already exists for this voter and election" },
          { status: 400 }
        );
      }
    }

    // If voterId is being updated
    if (validatedData.voterId && validatedData.voterId !== existingVoterElection.voterId) {
      // Check if the new voter exists
      const newVoter = await prisma.voter.findUnique({
        where: { id: validatedData.voterId },
      });

      if (!newVoter) {
        return NextResponse.json(
          { error: "New voterId is invalid or does not exist" },
          { status: 404 }
        );
      }

      // Check if the voterElection already exists for the new voter
      const duplicateVoterElection = await prisma.voterElection.findFirst({
        where: {
          voterId: validatedData.voterId,
          electionId: existingVoterElection.electionId,
          NOT: {
            id: id
          }
        },
      });

      if (duplicateVoterElection) {
        return NextResponse.json(
          { error: "VoterElection already exists for this voter and election" },
          { status: 400 }
        );
      }
    }

    // Update VoterElection
    const updatedVoterElection = await prisma.voterElection.update({
      where: { id },
      data: validatedData,
      include: {
        voter: true,
        election: true
      }
    });

    // Return the updated voterElection with related data
    return NextResponse.json({
      success: true,
      data: updatedVoterElection,
      message: "VoterElection successfully updated"
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      console.error("Validation Error:", error.errors);
      return NextResponse.json(
        { 
          success: false,
          error: "Validation Error",
          details: error.errors.map((e) => e.message)
        },
        { status: 400 }
      );
    }

    console.error("Internal server error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: error.message || "An unexpected error occurred"
      },
      { status: 500 }
    );
  }
}