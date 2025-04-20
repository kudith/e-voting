import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty voter election IDs" },
        { status: 400 }
      );
    }

    // Hapus multiple voter elections
    const deletedVoterElections = await prisma.voterElection.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json({
      message: "Voter elections deleted successfully",
      deletedCount: deletedVoterElections.count
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting voter elections:", error);
    return NextResponse.json(
      { error: "Failed to delete voter elections" },
      { status: 500 }
    );
  }
} 