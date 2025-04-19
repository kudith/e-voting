"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { electionSchema } from "@/validations/ElectionSchme";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  XCircle,
  Clipboard,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fungsi untuk memformat tanggal ke format yyyy-mm-dd
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ElectionForm({ isOpen, onClose, onSave, election }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(electionSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
    },
  });
const handleSaveElection = (formData) => {
  if (selectedElection) {
    // Edit pemilihan yang ada
    updateElection({ id: selectedElection.id, ...formData });
  } else {
    // Buat pemilihan baru
    createElection(formData);
  }
};
useEffect(() => {
  if (isOpen) {
    if (election) {
      // Isi form dengan data pemilihan yang dipilih untuk diedit
      reset({
        title: election.title || "",
        description: election.description || "",
        startDate: election.startDate || "", // Gunakan data tanggal mulai dari election
        endDate: election.endDate || "", // Gunakan data tanggal selesai dari election
        status: election.status || "active", // Gunakan status dari election
      });
    } else {
      // Kosongkan form untuk membuat pemilihan baru
      reset({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "active",
      });
    }
  }
}, [isOpen, election, reset]);
  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-lg">
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
                {election ? "Edit Pemilihan" : "Tambah Pemilihan Baru"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {election
                  ? "Perbarui informasi pemilihan di bawah ini."
                  : "Isi informasi pemilihan baru di bawah ini."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4 text-muted-foreground" />
                    Judul <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Masukkan judul pemilihan"
                    className={cn(
                      "transition-colors",
                      errors.title &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.title && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-1.5"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Deskripsi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="description"
                    {...register("description")}
                    placeholder="Masukkan deskripsi pemilihan"
                    className={cn(
                      "transition-colors",
                      errors.description &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.description && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Start Date Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="startDate"
                    className="flex items-center gap-1.5"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Tanggal Mulai <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className={cn(
                      "transition-colors",
                      errors.startDate &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* End Date Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="endDate"
                    className="flex items-center gap-1.5"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Tanggal Selesai <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className={cn(
                      "transition-colors",
                      errors.endDate &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="status"
                    {...register("status")}
                    className={cn(
                      "w-full transition-colors border rounded-md p-2", // Tambahkan `w-full` agar panjangnya sama
                      errors.status &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                  {errors.status && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/50 border-t mx-6 flex flex-col sm:flex-row gap-2 md:gap-2 sm:gap-0 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {election ? "Perbarui Pemilihan" : "Tambah Pemilihan"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
