import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeElectionData, deepSanitize } from "@/lib/sanitize";

export async function GET() {
  try {
    console.log("\n[Elections API] Fetching all elections...");

    const elections = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        totalVotes: true,
        candidates: {
          select: {
            id: true,
            name: true,
            photo: true,
            voteCount: true,
          },
        },
      },
    });

    if (!elections || elections.length === 0) {
      console.log("[Elections API] No elections found");
      return NextResponse.json(
        { error: "No elections found" },
        { status: 404 }
      );
    }

    console.log(`[Elections API] Found ${elections.length} elections`);

    const currentDate = new Date();

    // Auto-update status based on dates
    const formattedElections = await Promise.all(
      elections.map(async (election) => {
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);

        let actualStatus = election.status;

        if (currentDate < startDate) {
          actualStatus = "upcoming";
        } else if (currentDate >= startDate && currentDate <= endDate) {
          actualStatus = "ongoing";
        } else if (currentDate > endDate) {
          actualStatus = "completed";
        }

        // Update status if different
        if (actualStatus !== election.status) {
          console.log(
            `[Elections API] Updating "${election.title}" status: ${election.status} → ${actualStatus}`
          );

          try {
            await prisma.election.update({
              where: { id: election.id },
              data: { status: actualStatus },
            });
          } catch (updateError) {
            console.error(
              `[Elections API] Failed to update status:`,
              updateError.message
            );
          }
        }

        return {
          id: election.id,
          title: election.title,
          description: election.description,
          startDate: election.startDate,
          endDate: election.endDate,
          status: actualStatus,
          totalVotes: election.totalVotes,
          candidates: election.candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            photo: candidate.photo,
            voteCount: candidate.voteCount,
          })),
        };
      })
    );

    const statusCount = {
      upcoming: formattedElections.filter((e) => e.status === "upcoming")
        .length,
      ongoing: formattedElections.filter((e) => e.status === "ongoing").length,
      completed: formattedElections.filter((e) => e.status === "completed")
        .length,
    };

    // console.log("elections:", formattedElections);

    // Sanitize all election data before sending to client
    const sanitizedElections = formattedElections.map(election => ({
      ...sanitizeElectionData(election),
      candidates: election.candidates.map(candidate => deepSanitize(candidate))
    }));

    return NextResponse.json(sanitizedElections, { 
      status: 200,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      }
    });
  } catch (error) {
    console.error("[Elections API] Error:", error.message);
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
