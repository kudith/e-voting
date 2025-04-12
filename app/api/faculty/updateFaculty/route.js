import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: "ID dan nama fakultas wajib diisi" }, { status: 400 });
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedFaculty, { status: 200 });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json({ error: "Gagal memperbarui fakultas" }, { status: 500 });
  }
}