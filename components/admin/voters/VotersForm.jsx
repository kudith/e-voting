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
import { LoadingModal } from "@/components/ui/loading-modal";
import { User, Mail, Building2, GraduationCap, Calendar, Phone, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoterForm({ isOpen, onClose, onSave, voter }) {
  const [formData, setFormData] = useState({
    fullName: "",
    npm: "",
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
      console.log("Form opened, voter data:", voter);
      fetchFaculties();
      if (voter) {
        // Extract faculty and major names from the voter object
        const facultyName = voter.faculty?.name;
        const majorName = voter.major?.name;
        
        console.log("Extracted facultyName:", facultyName);
        console.log("Extracted majorName:", majorName);
        
        setFormData({
          fullName: voter.name,
          npm: voter.npm || "",
          email: voter.email,
          facultyId: "", // Will be set when faculties are loaded
          majorId: "", // Will be set when faculties are loaded
          year: voter.year,
          phone: voter.phone || "",
          status: voter.status || "active",
        });
      } else {
        setFormData({
          fullName: "",
          npm: "",
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
  }, [isOpen, voter]);

  // Ambil data fakultas dari API
  const fetchFaculties = async () => {
    try {
      console.log("Fetching faculties data...");
      const response = await fetch("/api/faculty/getAllFaculties");
      if (!response.ok) {
        throw new Error("Gagal mengambil data fakultas");
      }
      const data = await response.json();
      console.log("Fetched faculties data:", data);
      setFaculties(data);
      
      // If we're editing a voter, find the faculty and major IDs by name
      if (voter) {
        const facultyName = voter.faculty?.name;
        const majorName = voter.major?.name;
        
        console.log("Looking for faculty with name:", facultyName);
        console.log("Looking for major with name:", majorName);
        
        if (facultyName) {
          const selectedFaculty = data.find(
            (faculty) => faculty.name === facultyName
          );
          console.log("Found faculty by name:", selectedFaculty);
          
          if (selectedFaculty) {
            // Set the faculty ID in the form data
            setFormData(prev => ({
              ...prev,
              facultyId: selectedFaculty.id
            }));
            
            // Set the majors for the selected faculty
            setMajors(selectedFaculty.majors || []);
            
            // If we also have the major name, find its ID
            if (majorName && selectedFaculty.majors) {
              const selectedMajor = selectedFaculty.majors.find(
                (major) => major.name === majorName
              );
              console.log("Found major by name:", selectedMajor);
              
              if (selectedMajor) {
                // Set the major ID in the form data
                setFormData(prev => ({
                  ...prev,
                  majorId: selectedMajor.id
                }));
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error mengambil data fakultas:", error);
      toast("Kesalahan", { description: "Gagal memuat data fakultas." });
    }
  };

  // Update form data when faculties and majors are loaded
  useEffect(() => {
    if (voter && faculties.length > 0) {
      console.log("Faculties loaded, updating form data for voter:", voter);
      
      // Find faculty and major by name
      const facultyName = voter.faculty?.name;
      const majorName = voter.major?.name;
      
      console.log("Looking for faculty with name:", facultyName);
      console.log("Looking for major with name:", majorName);
      
      if (facultyName) {
        const selectedFaculty = faculties.find(
          (faculty) => faculty.name === facultyName
        );
        console.log("Found faculty by name:", selectedFaculty);
        
        if (selectedFaculty) {
          // Set the faculty ID in the form data
          setFormData(prev => {
            console.log("Previous form data:", prev);
            const newData = {
              ...prev,
              facultyId: selectedFaculty.id
            };
            console.log("New form data with faculty ID:", newData);
            return newData;
          });
          
          // Set the majors for the selected faculty
          setMajors(selectedFaculty.majors || []);
          
          // If we also have the major name, find its ID
          if (majorName && selectedFaculty.majors) {
            const selectedMajor = selectedFaculty.majors.find(
              (major) => major.name === majorName
            );
            console.log("Found major by name:", selectedMajor);
            
            if (selectedMajor) {
              // Set the major ID in the form data
              setFormData(prev => {
                console.log("Previous form data:", prev);
                const newData = {
                  ...prev,
                  majorId: selectedMajor.id
                };
                console.log("New form data with major ID:", newData);
                return newData;
              });
            }
          }
        }
      }
    }
  }, [faculties, voter]);

  // Tangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validasi real-time
    validateField(name, value);
  };

  // Fungsi untuk validasi field tertentu
  const validateField = (name, value) => {
    try {
      // Buat objek dengan field yang sedang divalidasi
      const fieldToValidate = { [name]: value };
      
      // Gunakan Zod untuk memvalidasi field tertentu
      voterSchema.pick({ [name]: true }).parse(fieldToValidate);
      
      // Jika validasi berhasil, hapus error untuk field tersebut
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Ambil pesan error dari Zod
        const errorMessage = error.errors[0]?.message || "Invalid input";
        
        // Set error untuk field tersebut
        setErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      }
    }
  };

  // Tangani perubahan fakultas
  const handleFacultyChange = (facultyId) => {
    console.log("Faculty changed to:", facultyId);
    setFormData((prev) => ({ ...prev, facultyId, majorId: "" }));
    const selectedFaculty = faculties.find(
      (faculty) => faculty.id === facultyId
    );
    console.log("Selected faculty for majors:", selectedFaculty);
    setMajors(selectedFaculty ? selectedFaculty.majors : []);
    
    // Validasi real-time
    validateField("facultyId", facultyId);
  };

  // Tangani perubahan jurusan
  const handleMajorChange = (majorId) => {
    setFormData((prev) => ({ ...prev, majorId }));
    
    // Validasi real-time
    validateField("majorId", majorId);
  };

  // Tangani perubahan status
  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
    
    // Validasi real-time
    validateField("status", status);
  };

  // Tangani perubahan tahun
  const handleYearChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, year: value }));
    
    // Validasi real-time
    validateField("year", value);
  };

  // Tangani perubahan nomor telepon
  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Hapus semua karakter non-digit
    value = value.replace(/\D/g, '');

    // Pastikan nomor dimulai dengan 0
    if (value && !value.startsWith('0')) {
      value = '0' + value;
    }

    // Batasi panjang nomor
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setFormData((prev) => ({ ...prev, phone: value }));
    
    // Validasi real-time
    validateField("phone", value);
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
        npm: formData.npm,
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
        
        // Check for specific error types
        if (errorData.error === "Failed to create Kinde user") {
          // Check if the error is related to user already existing
          if (errorData.kindeError && errorData.kindeError.includes("USER_ALREADY_EXISTS")) {
            throw new Error("Email sudah terdaftar dalam sistem. Silakan gunakan email lain.");
          }
        }
        
        throw new Error(errorData.error || "Gagal menyimpan data pemilih");
      }
  
      const result = await response.json();
      
      // Reset form dan tutup modal
      resetForm();
      onSave(result || payload); // Kirim payload ke callback onSave
      onClose();
      
      // Show success toast after operation completes
      toast.success("Berhasil", {
        description: voter
          ? "Pemilih berhasil diperbarui."
          : "Pemilih berhasil ditambahkan.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map error Zod ke field form
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        // Reset form data kecuali untuk field yang error
        setFormData(prev => ({
          ...prev,
          fullName: fieldErrors.fullName ? "" : prev.fullName,
          email: fieldErrors.email ? "" : prev.email,
          facultyId: fieldErrors.facultyId ? "" : prev.facultyId,
          majorId: fieldErrors.majorId ? "" : prev.majorId,
          year: fieldErrors.year ? "" : prev.year,
          phone: fieldErrors.phone ? "" : prev.phone,
          status: fieldErrors.status ? "active" : prev.status,
        }));
      } else {
        console.error("Kesalahan menyimpan pemilih:", error); // Log kesalahan fetch
        toast.error("Kesalahan", {
          description:
            error.message || "Gagal menyimpan pemilih. Silakan coba lagi.",
        });
        // Reset form jika terjadi error server
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk mereset form ke nilai awal
  const resetForm = () => {
    setFormData({
      fullName: "",
      npm: "",
      email: "",
      facultyId: "",
      majorId: "",
      year: "",
      phone: "",
      status: "active",
    });
    setErrors({});
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border shadow-lg">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-background px-6 py-5 border-b">
                  <DialogHeader className="mb-0">
                    <DialogTitle className="text-xl font-semibold">
                      {voter ? "Edit Pemilih" : "Tambah Pemilih Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {voter
                        ? "Perbarui informasi pemilih di bawah ini."
                        : "Isi informasi pemilih baru di bawah ini."}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Form content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    {/* NPM */}
                    <div className="space-y-2">
                      <Label htmlFor="npm" className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        NPM <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="npm"
                          name="npm"
                          value={formData.npm}
                          onChange={handleInputChange}
                          placeholder="Masukkan NPM (misal: 237006081)"
                          className={cn(
                            "transition-colors",
                            errors.npm && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.npm && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.npm}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Nama Lengkap <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap"
                          className={cn(
                            "transition-colors",
                            errors.fullName && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Masukkan alamat email"
                          className={cn(
                            "transition-colors",
                            errors.email && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Fakultas */}
                    <div className="space-y-2">
                      <Label htmlFor="facultyId" className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Fakultas <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Select
                          value={formData.facultyId}
                          onValueChange={handleFacultyChange}
                        >
                          <SelectTrigger 
                            id="facultyId"
                            className={cn(
                              "transition-colors",
                              errors.facultyId && "border-destructive focus-visible:ring-destructive"
                            )}
                          >
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
                      </div>
                      {errors.facultyId && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.facultyId}
                        </p>
                      )}
                    </div>

                    {/* Jurusan */}
                    <div className="space-y-2">
                      <Label htmlFor="majorId" className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        Jurusan <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Select
                          value={formData.majorId}
                          onValueChange={handleMajorChange}
                          disabled={!majors.length}
                        >
                          <SelectTrigger 
                            id="majorId"
                            className={cn(
                              "transition-colors",
                              errors.majorId && "border-destructive focus-visible:ring-destructive"
                            )}
                          >
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
                      </div>
                      {errors.majorId && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.majorId}
                        </p>
                      )}
                    </div>

                    {/* Angkatan */}
                    <div className="space-y-2">
                      <Label htmlFor="year" className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Angkatan <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleYearChange}
                          placeholder="Masukkan tahun angkatan"
                          className={cn(
                            "transition-colors",
                            errors.year && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.year && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.year}
                        </p>
                      )}
                    </div>

                    {/* No Telepon */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        No Telepon <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="Contoh: 081234567890"
                          className={cn(
                            "transition-colors",
                            errors.phone && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status" className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        Status <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Select
                          value={formData.status}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger 
                            id="status"
                            className={cn(
                              "transition-colors",
                              errors.status && "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.status && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t flex flex-col sm:flex-row gap-2 md:gap-4 sm:gap-0 sm:justify-end bg-muted/50">
                  <Button 
                    variant="outline" 
                    onClick={onClose} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200"
                  >
                    {voter ? "Simpan" : "Tambah"}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Loading Modal */}
      <LoadingModal 
        isOpen={isSubmitting} 
        message={voter 
          ? "Memperbarui data pemilih..." 
          : "Menambahkan pemilih baru..."} 
      />
    </>
  );
}