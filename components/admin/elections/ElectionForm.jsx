"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Fungsi untuk memformat tanggal ke format yyyy-mm-dd
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "yyyy-MM-dd");
  } catch (error) {
    return dateString;
  }
};

// Fungsi untuk memformat waktu ke format HH:mm
const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "HH:mm");
  } catch (error) {
    return "";
  }
};

// Fungsi untuk menggabungkan tanggal dan waktu
const combineDateAndTime = (dateString, timeString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (timeString) {
      const [hours, minutes] = timeString.split(":");
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
    }
    return date.toISOString();
  } catch (error) {
    return dateString;
  }
};

export default function ElectionForm({ isOpen, onClose, onSave, election, isSubmitting }) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(electionSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "ongoing",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (isOpen) {
      if (election) {
        // Isi form dengan data pemilihan yang dipilih untuk diedit
        const formattedStartDate = formatDate(election.startDate);
        const formattedEndDate = formatDate(election.endDate);
        const formattedStartTime = formatTime(election.startDate);
        const formattedEndTime = formatTime(election.endDate);
        
        reset({
          title: election.title || "",
          description: election.description || "",
          startDate: formattedStartDate || "",
          endDate: formattedEndDate || "",
          status: election.status || "ongoing",
        });
        
        setStartTime(formattedStartTime || "08:00");
        setEndTime(formattedEndTime || "17:00");
      } else {
        // Kosongkan form untuk membuat pemilihan baru
        reset({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "ongoing",
        });
        
        setStartTime("08:00");
        setEndTime("17:00");
      }
    }
  }, [isOpen, election, reset]);

  const onSubmit = (formData) => {
    // Gabungkan tanggal dan waktu sebelum menyimpan
    const combinedData = {
      ...formData,
      startDate: combineDateAndTime(formData.startDate, startTime),
      endDate: combineDateAndTime(formData.endDate, endTime),
    };
    onSave(combinedData);
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
                    Tanggal & Waktu Mulai <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
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
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn(
                        "transition-colors",
                        errors.startDate &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
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
                    Tanggal & Waktu Selesai <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
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
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={cn(
                        "transition-colors",
                        errors.endDate &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                
                {/* Validasi visual untuk pengingat durasi */}
                {startDate && endDate && startTime && endTime && (
                  <div className="md:col-span-2">
                    <div className={cn(
                      "text-xs p-3 rounded-md",
                      new Date(`${endDate}T${endTime}`) <= new Date(`${startDate}T${startTime}`) 
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    )}>
                      <div className="flex items-center gap-1.5">
                        {new Date(`${endDate}T${endTime}`) <= new Date(`${startDate}T${startTime}`) ? (
                          <>
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Perhatian:</span> Waktu selesai harus setelah waktu mulai
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-medium">Durasi Pemilihan:</span> 
                            {formatDate(startDate) === formatDate(endDate) 
                              ? `${formatDate(startDate)}, ${startTime} - ${endTime} WIB (${Math.round((new Date(`${endDate}T${endTime}`) - new Date(`${startDate}T${startTime}`)) / (1000 * 60 * 60))} jam)`
                              : `${formatDate(startDate)} ${startTime} WIB - ${formatDate(endDate)} ${endTime} WIB (${Math.round((new Date(`${endDate}T${endTime}`) - new Date(`${startDate}T${startTime}`)) / (1000 * 60 * 60 * 24))} hari)`}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/50 border-t mx-6 flex flex-col sm:flex-row gap-2 md:gap-2 sm:gap-0 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {election ? "Memperbarui..." : "Menambahkan..."}
                  </>
                ) : (
                  <>
                    {election ? "Perbarui Pemilihan" : "Tambah Pemilihan"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
