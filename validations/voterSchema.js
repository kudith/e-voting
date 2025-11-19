import { z } from "zod";

export const voterSchema = z.object({
  npm: z
  .string()
  .min(1, "NPM wajib diisi")
  .regex(/^\d{9}$/, "NPM harus berupa 9 digit angka"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi").max(100, "Nama lengkap maksimal 100 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  facultyId: z.string().min(1, "Fakultas wajib dipilih"),
  majorId: z.string().min(1, "Jurusan wajib dipilih"),
  year: z
    .string()
    .min(1, "Tahun wajib diisi")
    .regex(/^\d{4}$/, "Tahun harus berupa angka 4 digit (contoh: 2025)"),
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^(0|\+62)\d{9,13}$/, "Nomor telepon harus dimulai dengan 0 atau +62 dan memiliki 10-15 digit")
    .transform(val => val.startsWith('0') ? '+62' + val.slice(1) : val),
  status: z.string().min(1, "Status wajib dipilih"),
});