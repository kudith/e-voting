import { z } from "zod";

export const candidateSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi." }),
  photo: z.string().url({ message: "URL foto tidak valid." }),
  vision: z.string().min(1, { message: "Visi wajib diisi." }),
  mission: z.string().min(1, { message: "Misi wajib diisi." }),
  shortBio: z.string().min(1, { message: "Bio singkat wajib diisi." }),
  electionId: z.string().min(1, { message: "Pemilihan wajib dipilih." }),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
