import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function DELETE(req) {
    try {
        // Ambil parameter `id` dari query string
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Validasi jika `id` tidak diberikan
        if (!id) {
            return NextResponse.json(
                { error: "Election ID is required." },
                { status: 400 }
            );
        }

        console.log(`Deleting election with ID: ${id}`);

        // Hapus semua kandidat yang terkait dengan electionId
        const deletedCandidates = await prisma.candidate.deleteMany({
            where: { electionId: id },
        });

        console.log(`Deleted ${deletedCandidates.count} candidates associated with election ID: ${id}`);

        // Hapus election berdasarkan `id`
        const deletedElection = await prisma.election.delete({
            where: { id },
        });

        console.log("Election deleted successfully:", deletedElection);

        // Kembalikan respons sukses
        return NextResponse.json(
            {
                message: "Election and associated candidates deleted successfully.",
                election: deletedElection,
                deletedCandidatesCount: deletedCandidates.count,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("An error occurred while deleting the election:", error);

        // Tangani error jika election tidak ditemukan
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Election not found." },
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