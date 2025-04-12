import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema untuk validasi input
const electionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = electionSchema.parse(body);

    // Validasi apakah tanggal mulai lebih awal dari tanggal akhir
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "Start date must be earlier than end date." },
        { status: 400 }
      );
    }

    console.log("Creating a new election with data:", data);

    // Buat pemilu baru
    const newElection = await prisma.election.create({
      data: {
        title: data.title,
        description: data.description,
        startDate,
        endDate,
      },
    });

    console.log("Election created successfully:", newElection);

    return NextResponse.json(
      { message: "Election created successfully", election: newElection },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR CREATING ELECTION]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}