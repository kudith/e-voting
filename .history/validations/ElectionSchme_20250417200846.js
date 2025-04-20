import { z } from "zod";

export const electionSchema = z.object({
  title: z
    .string()
    .min(1, "Judul pemilu wajib diisi")
    .max(100, "Judul pemilu maksimal 100 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi pemilu wajib diisi")
    .max(500, "Deskripsi pemilu maksimal 500 karakter"),
  startDate: z
    .string()
    .min(1, "Tanggal mulai wajib diisi")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Tanggal mulai harus dalam format YYYY-MM-DD"
    ),
  endDate: z
    .string()
    .min(1, "Tanggal selesai wajib diisi")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Tanggal selesai harus dalam format YYYY-MM-DD"
    )
    .refine(
      (endDate, ctx) => {
        const startDate = ctx.parent.startDate; // Masalah terjadi di sini
        return new Date(endDate) >= new Date(startDate);
      },
      {
        message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
      }
    ),
  status: z
    .string()
    .min(1, "Status wajib dipilih")
    .refine((status) => ["active", "inactive"].includes(status), {
      message: "Status harus berupa 'active' atau 'inactive'",
    }),
});
