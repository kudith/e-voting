import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const body = await req.json(); // Ambil body dari request
    const { ids } = body; // Ambil array `ids` dari body

    // Validasi jika `ids` tidak diberikan atau kosong
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Election IDs are required." },
        { status: 400 }
      );
    }

    console.log(`Deleting elections with IDs: ${ids.join(", ")}`);

    // Hapus semua kandidat yang terkait dengan electionId dalam array `ids`
    const deletedCandidates = await prisma.candidate.deleteMany({
      where: { electionId: { in: ids } },
    });

    console.log(
      `Deleted ${
        deletedCandidates.count
      } candidates associated with election IDs: ${ids.join(", ")}`
    );

    // Hapus semua election berdasarkan array `ids`
    const deletedElections = await prisma.election.deleteMany({
      where: { id: { in: ids } },
    });

    console.log(
      `Deleted ${deletedElections.count} elections with IDs: ${ids.join(", ")}`
    );

    // Kembalikan respons sukses
    return NextResponse.json(
      {
        message: "Elections and associated candidates deleted successfully.",
        deletedElectionsCount: deletedElections.count,
        deletedCandidatesCount: deletedCandidates.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred while deleting elections:", error);

    // Tangani error lainnya
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
