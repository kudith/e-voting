import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// Zod schema untuk validasi input
const candidateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  photo: z.string().url("Invalid photo URL"),
  vision: z.string().min(10, "Vision must be at least 10 characters"),
  mission: z.string().min(10, "Mission must be at least 10 characters"),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
  electionId: z.string().min(1, "Election ID is required"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = candidateSchema.parse(body);

    // Validasi keberadaan election
    const election = await prisma.election.findUnique({ where: { id: data.electionId } });
    if (!election) {
      return NextResponse.json({ error: "Election not found." }, { status: 404 });
    }
    
    // membaut candidate baru
const createCandidate = async (candidateData) => {
  try {
    const response = await fetch("/api/candidate/createCandidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create candidate");
    }

    const result = await response.json();
    console.log("Candidate created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};
    // Validasi apakah kandidat sudah terdaftar di pemilu yang sama
    const existingCandidateInElection = await prisma.candidate.findFirst({
      where: {
        name: data.name,
        electionId: data.electionId,
      },
    });

    if (existingCandidateInElection) {
      return NextResponse.json(
        { error: "Candidate with the same name is already registered in this election." },
        { status: 400 }
      );
    }

    // Validasi apakah kandidat sudah terdaftar di pemilu lain
    const existingCandidateInOtherElection = await prisma.candidate.findFirst({
      where: {
        name: data.name,
        electionId: { not: data.electionId },
      },
    });

    if (existingCandidateInOtherElection) {
      return NextResponse.json(
        { error: "Candidate is already registered in another election." },
        { status: 400 }
      );
    }

    console.log("Creating a new candidate with data:", data);

    // Buat kandidat baru
    const newCandidate = await prisma.candidate.create({
      data: {
        name: data.name,
        photo: data.photo,
        vision: data.vision,
        mission: data.mission,
        shortBio: data.shortBio,
        electionId: data.electionId,
      },
    });

    console.log("Candidate created successfully:", newCandidate);

    return NextResponse.json(
      { message: "Candidate created successfully", candidate: newCandidate },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Tangani error validasi Zod
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR CREATING CANDIDATE]", err);

    // Tangani error Prisma
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "A unique constraint violation occurred. Candidate might already exist." },
        { status: 400 }
      );
    }

    // Tangani error lainnya
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}