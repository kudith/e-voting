import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Zod schema
const voterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\+\d{1,3}\d{9,12}$/, "Phone must include country code, e.g., +628123456789"),
  facultyId: z.string().min(1, "Faculty ID required"),
  majorId: z.string().min(1, "Major ID required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  status: z.enum(["active", "inactive"]),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = voterSchema.parse(body);

    // Validate existence of faculty and major
    const faculty = await prisma.faculty.findUnique({ where: { id: data.facultyId } });
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found." }, { status: 400 });
    }

    const major = await prisma.major.findUnique({ where: { id: data.majorId } });
    if (!major) {
      return NextResponse.json({ error: "Major not found." }, { status: 400 });
    }

    if (major.facultyId !== faculty.id) {
      return NextResponse.json({ error: "Major does not belong to the specified faculty." }, { status: 400 });
    }

    // Generate unique voter code
    const count = await prisma.voter.count({
      where: { facultyId: data.facultyId, majorId: data.majorId },
    });

    const uniqueNumber = (count + 1).toString().padStart(4, "0");
    const facultyAbbr = faculty.name.substring(0, 3).toUpperCase();
    const majorAbbr = major.name.substring(0, 3).toUpperCase();
    const voterCode = `${facultyAbbr}-${majorAbbr}-${uniqueNumber}`;

    // Create user in Kinde
    const kindeRes = await fetch(`${KINDE_API_URL}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KINDE_API_KEY}`,
      },
      body: JSON.stringify({
        profile: {
          given_name: data.name,
        },
        identities: [
          {
            type: "email",
            is_verified: true,
            details: { email: data.email },
          },
          {
            type: "phone",
            is_verified: false,
            details: {
              phone: data.phone,
              phone_country_id: "id",
            },
          },
          {
            type: "username",
            details: { username: voterCode },
          },
        ],
      }),
    });

    if (!kindeRes.ok) {
      const errorText = await kindeRes.text();
      return NextResponse.json({ error: "Failed to create Kinde user", detail: errorText }, { status: 500 });
    }

    const kindeUser = await kindeRes.json();

    // Save to DB
    const newVoter = await prisma.voter.create({
      data: {
        kindeId: kindeUser.id,
        voterCode,
        name: data.name,
        email: data.email,
        phone: data.phone,
        facultyId: data.facultyId,
        majorId: data.majorId,
        year: data.year,
        status: data.status,
        voted: false,
      },
    });

    return NextResponse.json(
      { message: "Voter created successfully", voter: newVoter },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }

    console.error("[ERROR CREATING VOTER]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
