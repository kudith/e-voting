import { NextResponse } from "next/server";
import { z } from "zod";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";


dotenv.config();

// Zod schema untuk validasi input - Semua field optional kecuali yang wajib
const socialMediaSchema = z.object({
    twitter: z.string().optional().or(z.literal("")).refine(
        (val) => !val || val === "" || z.string().url().safeParse(val).success,
        { message: "Invalid Twitter URL" }
    ),
    facebook: z.string().optional().or(z.literal("")).refine(
        (val) => !val || val === "" || z.string().url().safeParse(val).success,
        { message: "Invalid Facebook URL" }
    ),
    instagram: z.string().optional().or(z.literal("")).refine(
        (val) => !val || val === "" || z.string().url().safeParse(val).success,
        { message: "Invalid Instagram URL" }
    ),
    linkedin: z.string().optional().or(z.literal("")).refine(
        (val) => !val || val === "" || z.string().url().safeParse(val).success,
        { message: "Invalid LinkedIn URL" }
    ),
    website: z.string().optional().or(z.literal("")).refine(
        (val) => !val || val === "" || z.string().url().safeParse(val).success,
        { message: "Invalid Website URL" }
    ),
});

const educationSchema = z.object({
    degree: z.string().min(3),
    institution: z.string().min(3),
    year: z.string().min(4).max(4),
});

const experienceSchema = z.object({
    position: z.string().min(3),
    organization: z.string().min(3),
    period: z.string().min(7), // Format: "YYYY-YYYY"
});

const achievementSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional().nullable(),
    year: z.string().min(4).max(4).optional().nullable(),
});

const programSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
});

const statsSchema = z.object({
    experience: z.number().min(0).max(100),
    leadership: z.number().min(0).max(100),
    innovation: z.number().min(0).max(100),
    publicSupport: z.number().min(0).max(100),
});

const candidateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    photo: z.string().url("Invalid photo URL"),
    vision: z.string().min(10, "Vision must be at least 10 characters"),
    mission: z.string().min(10, "Mission must be at least 10 characters"),
    shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
    electionId: z.string().min(1, "Election ID is required"),
    // Field optional - tidak wajib diisi
    details: z.string().optional().or(z.literal("")),
    socialMedia: socialMediaSchema.optional(),
    education: z.array(educationSchema).optional().default([]),
    experience: z.array(experienceSchema).optional().default([]),
    achievements: z.array(achievementSchema).optional().default([]),
    programs: z.array(programSchema).optional().default([]),
    stats: statsSchema.optional(),
});

export async function POST(req) {
    try {
        const body = await req.json();
        const data = candidateSchema.parse(body);

        // Validasi keberadaan election
        const election = await prisma.election.findUnique({
            where: { id: data.electionId },
        });
        if (!election) {
            return NextResponse.json(
                { error: "Election not found." },
                { status: 404 }
            );
        }

        // Validasi apakah kandidat sudah terdaftar di pemilu yang sama
        const existingCandidateInElection = await prisma.candidate.findFirst({
            where: {
                name: data.name,
                electionId: data.electionId,
            },
        });
        if (existingCandidateInElection) {
            return NextResponse.json(
                {
                    error: "Candidate with the same name is already registered in this election.",
                },
                { status: 400 }
            );
        }

        console.log("Creating candidate with data:", JSON.stringify(data, null, 2));

        // Buat kandidat baru dengan data terkait
        const newCandidate = await prisma.candidate.create({
            data: {
                name: data.name,
                photo: data.photo,
                vision: data.vision,
                mission: data.mission,
                shortBio: data.shortBio,
                details: data.details || "",
                election: {
                    connect: { id: data.electionId }
                },
                socialMedia: data.socialMedia && Object.values(data.socialMedia).some(v => v && v !== "") ? {
                    create: data.socialMedia
                } : undefined,
                education: data.education && data.education.length > 0 ? {
                    create: data.education
                } : undefined,
                experience: data.experience && data.experience.length > 0 ? {
                    create: data.experience
                } : undefined,
                achievements: data.achievements && data.achievements.length > 0 ? {
                    create: data.achievements
                } : undefined,
                programs: data.programs && data.programs.length > 0 ? {
                    create: data.programs
                } : undefined,
                stats: data.stats ? {
                    create: data.stats
                } : undefined,
            },
            include: {
                socialMedia: true,
                education: true,
                experience: true,
                achievements: true,
                programs: true,
                stats: true,
            }
        });

        console.log("New candidate created successfully:", newCandidate.id, newCandidate.name);
        console.log("Photo URL:", newCandidate.photo);

        // Respons sukses yang profesional
        return NextResponse.json(
            { 
                message: "Candidate created successfully",
                candidate: {
                    id: newCandidate.id,
                    name: newCandidate.name,
                    photo: newCandidate.photo,
                    vision: newCandidate.vision,
                    mission: newCandidate.mission,
                    shortBio: newCandidate.shortBio,
                    details: newCandidate.details,
                    socialMedia: newCandidate.socialMedia,
                    education: newCandidate.education,
                    experience: newCandidate.experience,
                    achievements: newCandidate.achievements,
                    programs: newCandidate.programs,
                    stats: newCandidate.stats,
                }
            },
            { status: 201 }
        );
    } catch (err) {
        if (err instanceof z.ZodError) {
            // Tangani error validasi Zod
            console.error("Validation Error:", err.errors);
            return NextResponse.json(
                { errors: err.errors.map((e) => e.message) },
                { status: 400 }
            );
        }

        console.error("[ERROR CREATING CANDIDATE]", err);

        // Tangani error Prisma
        if (err.code === "P2002") {
            return NextResponse.json(
                {
                    error: "A unique constraint violation occurred. Candidate might already exist.",
                },
                { status: 400 }
            );
        }

        // Tangani error lainnya
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}