import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        console.log("Fetching all voters data...");

        // Fetch all voters with their faculty and major information
        const voters = await prisma.voter.findMany({
            include: {
                faculty: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                major: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        if (!voters || voters.length === 0) {
            console.warn("No voters found in the database.");
            return NextResponse.json(
                { error: "No voters found" },
                { status: 404 }
            );
        }

        console.log("Successfully retrieved all voters data.");
        return NextResponse.json(voters, { status: 200 });
    } catch (error) {
        console.error("An error occurred while fetching voters data:", error);

        // Return a detailed error response for debugging
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}