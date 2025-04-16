import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get facultyId from query parameters
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get("facultyId");

    if (!facultyId) {
      return NextResponse.json(
        { error: "Faculty ID is required" },
        { status: 400 }
      );
    }

    // Fetch majors for the given faculty
    const majors = await prisma.major.findMany({
      where: {
        facultyId: facultyId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(majors, { status: 200 });
  } catch (error) {
    console.error("Error fetching majors by faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch majors" },
      { status: 500 }
    );
  }
} 