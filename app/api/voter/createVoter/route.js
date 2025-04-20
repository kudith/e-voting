import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Zod schema for input validation
const voterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^(0|\+62)\d{9,13}$/, "Phone must start with 0 or +62 and have 10-15 digits")
    .transform(val => val.startsWith('0') ? '+62' + val.slice(1) : val),
  facultyId: z.string().min(1, "Faculty ID is required"),
  majorId: z.string().min(1, "Major ID is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  status: z.enum(["active", "inactive"]),
});

// Helper function to generate voter code
async function generateVoterCode(faculty, major) {
  const count = await prisma.voter.count({
    where: { facultyId: faculty.id, majorId: major.id },
  });

  const uniqueNumber = (count + 1).toString().padStart(4, "0");
  const facultyAbbr = faculty.name.substring(0, 3).toUpperCase();
  const majorAbbr = major.name.substring(0, 3).toUpperCase();
  return `${facultyAbbr}-${majorAbbr}-${uniqueNumber}`;
}

// Main POST handler
export async function POST(req) {
  try {
    const body = await req.json();
    const data = voterSchema.parse(body);

    // Validate faculty and major existence
    const faculty = await prisma.faculty.findUnique({ where: { id: data.facultyId } });
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found." }, { status: 400 });
    }

    const major = await prisma.major.findUnique({ where: { id: data.majorId } });
    if (!major) {
      return NextResponse.json({ error: "Major not found." }, { status: 400 });
    }

    if (major.facultyId !== faculty.id) {
      return NextResponse.json(
        { error: "Major does not belong to the specified faculty." },
        { status: 400 }
      );
    }

    // Generate unique voter code
    const voterCode = await generateVoterCode(faculty, major);

    // Create user in Kinde with modified approach to avoid conflicts
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
          // We'll add phone identity after user creation to avoid conflicts
          {
            type: "username",
            details: { username: voterCode },
          },
        ],
      }),
    });

    if (!kindeRes.ok) {
      const errorText = await kindeRes.text();
      console.error("[KINDE ERROR]:", errorText);
      
      // Try to parse the error as JSON to extract specific error codes
      let kindeError = null;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors && errorJson.errors.length > 0) {
          kindeError = errorJson.errors[0].code;
          console.error("[KINDE ERROR DETAILS]:", JSON.stringify(errorJson.errors, null, 2));
        }
      } catch (e) {
        // If parsing fails, just use the raw error text
        kindeError = errorText;
      }
      
      // Handle specific Kinde errors
      if (kindeError === "USER_ALREADY_EXISTS") {
        // Cek apakah user sudah ada di database kita
        const existingVoter = await prisma.voter.findUnique({
          where: { email: data.email }
        });

        if (existingVoter) {
          return NextResponse.json(
            { 
              error: "Email sudah terdaftar dalam sistem. Silakan gunakan email lain.",
              kindeError: kindeError
            },
            { status: 409 }
          );
        } else {
          // Coba pengecekan email dan nomor telepon secara manual
          try {
            // Cek email
            const emailCheckRes = await fetch(`${KINDE_API_URL}/api/v1/users?email=${encodeURIComponent(data.email)}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${KINDE_API_KEY}`,
              },
            });
            
            const emailExists = emailCheckRes.ok && 
              (await emailCheckRes.json()).users?.length > 0;
            
            // Cek nomor telepon (hapus prefix +62 untuk perbandingan)
            const phone = data.phone.replace(/^\+62/, '');
            const phoneCheckRes = await fetch(`${KINDE_API_URL}/api/v1/users`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${KINDE_API_KEY}`,
              },
            });
            
            let phoneExists = false;
            if (phoneCheckRes.ok) {
              const users = (await phoneCheckRes.json()).users || [];
              phoneExists = users.some(user => 
                user.phone && user.phone.replace(/^\+62/, '') === phone
              );
            }
            
            if (emailExists) {
              return NextResponse.json({
                error: "Email sudah terdaftar dalam sistem. Silakan gunakan email lain.",
                detail: "Terdeteksi email yang sama di sistem"
              }, { status: 409 });
            }
            
            if (phoneExists) {
              return NextResponse.json({
                error: "Nomor telepon sudah terdaftar dalam sistem. Silakan gunakan nomor telepon lain.",
                detail: "Terdeteksi nomor telepon yang sama di sistem"
              }, { status: 409 });
            }
          } catch (checkError) {
            console.error("[CHECK ERROR]:", checkError);
          }
          
          // Jika tidak ada di database kita, berarti ada masalah dengan Kinde
          console.error("[KINDE CONFLICT]: User exists in Kinde but not in our database", {
            email: data.email,
            phone: data.phone
          });
          
          return NextResponse.json(
            { 
              error: "Terjadi konflik dengan sistem autentikasi. Silakan coba dengan email dan nomor telepon yang berbeda.",
              detail: "Sistem mendeteksi data serupa yang sudah terdaftar",
              kindeError: kindeError
            },
            { status: 409 }
          );
        }
      }
      
      return NextResponse.json(
        { 
          error: "Gagal membuat user di sistem autentikasi. Silakan coba lagi.",
          kindeError: kindeError
        },
        { status: 500 }
      );
    }

    const kindeUser = await kindeRes.json();

    // Save voter to database
    await prisma.voter.create({
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
      },
    });

    // Professional response
    return NextResponse.json(
      { message: "Voter created successfully" },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Handle validation errors
      console.error("[VALIDATION ERROR]:", err.errors);
      return NextResponse.json(
        { errors: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("[ERROR CREATING VOTER]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}