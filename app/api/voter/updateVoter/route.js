import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Schema untuk update voter (semua optional, kecuali ID)
const updateVoterSchema = z.object({
  id: z.string().min(1, "Voter ID is required"),
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+\d{1,3}\d{9,12}$/, "Phone number must include country code (e.g., +628234567890)")
    .optional(),
  facultyId: z.string().optional(),
  majorId: z.string().optional(),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function PATCH(req) {
  try {
    const body = await req.json();
    const data = updateVoterSchema.parse(body);

    const existingVoter = await prisma.voter.findUnique({
      where: { id: data.id },
    });

    if (!existingVoter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    // Jika facultyId dan majorId diubah, pastikan valid
    if (data.facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: data.facultyId },
      });
      if (!faculty) {
        return NextResponse.json({ error: "Invalid facultyId" }, { status: 400 });
      }
    }

    if (data.majorId) {
      const major = await prisma.major.findUnique({
        where: { id: data.majorId },
      });
      if (!major) {
        return NextResponse.json({ error: "Invalid majorId" }, { status: 400 });
      }

      if (data.facultyId && major.facultyId !== data.facultyId) {
        return NextResponse.json({
          error: "The specified major does not belong to the given faculty",
        }, { status: 400 });
      }

      if (!data.facultyId && major.facultyId !== existingVoter.facultyId) {
        return NextResponse.json({
          error: "The specified major does not belong to the current faculty",
        }, { status: 400 });
      }
    }

    // Update data di Kinde jika ada perubahan pada name, email, phone, atau username
    if (data.name || data.email || data.phone) {
      const kindeUpdateData = {};
      if (data.name) kindeUpdateData.given_name = data.name;
      if (data.email) kindeUpdateData.email = data.email;
      if (data.phone) kindeUpdateData.phone = data.phone;

      const kindeRes = await fetch(`${KINDE_API_URL}/api/v1/user?id=${existingVoter.kindeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KINDE_API_KEY}`,
        },
        body: JSON.stringify(kindeUpdateData),
      });

      if (!kindeRes.ok) {
        const errorText = await kindeRes.text();
        return NextResponse.json(
          { error: "Failed to update Kinde user", detail: errorText },
          { status: 500 }
        );
      }
    }

    // Lakukan update di database lokal
    const updatedVoter = await prisma.voter.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        facultyId: data.facultyId,
        majorId: data.majorId,
        year: data.year,
        status: data.status,
      },
    });

    return NextResponse.json({
      message: "Voter updated successfully",
      voter: updatedVoter,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}