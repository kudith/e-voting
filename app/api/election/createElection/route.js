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

    // Tentukan status pemilu berdasarkan tanggal
    const currentDate = new Date();
    let status = "upcoming";
    if (currentDate >= startDate && currentDate <= endDate) {
      status = "ongoing";
    } else if (currentDate > endDate) {
      status = "completed";
    }

    console.log("Creating a new election with data:", data);

    // Buat pemilu baru
    await prisma.election.create({
      data: {
        title: data.title,
        description: data.description,
        startDate,
        endDate,
        status, // Status pemilu (upcoming, ongoing, completed)
        totalVotes: 0, // Default total suara adalah 0
      },
    });

    console.log("Election created successfully");

    // Respons sukses yang profesional
    return NextResponse.json(
      { message: "Election created successfully" },
      { status: 201 }
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

    console.error("[ERROR CREATING ELECTION]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}