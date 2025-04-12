import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, facultyId } = await req.json();

    if (!name || !facultyId) {
      return NextResponse.json({ error: "Nama jurusan dan ID fakultas wajib diisi" }, { status: 400 });
    }

    const major = await prisma.major.create({
      data: { name, facultyId },
    });

    return NextResponse.json(major, { status: 201 });
  } catch (error) {
    console.error("Error creating major:", error);
    return NextResponse.json({ error: "Gagal membuat jurusan" }, { status: 500 });
  }
}