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
import { XCircle, User, Image, Eye, Target, Info, Gavel } from "lucide-react";
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
                {candidate ? "Edit Kandidat" : "Tambah Kandidat"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {candidate
                  ? "Perbarui informasi kandidat di bawah ini."
                  : "Isi detail kandidat baru di bawah ini."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nama <span className="text-destructive">*</span>
                  </Label>
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
                <div className="space-y-2">
                  <Label htmlFor="photo" className="flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    URL Foto <span className="text-destructive">*</span>
                  </Label>
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
                <div className="space-y-2">
                  <Label htmlFor="vision" className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    Visi <span className="text-destructive">*</span>
                  </Label>
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
                <div className="space-y-2">
                  <Label
                    htmlFor="mission"
                    className="flex items-center gap-1.5"
                  >
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Misi <span className="text-destructive">*</span>
                  </Label>
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
                <div className="space-y-2">
                  <Label
                    htmlFor="shortBio"
                    className="flex items-center gap-1.5"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Bio Singkat <span className="text-destructive">*</span>
                  </Label>
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
                <div className="space-y-2">
                  <Label
                    htmlFor="electionId"
                    className="flex items-center gap-1.5"
                  >
                    <Gavel className="h-4 w-4 text-muted-foreground" />{" "}
                    {/* Ganti ikon di sini */}
                    Pemilihan <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("electionId")}
                    onValueChange={(value) =>
                      setValue("electionId", value, { shouldValidate: true })
                    }
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
                {candidate ? "Perbarui Kandidat" : "Tambah Kandidat"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
