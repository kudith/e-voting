import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama fakultas wajib diisi" }, { status: 400 });
    }

    const faculty = await prisma.faculty.create({
      data: { name },
    });

    return NextResponse.json(faculty, { status: 201 });
  } catch (error) {
    console.error("Error creating faculty:", error);
    return NextResponse.json({ error: "Gagal membuat fakultas" }, { status: 500 });
  }
}