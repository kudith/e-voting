import { z } from "zod";

export const voterSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  nim: z.string().min(1, "NIM is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
  phone: z.string().min(1, "Phone is required"),
  status: z.string().min(1, "Status is required"),
});