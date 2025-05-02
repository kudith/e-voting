import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        console.log("Fetching all elections...");

        // Ambil semua data election dari database
        const elections = await prisma.election.findMany();

        // Jika tidak ada election ditemukan
        if (!elections || elections.length === 0) {
            console.warn("No elections found in the database.");
            return NextResponse.json(
                { error: "No elections found." },
                { status: 404 }
            );
        }

        console.log("Elections data retrieved successfully:", elections);

        // Format respons
        const formattedElections = elections.map((election) => ({
            id: election.id,
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            createdAt: election.createdAt,
            updatedAt: election.updatedAt,
        }));

        return NextResponse.json(formattedElections, { status: 200 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}