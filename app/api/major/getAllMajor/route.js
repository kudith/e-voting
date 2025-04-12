import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      include: { faculty: true },
    });

    return NextResponse.json(majors, { status: 200 });
  } catch (error) {
    console.error("Error fetching majors:", error);
    return NextResponse.json({ error: "Gagal mengambil data jurusan" }, { status: 500 });
  }
}