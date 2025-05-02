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

const startDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
  .refine((date) => !isNaN(new Date(date).getTime()), "Start date is invalid");

const endDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
  .refine((date) => !isNaN(new Date(date).getTime()), "End date is invalid");

const statusSchema = z.enum(["active", "inactive"], {
  errorMap: () => ({ message: "Status must be either 'active' or 'inactive'" }),
});

// Main schema composed of individual field schemas
export const electionSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    startDate: startDateSchema,
    endDate: endDateSchema,
    status: statusSchema,
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after or equal to the start date",
    path: ["endDate"], // Targeting the error on the `endDate` field
  });
