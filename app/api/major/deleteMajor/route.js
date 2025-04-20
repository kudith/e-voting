import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID jurusan wajib diisi" }, { status: 400 });
    }

    await prisma.major.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Jurusan berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting major:", error);
    return NextResponse.json({ error: "Gagal menghapus jurusan" }, { status: 500 });
  }
}