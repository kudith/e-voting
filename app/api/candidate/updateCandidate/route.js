import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Social media schema
const socialMediaSchema = z.object({
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  website: z.string().url("Invalid Website URL").optional().or(z.literal("")),
}).optional().nullable();

// Education schema
const educationSchema = z.array(
  z.object({
    id: z.string().optional(),
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    year: z.string().min(1, "Year is required"),
  })
).optional();

// Experience schema
const experienceSchema = z.array(
  z.object({
    id: z.string().optional(),
    position: z.string().min(1, "Position is required"),
    organization: z.string().min(1, "Organization is required"),
    period: z.string().min(1, "Period is required"),
  })
).optional();

// Achievement schema
const achievementSchema = z.array(
  z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().or(z.literal("")),
    year: z.string().optional().or(z.literal("")),
  })
).optional();

// Program schema
const programSchema = z.array(
  z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  })
).optional();

// Stats schema
const statsSchema = z.object({
  experience: z.number().min(0).max(100).default(0),
  leadership: z.number().min(0).max(100).default(0),
  innovation: z.number().min(0).max(100).default(0),
  publicSupport: z.number().min(0).max(100).default(0),
}).optional().nullable();

// Zod schema untuk validasi input
const updateCandidateSchema = z.object({
  id: z.string().min(1, "Candidate ID is required"),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  photo: z.string().url("Invalid photo URL").optional(),
  vision: z.string().min(10, "Vision must be at least 10 characters").optional(),
  mission: z.string().min(10, "Mission must be at least 10 characters").optional(),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters").optional(),
  electionId: z.string().optional(),
  
  // New detailed fields
  details: z.string().min(10, "Detailed biography must be at least 10 characters").optional().or(z.literal("")),
  socialMedia: socialMediaSchema,
  education: educationSchema,
  experience: experienceSchema,
  achievements: achievementSchema,
  programs: programSchema,
  stats: statsSchema,
});

export async function PATCH(req) {
  try {
    const body = await req.json();
    const data = updateCandidateSchema.parse(body);

    // Validasi keberadaan kandidat
    const candidate = await prisma.candidate.findUnique({ 
      where: { id: data.id },
      include: {
        socialMedia: true,
        education: true,
        experience: true,
        achievements: true,
        programs: true,
        stats: true,
      }
    });
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    console.log(`Updating candidate with ID: ${data.id}`);

    // Jika `electionId` diberikan, validasi keberadaan election
    if (data.electionId) {
      const election = await prisma.election.findUnique({ where: { id: data.electionId } });
      if (!election) {
        return NextResponse.json({ error: "Election not found." }, { status: 404 });
      }

      // Validasi apakah kandidat sudah terdaftar di pemilu lain
      const existingCandidateInElection = await prisma.candidate.findFirst({
        where: {
          name: data.name || candidate.name,
          electionId: data.electionId,
          NOT: { id: data.id }, // Pastikan tidak memeriksa kandidat yang sedang diperbarui
        },
      });

      if (existingCandidateInElection) {
        return NextResponse.json(
          { error: "Candidate with the same name is already registered in this election." },
          { status: 400 }
        );
      }

      console.log(`Candidate will now participate in election with ID: ${data.electionId}`);
    }

    // Prepare transaction for updating candidate and related data
    await prisma.$transaction(async (prisma) => {
      // Update candidate basic info
      await prisma.candidate.update({
        where: { id: data.id },
        data: {
          name: data.name || candidate.name,
          photo: data.photo || candidate.photo,
          vision: data.vision || candidate.vision,
          mission: data.mission || candidate.mission,
          shortBio: data.shortBio || candidate.shortBio,
          electionId: data.electionId || candidate.electionId,
          details: data.details || candidate.details || "",
        },
      });

      // Update social media
      if (data.socialMedia) {
        if (candidate.socialMedia) {
          await prisma.socialMedia.update({
            where: { candidateId: data.id },
            data: data.socialMedia,
          });
        } else {
          await prisma.socialMedia.create({
            data: {
              ...data.socialMedia,
              candidateId: data.id,
            },
          });
        }
      }

      // Update stats
      if (data.stats) {
        if (candidate.stats) {
          await prisma.candidateStats.update({
            where: { candidateId: data.id },
            data: data.stats,
          });
        } else {
          await prisma.candidateStats.create({
            data: {
              ...data.stats,
              candidateId: data.id,
            },
          });
        }
      }

      // Handle education updates
      if (data.education) {
        // Delete existing entries
        await prisma.education.deleteMany({
          where: { candidateId: data.id },
        });
        
        // Create new entries
        if (data.education.length > 0) {
          await prisma.education.createMany({
            data: data.education.map(item => ({
              ...item,
              candidateId: data.id,
            })),
          });
        }
      }

      // Handle experience updates
      if (data.experience) {
        // Delete existing entries
        await prisma.experience.deleteMany({
          where: { candidateId: data.id },
        });
        
        // Create new entries
        if (data.experience.length > 0) {
          await prisma.experience.createMany({
            data: data.experience.map(item => ({
              ...item,
              candidateId: data.id,
            })),
          });
        }
      }

      // Handle achievements updates
      if (data.achievements) {
        // Delete existing entries
        await prisma.achievement.deleteMany({
          where: { candidateId: data.id },
        });
        
        // Create new entries
        if (data.achievements.length > 0) {
          await prisma.achievement.createMany({
            data: data.achievements.map(item => ({
              ...item,
              candidateId: data.id,
            })),
          });
        }
      }

      // Handle programs updates
      if (data.programs) {
        // Delete existing entries
        await prisma.program.deleteMany({
          where: { candidateId: data.id },
        });
        
        // Create new entries
        if (data.programs.length > 0) {
          await prisma.program.createMany({
            data: data.programs.map(item => ({
              ...item,
              candidateId: data.id,
            })),
          });
        }
      }
    });

    console.log("Candidate updated successfully");

    // Respons sukses yang profesional
    return NextResponse.json(
      { message: "Candidate updated successfully." },
      { status: 200 }
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

    console.error("[ERROR UPDATING CANDIDATE]", err);

    // Tangani error Prisma
    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "Candidate not found or already deleted." },
        { status: 404 }
      );
    }

    // Tangani error lainnya
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}