import { z } from "zod";

export const candidateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama kandidat wajib diisi")
    .max(100, "Nama kandidat maksimal 100 karakter"),
  photo: z.string().url("URL foto tidak valid"),
  vision: z
    .string()
    .min(1, "Visi wajib diisi")
    .max(500, "Visi maksimal 500 karakter"),
  mission: z
    .string()
    .min(1, "Misi wajib diisi")
    .max(500, "Misi maksimal 500 karakter"),
  shortBio: z
    .string()
    .min(1, "Bio singkat wajib diisi")
    .max(300, "Bio singkat maksimal 300 karakter"),
  electionId: z.string().min(1, "Pemilihan wajib dipilih"),
});
