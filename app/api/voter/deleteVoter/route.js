import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Validasi input
        if (!id) {
            console.error("Validation Error: ID is required");
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        console.log("Fetching voter with ID:", id);

        // Ambil data voter dari database untuk mendapatkan kindeId
        const voter = await prisma.voter.findUnique({
            where: { id },
        });

        if (!voter) {
            console.error("Voter not found with ID:", id);
            return NextResponse.json({ error: "Voter not found" }, { status: 404 });
        }

        console.log("Deleting user in Kinde with kindeId:", voter.kindeId);

        // Hapus user dari Kinde
        const kindeResponse = await fetch(`${KINDE_API_URL}/api/v1/user?id=${voter.kindeId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${KINDE_API_KEY}`,
            },
        });

        if (!kindeResponse.ok) {
            const error = await kindeResponse.text();
            console.error("Error deleting user in Kinde:", error);
            return NextResponse.json(
                { error: "Failed to delete user in Kinde: " + error },
                { status: kindeResponse.status }
            );
        }

        console.log("User successfully deleted in Kinde with kindeId:", voter.kindeId);

        // Hapus voter dari database
        const deletedVoter = await prisma.voter.delete({
            where: { id },
        });

        console.log("Voter deleted successfully:", deletedVoter);
        return NextResponse.json({ message: "Voter successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting voter:", error);

        // Jika voter tidak ditemukan
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Voter not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}