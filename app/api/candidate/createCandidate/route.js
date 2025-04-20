import { NextResponse } from "next/server";
import { z } from "zod";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";


dotenv.config();

// Zod schema untuk validasi input
const socialMediaSchema = z.object({
    twitter: z.string().url().optional().nullable(),
    facebook: z.string().url().optional().nullable(),
    instagram: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    website: z.string().url().optional().nullable(),
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
    details: z.string().min(20, "Details must be at least 20 characters"),
    electionId: z.string().min(1, "Election ID is required"),
    socialMedia: socialMediaSchema.optional(),
    education: z.array(educationSchema).min(1, "At least one education entry is required"),
    experience: z.array(experienceSchema).min(1, "At least one experience entry is required"),
    achievements: z.array(achievementSchema).optional(),
    programs: z.array(programSchema).min(1, "At least one program entry is required"),
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
                details: data.details,
                electionId: data.electionId,
                socialMedia: data.socialMedia ? {
                    create: data.socialMedia
                } : undefined,
                education: {
                    create: data.education
                },
                experience: {
                    create: data.experience
                },
                achievements: data.achievements ? {
                    create: data.achievements
                } : undefined,
                programs: {
                    create: data.programs
                },
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