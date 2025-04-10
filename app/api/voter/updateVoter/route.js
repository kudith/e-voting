import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Validasi input
        if (!id) {
            console.error("Validation Error: ID is required");
            return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
        }

        const body = await req.json();

        // Validasi data yang akan diupdate
        if (!body || Object.keys(body).length === 0) {
            console.error("Validation Error: No data provided for update");
            return NextResponse.json({ error: "Data untuk update wajib diisi" }, { status: 400 });
        }

        console.log("Updating voter with ID:", id);

        // Mengupdate data voter di database
        const updatedVoter = await prisma.voter.update({
            where: { id },
            data: body,
        });

        console.log("Voter updated successfully:", updatedVoter);
        return NextResponse.json({ message: "Voter berhasil diperbarui", voter: updatedVoter }, { status: 200 });
    } catch (error) {
        console.error("Error updating voter:", error);

        // Jika voter tidak ditemukan
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Voter tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}