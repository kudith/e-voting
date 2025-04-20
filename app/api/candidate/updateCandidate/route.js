import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod schema untuk validasi input
const updateCandidateSchema = z.object({
  id: z.string().min(1, "Candidate ID is required"),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  photo: z.string().url("Invalid photo URL").optional(),
  vision: z.string().min(10, "Vision must be at least 10 characters").optional(),
  mission: z.string().min(10, "Mission must be at least 10 characters").optional(),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters").optional(),
  electionId: z.string().optional(),
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

    // Jika `electionId` diberikan, validasi keberadaan election
    if (data.electionId) {
      const election = await prisma.election.findUnique({ where: { id: data.electionId } });
      if (!election) {
        return NextResponse.json({ error: "Election not found." }, { status: 404 });
      }

      // Validasi apakah kandidat sudah terdaftar di pemilu lain
      const existingCandidateInElection = await prisma.candidate.findFirst({
        where: {
          name: data.name || candidate.name,
          electionId: data.electionId,
          NOT: { id: data.id }, // Pastikan tidak memeriksa kandidat yang sedang diperbarui
        },
      });

      if (existingCandidateInElection) {
        return NextResponse.json(
          { error: "Candidate with the same name is already registered in this election." },
          { status: 400 }
        );
      }

      console.log(`Candidate will now participate in election with ID: ${data.electionId}`);
    }

    // Perbarui kandidat
    await prisma.candidate.update({
      where: { id: data.id },
      data: {
        name: data.name || candidate.name,
        photo: data.photo || candidate.photo,
        vision: data.vision || candidate.vision,
        mission: data.mission || candidate.mission,
        shortBio: data.shortBio || candidate.shortBio,
        electionId: data.electionId || candidate.electionId, // Update electionId jika diberikan
      },
    });

    console.log("Candidate updated successfully");

    // Respons sukses yang profesional
    return NextResponse.json(
      { message: "Candidate updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Tangani error validasi Zod
      console.error("Validation Error:", err.errors);
      return NextResponse.json(
        { errors: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("[ERROR UPDATING CANDIDATE]", err);

    // Tangani error Prisma
    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "Candidate not found or already deleted." },
        { status: 404 }
      );
    }

    // Tangani error lainnya
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}