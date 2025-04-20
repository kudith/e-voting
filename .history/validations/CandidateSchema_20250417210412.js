import { z } from "zod";

export const candidateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama kandidat wajib diisi")
    .max(100, "Nama kandidat maksimal 100 karakter"),
  photo: z
    .string()
    .url("URL foto kandidat tidak valid")
    .min(1, "Foto kandidat wajib diunggah"),
  vision: z
    .string()
    .min(1, "Visi kandidat wajib diisi")
    .max(1000, "Visi kandidat maksimal 1000 karakter"),
  mission: z
    .string()
    .min(1, "Misi kandidat wajib diisi")
    .max(1000, "Misi kandidat maksimal 1000 karakter"),
  shortBio: z
    .string()
    .min(1, "Biografi singkat wajib diisi")
    .max(500, "Biografi singkat maksimal 500 karakter"),
  electionId: z.string().min(1, "Pemilu wajib dipilih"), // Hapus regex karena dropdown memastikan validitas
  status: z
    .string()
    .min(1, "Status wajib dipilih")
    .refine((status) => ["active", "inactive"].includes(status), {
      message: "Status harus berupa 'active' atau 'inactive'",
    }),
});
