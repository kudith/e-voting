import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("electionId"); // Ambil electionId dari query parameter

    if (electionId) {
      // Mendapatkan statistik untuk pemilu tertentu
      console.log(`Fetching statistics for electionId: ${electionId}`);

      const statistics = await prisma.electionStatistics.findUnique({
        where: { electionId },
        include: {
          election: {
            select: {
              id: true,
              title: true,
              description: true,
              startDate: true,
              endDate: true,
              status: true,
              totalVotes: true,
            },
          },
        },
      });

      if (!statistics) {
        console.warn(`Statistics not found for electionId: ${electionId}`);
        return NextResponse.json(
          { error: "Statistics not found for the given election." },
          { status: 404 }
        );
      }

      return NextResponse.json(statistics, { status: 200 });
    } else {
      // Mendapatkan statistik untuk semua pemilu
      console.log("Fetching statistics for all elections...");

      const allStatistics = await prisma.electionStatistics.findMany({
        include: {
          election: {
            select: {
              id: true,
              title: true,
              description: true,
              startDate: true,
              endDate: true,
              status: true,
              totalVotes: true,
            },
          },
        },
      });

      if (!allStatistics || allStatistics.length === 0) {
        console.warn("No election statistics found.");
        return NextResponse.json(
          { error: "No election statistics found." },
          { status: 404 }
        );
      }

      return NextResponse.json(allStatistics, { status: 200 });
    }
  } catch (error) {
    console.error("An error occurred while fetching election statistics:", error);

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}