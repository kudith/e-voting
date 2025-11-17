import { PrismaClient } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        throw new Error("Autentikasi gagal: " + JSON.stringify(user));
    }

    let dbUser = await prisma.voter.findUnique({
        where: { kindeId: user.id }
    });

    if (!dbUser) {
        dbUser = await prisma.voter.create({
            data: {
                kindeId: user.id,
                nim: "", // Default kosong, bisa diperbarui nanti
                name: user.given_name ?? "",
                email: user.email ?? "",
                voted: false,
                votes: []
            }
        });
    }

    return NextResponse.redirect("http://localhost:3000");
}
