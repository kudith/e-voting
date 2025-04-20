import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID fakultas wajib diisi" }, { status: 400 });
    }

    await prisma.faculty.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Fakultas berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return NextResponse.json({ error: "Gagal menghapus fakultas" }, { status: 500 });
  }
}