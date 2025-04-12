import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      include: { majors: true },
    });

    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return NextResponse.json({ error: "Gagal mengambil data fakultas" }, { status: 500 });
  }
}