import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No candidate IDs provided." }, { status: 400 });
    }

    // Delete all related records first
    await prisma.socialMedia.deleteMany({ where: { candidateId: { in: ids } } });
    await prisma.education.deleteMany({ where: { candidateId: { in: ids } } });
    await prisma.experience.deleteMany({ where: { candidateId: { in: ids } } });
    await prisma.achievement.deleteMany({ where: { candidateId: { in: ids } } });
    await prisma.program.deleteMany({ where: { candidateId: { in: ids } } });
    await prisma.candidateStats.deleteMany({ where: { candidateId: { in: ids } } });

    // Delete candidates in bulk
    const result = await prisma.candidate.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error("Bulk delete candidates error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
