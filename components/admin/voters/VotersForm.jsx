"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { voterSchema } from "@/validations/voterSchema";
import { z } from "zod";

export default function VoterForm({ isOpen, onClose, onSave, voter }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    facultyId: "",
    majorId: "",
    year: "",
    phone: "",
    status: "active",
  });

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data fakultas dan jurusan saat form dibuka
  useEffect(() => {
    if (isOpen) {
      fetchFaculties();
      if (voter) {
        setFormData({
          fullName: voter.name,
          email: voter.email,
          facultyId: voter.facultyId,
          majorId: voter.majorId,
          year: voter.year,
          phone: voter.phone || "",
          status: voter.status || "active",
        });
      } else {
        setFormData({
          fullName: "",
          email: "",
          facultyId: "",
          majorId: "",
          year: "",
          phone: "",
          status: "active",
        });
      }
      setErrors({});
    }
  }, [isOpen, voter, faculties]);

  // Ambil data fakultas dari API
  const fetchFaculties = async () => {
    try {
      const response = await fetch("/api/faculty/getAllFaculties");
      if (!response.ok) {
        throw new Error("Gagal mengambil data fakultas");
      }
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error mengambil data fakultas:", error);
      toast("Kesalahan", { description: "Gagal memuat data fakultas." });
    }
  };

  // Tangani perubahan fakultas dan perbarui jurusan
  const handleFacultyChange = (facultyId) => {
    setFormData((prev) => ({ ...prev, facultyId, majorId: "" }));
    const selectedFaculty = faculties.find(
      (faculty) => faculty.id === facultyId
    );
    setMajors(selectedFaculty ? selectedFaculty.majors : []);
  };

  // Tangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tangani pengiriman form
    const handleSubmit = async () => {
    try {
      console.log("Mengirim data form:", formData); // Log untuk debugging
  
      // Validasi data form menggunakan Zod
      voterSchema.parse(formData);
      setErrors({}); // Hapus error jika validasi berhasil
  
      setIsSubmitting(true);
  
      // Siapkan payload untuk API
      const payload = {
        name: formData.fullName,
        email: formData.email,
        facultyId: formData.facultyId,
        majorId: formData.majorId,
        year: formData.year,
        phone: formData.phone,
        status: formData.status,
      };
  
      // Jika edit mode (voter ada), gunakan PATCH
      const endpoint = voter
        ? `/api/voter/updateVoter`
        : `/api/voter/createVoter`;
      const method = voter ? "PATCH" : "POST";
  
      if (voter) {
        payload.id = voter.id; // Tambahkan ID voter untuk update
      }
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Kesalahan API:", errorData); // Log kesalahan API
        throw new Error(errorData.error || "Gagal menyimpan data pemilih");
      }
  
      toast.success("Berhasil", {
        description: voter
          ? "Pemilih berhasil diperbarui."
          : "Pemilih berhasil ditambahkan.",
      });
  
      // Reset form dan tutup modal
      resetForm();
      onSave(payload); // Kirim payload ke callback onSave
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map error Zod ke field form
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        console.error("Kesalahan menyimpan pemilih:", error); // Log kesalahan fetch
        toast.error("Kesalahan", {
          description:
            error.message || "Gagal menyimpan pemilih. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-screen-lg w-full p-0 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <DialogHeader className="px-8 pt-8">
                <DialogTitle className="text-2xl font-bold">
                  {voter ? "Edit Pemilih" : "Tambah Pemilih Baru"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {voter
                    ? "Perbarui informasi pemilih pada formulir di bawah ini."
                    : "Isi detail untuk menambahkan pemilih baru ke sistem."}
                </DialogDescription>
              </DialogHeader>
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facultyId">Fakultas *</Label>
                  <Select
                    value={formData.facultyId}
                    onValueChange={(value) => handleFacultyChange(value)}
                  >
                    <SelectTrigger id="facultyId">
                      <SelectValue placeholder="Pilih fakultas" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.facultyId && (
                    <p className="text-red-500 text-sm">{errors.facultyId}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="majorId">Jurusan *</Label>
                  <Select
                    value={formData.majorId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, majorId: value }))
                    }
                    disabled={!majors.length}
                  >
                    <SelectTrigger id="majorId">
                      <SelectValue placeholder="Pilih jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.majorId && (
                    <p className="text-red-500 text-sm">{errors.majorId}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Angkatan *</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Masukkan tahun angkatan"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm">{errors.year}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">No Telepon *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (value.startsWith("0")) {
                        value = "+62" + value.slice(1);
                      }

                      setFormData((prev) => ({ ...prev, phone: value }));
                    }}
                    placeholder="Contoh: 081234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status}</p>
                  )}
                </div>
              </div>
              <DialogFooter className="px-8 pb-8 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting
                    ? "Menyimpan..."
                    : voter
                    ? "Perbarui Pemilih"
                    : "Tambah Pemilih"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}