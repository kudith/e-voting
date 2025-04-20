import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

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
    if (data.startDate || data.endDate) {
      const startDate = data.startDate ? new Date(data.startDate) : new Date(election.startDate);
      const endDate = data.endDate ? new Date(data.endDate) : new Date(election.endDate);

      if (startDate >= endDate) {
        return NextResponse.json(
          { error: "Start date must be earlier than end date." },
          { status: 400 }
        );
      }
    }

    // Tentukan status pemilu berdasarkan tanggal baru (jika diperbarui)
    const currentDate = new Date();
    const startDate = data.startDate ? new Date(data.startDate) : new Date(election.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : new Date(election.endDate);

    let status = election.status; // Default ke status saat ini
    if (currentDate < startDate) {
      status = "upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "ongoing";
    } else if (currentDate > endDate) {
      status = "completed";
    }

    // Perbarui election
    await prisma.election.update({
      where: { id: data.id },
      data: {
        title: data.title || election.title,
        description: data.description || election.description,
        startDate: data.startDate ? new Date(data.startDate) : election.startDate,
        endDate: data.endDate ? new Date(data.endDate) : election.endDate,
        status, // Perbarui status berdasarkan tanggal
      },
    });

    console.log("Election updated successfully");

    // Respons sukses yang profesional
    return NextResponse.json(
      { message: "Election updated successfully." },
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

    console.error("[ERROR UPDATING ELECTION]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}