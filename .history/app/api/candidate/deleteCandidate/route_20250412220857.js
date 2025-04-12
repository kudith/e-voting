import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        // Ambil parameter `id` dari query string
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Validasi jika `id` tidak diberikan
        if (!id) {
            return NextResponse.json(
                { error: "Candidate ID is required." },
                { status: 400 }
            );
        }

        console.log(`Deleting candidate with ID: ${id}`);

        // Hapus kandidat berdasarkan `id`
        const deletedCandidate = await prisma.candidate.delete({
            where: { id },
        });

        console.log("Successfully deleted candidate:", deletedCandidate);

        // Kembalikan respons sukses
        return NextResponse.json(
            { message: "Candidate deleted successfully.", candidate: deletedCandidate },
            { status: 200 }
        );
    } catch (error) {
        console.error("An error occurred while deleting the candidate:", error);

        // Tangani error jika kandidat tidak ditemukan
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Candidate not found." },
                { status: 404 }
            );
        }

        // Tangani error lainnya
        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}