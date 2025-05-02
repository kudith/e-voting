import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const nim = searchParams.get("nim");

        // Validasi input
        if (!nim) {
            console.error("Validation Error: NIM is required");
            return NextResponse.json({ error: "NIM wajib diisi" }, { status: 400 });
        }

        console.log("Fetching voter data with NIM:", nim);

        // Mengambil data voter dari database
        const voter = await prisma.voter.findUnique({
            where: { nim },
        });

        if (!voter) {
            console.error("Voter not found with NIM:", nim);
            return NextResponse.json({ error: "Voter tidak ditemukan" }, { status: 404 });
        }

        console.log("Voter data retrieved successfully:", voter);
        return NextResponse.json(voter, { status: 200 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}