import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Voter election ID is required" },
        { status: 400 }
      );
    }

    // Ambil data voter election sebelum dihapus untuk mendapatkan nama voter
    const voterElection = await prisma.voterElection.findUnique({
      where: { id },
      include: {
        voter: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!voterElection) {
      return NextResponse.json(
        { error: "Voter election not found" },
        { status: 404 }
      );
    }

    // Hapus voter election
    await prisma.voterElection.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Voter election deleted successfully",
      voterName: voterElection.voter.name
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting voter election:", error);
    return NextResponse.json(
      { error: "Failed to delete voter election" },
      { status: 500 }
    );
  }
} 