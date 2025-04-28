import { z } from "zod";

// Individual field schemas
const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(100, "Title must be at most 100 characters");

const descriptionSchema = z
  .string()
  .min(10, "Description must be at least 10 characters")
  .max(500, "Description must be at most 500 characters");

// Update to accept any valid date string format
const startDateSchema = z
  .string()
  .min(1, "Tanggal mulai wajib diisi")
  .refine((date) => !isNaN(new Date(date).getTime()), "Tanggal mulai tidak valid");

// Update to accept any valid date string format
const endDateSchema = z
  .string()
  .min(1, "Tanggal selesai wajib diisi")
  .refine((date) => !isNaN(new Date(date).getTime()), "Tanggal selesai tidak valid");

// Updated to match database values
const statusSchema = z.enum(["ongoing", "completed", "upcoming"], {
  errorMap: () => ({ message: "Status harus 'ongoing', 'completed', atau 'upcoming'" }),
});

export const electionSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    startDate: startDateSchema,
    endDate: endDateSchema,
    status: statusSchema,
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "Tanggal & waktu selesai harus setelah tanggal & waktu mulai",
    path: ["endDate"],
  });
