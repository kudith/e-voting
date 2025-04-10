import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Fetching all voters data");

        // Mengambil semua data voter dari database
        const voters = await prisma.voter.findMany();

        if (!voters || voters.length === 0) {
            console.error("No voters found");
            return NextResponse.json({ error: "Tidak ada voter yang ditemukan" }, { status: 404 });
        }

        console.log("All voters data retrieved successfully");
        return NextResponse.json(voters, { status: 200 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}