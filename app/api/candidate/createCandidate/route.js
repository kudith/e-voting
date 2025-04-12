import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// Zod schema
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
      return NextResponse.json({ error: "Election not found." }, { status: 400 });
    }

    // Validasi apakah kandidat sudah terdaftar di pemilu lain
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        name: data.name,
        electionId: { not: data.electionId }, // Kandidat dengan nama yang sama di pemilu lain
      },
    });

    if (existingCandidate) {
      return NextResponse.json(
        { error: "Candidate is already registered in another election." },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { message: "Candidate created successfully", candidate: newCandidate },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR CREATING CANDIDATE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}