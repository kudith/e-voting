"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/validations/CandidateSchema";
import { motion } from "framer-motion";
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
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CandidatesForm({
  isOpen,
  onClose,
  onSave,
  candidate,
  elections,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      photo: "",
      vision: "",
      mission: "",
      shortBio: "",
      electionId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        reset({
          name: candidate.name || "",
          photo: candidate.photo || "",
          vision: candidate.vision || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
          electionId: candidate.election ? String(candidate.election.id) : "",
        });
      } else {
        reset();
      }
    }
  }, [isOpen, candidate, reset]);

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-screen-lg w-full p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <DialogHeader className="px-8 pt-8">
            <DialogTitle className="text-2xl font-bold">
              {candidate ? "Edit Kandidat" : "Tambah Kandidat"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {candidate
                ? "Perbarui informasi kandidat pada formulir di bawah ini."
                : "Isi detail untuk menambahkan kandidat baru ke sistem."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name">Nama *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Masukkan nama kandidat"
                  className={cn(
                    "transition-colors",
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

          
              {/* Photo Field */}
              <div className="grid gap-2">
                <Label htmlFor="photo">URL Foto *</Label>
                <Input
                  id="photo"
                  {...register("photo")}
                  placeholder="Masukkan URL foto kandidat"
                  className={cn(
                    "transition-colors",
                    errors.photo &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.photo && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.photo.message}
                  </p>
                )}
              </div>

              {/* Vision Field */}
              <div className="grid gap-2">
                <Label htmlFor="vision">Visi *</Label>
                <Input
                  id="vision"
                  {...register("vision")}
                  placeholder="Masukkan visi kandidat"
                  className={cn(
                    "transition-colors",
                    errors.vision &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.vision && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.vision.message}
                  </p>
                )}
              </div>

              {/* Mission Field */}
              <div className="grid gap-2">
                <Label htmlFor="mission">Misi *</Label>
                <Input
                  id="mission"
                  {...register("mission")}
                  placeholder="Masukkan misi kandidat"
                  className={cn(
                    "transition-colors",
                    errors.mission &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.mission && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.mission.message}
                  </p>
                )}
              </div>

              {/* Short Bio Field */}
              <div className="grid gap-2">
                <Label htmlFor="shortBio">Bio Singkat *</Label>
                <Input
                  id="shortBio"
                  {...register("shortBio")}
                  placeholder="Masukkan bio singkat kandidat"
                  className={cn(
                    "transition-colors",
                    errors.shortBio &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.shortBio && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.shortBio.message}
                  </p>
                )}
              </div>

              {/* Election ID Field */}
              <div className="grid gap-2">
                <Label htmlFor="electionId">Pemilihan *</Label>
                <Select
                  value={watch("electionId")}
                  onValueChange={(value) => setValue("electionId", value)}
                >
                  <SelectTrigger
                    id="electionId"
                    className={cn(
                      "transition-colors",
                      errors.electionId &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <SelectValue placeholder="Pilih pemilihan" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections && elections.length > 0 ? (
                      elections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        Tidak ada pemilihan tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.electionId && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.electionId.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="px-8 pb-8 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">
                {candidate ? "Perbarui Kandidat" : "Buat Kandidat"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
