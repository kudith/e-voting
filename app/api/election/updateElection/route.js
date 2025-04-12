import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema untuk validasi input
const updateElectionSchema = z.object({
  id: z.string().min(1, "Election ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }).optional(),
});

export async function PATCH(req) {
  try {
    const body = await req.json();
    const data = updateElectionSchema.parse(body);

    // Validasi keberadaan election
    const election = await prisma.election.findUnique({ where: { id: data.id } });
    if (!election) {
      return NextResponse.json({ error: "Election not found." }, { status: 404 });
    }

    console.log(`Updating election with ID: ${data.id}`);

    // Validasi jika tanggal mulai dan akhir diberikan
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: "Start date must be earlier than end date." },
          { status: 400 }
        );
      }
    }

    // Perbarui election
    const updatedElection = await prisma.election.update({
      where: { id: data.id },
      data: {
        title: data.title || election.title,
        description: data.description || election.description,
        startDate: data.startDate ? new Date(data.startDate) : election.startDate,
        endDate: data.endDate ? new Date(data.endDate) : election.endDate,
      },
    });

    console.log("Election updated successfully:", updatedElection);

    // Kembalikan respons sukses
    return NextResponse.json(
      { message: "Election updated successfully.", election: updatedElection },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR UPDATING ELECTION]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}