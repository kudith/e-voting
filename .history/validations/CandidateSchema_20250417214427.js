import { z } from "zod";

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
});
