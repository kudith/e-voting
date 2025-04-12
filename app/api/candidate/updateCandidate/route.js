import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema untuk validasi input
const updateCandidateSchema = z.object({
  id: z.string().min(1, "Candidate ID is required"),
  name: z.string().optional(),
  photo: z.string().url("Invalid photo URL").optional(),
  vision: z.string().min(10, "Vision must be at least 10 characters").optional(),
  mission: z.string().min(10, "Mission must be at least 10 characters").optional(),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters").optional(),
});

export async function PATCH(req) {
  try {
    const body = await req.json();
    const data = updateCandidateSchema.parse(body);

    // Validasi keberadaan kandidat
    const candidate = await prisma.candidate.findUnique({ where: { id: data.id } });
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    console.log(`Updating candidate with ID: ${data.id}`);

    // Perbarui kandidat
    const updatedCandidate = await prisma.candidate.update({
      where: { id: data.id },
      data: {
        name: data.name || candidate.name,
        photo: data.photo || candidate.photo,
        vision: data.vision || candidate.vision,
        mission: data.mission || candidate.mission,
        shortBio: data.shortBio || candidate.shortBio,
      },
    });

    console.log("Successfully updated candidate:", updatedCandidate);

    // Kembalikan respons sukses
    return NextResponse.json(
      { message: "Candidate updated successfully.", candidate: updatedCandidate },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR UPDATING CANDIDATE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}