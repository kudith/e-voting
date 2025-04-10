import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Validasi input
        if (!id) {
            console.error("Validation Error: ID is required");
            return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
        }

        console.log("Deleting voter with ID:", id);

        // Menghapus data voter dari database
        const deletedVoter = await prisma.voter.delete({
            where: { id },
        });

        console.log("Voter deleted successfully:", deletedVoter);
        return NextResponse.json({ message: "Voter berhasil dihapus" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting voter:", error);

        // Jika voter tidak ditemukan
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Voter tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}