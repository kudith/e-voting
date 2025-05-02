import { z } from "zod";

// Social media schema
const socialMediaSchema = z.object({
  twitter: z.string().url("URL Twitter tidak valid").optional().or(z.literal("")),
  facebook: z.string().url("URL Facebook tidak valid").optional().or(z.literal("")),
  instagram: z.string().url("URL Instagram tidak valid").optional().or(z.literal("")),
  linkedin: z.string().url("URL LinkedIn tidak valid").optional().or(z.literal("")),
  website: z.string().url("URL Website tidak valid").optional().or(z.literal("")),
});

// Education schema
const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Gelar wajib diisi"),
  institution: z.string().min(1, "Institusi wajib diisi"),
  year: z.string().min(1, "Tahun wajib diisi"),
});

// Experience schema
const experienceSchema = z.object({
  id: z.string().optional(),
  position: z.string().min(1, "Posisi wajib diisi"),
  organization: z.string().min(1, "Organisasi wajib diisi"),
  period: z.string().min(1, "Periode wajib diisi"),
});

// Achievement schema
const achievementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
});

// Program schema
const programSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

// Stats schema
const statsSchema = z.object({
  experience: z.number().min(0).max(100).default(0),
  leadership: z.number().min(0).max(100).default(0),
  innovation: z.number().min(0).max(100).default(0),
  publicSupport: z.number().min(0).max(100).default(0),
});

export const candidateSchema = z.object({
  name: z
    .string()
    .min(3, "Nama kandidat harus memiliki minimal 3 karakter")
    .max(100, "Nama kandidat maksimal 100 karakter"),
  photo: z.string().url("URL foto tidak valid. Harus berupa URL yang valid."),
  vision: z
    .string()
    .min(10, "Visi harus memiliki minimal 10 karakter")
    .max(500, "Visi maksimal 500 karakter"),
  mission: z
    .string()
    .min(10, "Misi harus memiliki minimal 10 karakter")
    .max(500, "Misi maksimal 500 karakter"),
  shortBio: z
    .string()
    .min(10, "Bio singkat harus memiliki minimal 10 karakter")
    .max(300, "Bio singkat maksimal 300 karakter"),
  electionId: z.string().min(1, "Pemilihan wajib dipilih"),
  
  // New detailed fields
  details: z
    .string()
    .min(10, "Detail biografi harus memiliki minimal 10 karakter")
    .max(2000, "Detail biografi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  
  // Related models
  socialMedia: socialMediaSchema.optional().or(z.literal("")),
  education: z.array(educationSchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  achievements: z.array(achievementSchema).optional().default([]),
  programs: z.array(programSchema).optional().default([]),
  stats: statsSchema.optional().default({
    experience: 0,
    leadership: 0,
    innovation: 0,
    publicSupport: 0,
  }),
});
