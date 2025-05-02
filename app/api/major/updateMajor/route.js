import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function PUT(req) {
  try {
    const { id, name, facultyId } = await req.json();

    if (!id || !name || !facultyId) {
      return NextResponse.json({ error: "ID, nama jurusan, dan ID fakultas wajib diisi" }, { status: 400 });
    }

    const updatedMajor = await prisma.major.update({
      where: { id },
      data: { name, facultyId },
    });

    return NextResponse.json(updatedMajor, { status: 200 });
  } catch (error) {
    console.error("Error updating major:", error);
    return NextResponse.json({ error: "Gagal memperbarui jurusan" }, { status: 500 });
  }
}