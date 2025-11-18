import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        // Mulai transaksi database
        const result = await prisma.$transaction(async (tx) => {
            // Ambil data voter beserta relasi dari database
            const voter = await tx.voter.findUnique({
                where: { id },
                include: {
                    voterElections: true,
                    faculty: true,
                    major: true
                }
            });

            if (!voter) {
                throw new Error("Voter not found");
            }

            const kindeId = voter.kindeId;
            
            // Cek apakah voter punya vote di VoterElection yang sudah memilih
            const votedElections = voter.voterElections.filter(ve => ve.hasVoted);
            
            if (votedElections.length > 0) {
                console.log(`Voter ${voter.voterCode} has voted in ${votedElections.length} election(s)`);
                // TODO: Jika ada model Vote terpisah dengan relasi ke kandidat, 
                // kurangi vote count kandidat di sini
            }

            // Hapus voter elections dalam satu operasi
            await tx.voterElection.deleteMany({
                where: { voterId: voter.id }
            });

            // Hapus voter
            await tx.voter.delete({
                where: { id }
            });

            return { kindeId, name: voter.name };
        });

        // Hapus user dari Kinde
        const kindeResponse = await fetch(`${KINDE_API_URL}/api/v1/user?id=${result.kindeId}`, {
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

        console.log("User and related data successfully deleted");
        return NextResponse.json({ 
            message: "Voter and all related data successfully deleted",
            voterDeleted: true,
            voterName: result.name
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting voter:", error);

        // Jika voter tidak ditemukan
        if (error.message === "Voter not found") {
            return NextResponse.json({ error: "Voter not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            error: "Internal server error",
            message: error.message 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}