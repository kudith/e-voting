"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { candidateSchema, CandidateFormData } from "@/validation/candidateSchema";
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
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CandidateFormData) => void;
  candidate?: Partial<CandidateFormData> & { election?: { id: string } };
  elections: { id: string; title: string }[];
};

export default function CandidatesForm({ isOpen, onClose, onSave, candidate, elections }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      photo: "",
      vision: "",
      mission: "",
      shortBio: "",
      electionId: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: candidate?.name || "",
        photo: candidate?.photo || "",
        vision: candidate?.vision || "",
        mission: candidate?.mission || "",
        shortBio: candidate?.shortBio || "",
        electionId: candidate?.election?.id || "",
        status: candidate?.status || "active",
      });
    }
  }, [isOpen, candidate, reset]);

  const onSubmit = (data: CandidateFormData) => {
    onSave(data);
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Nama", placeholder: "Masukkan nama kandidat" },
                { name: "photo", label: "URL Foto", placeholder: "Masukkan URL foto kandidat" },
                { name: "vision", label: "Visi", placeholder: "Masukkan visi kandidat" },
                { name: "mission", label: "Misi", placeholder: "Masukkan misi kandidat" },
                { name: "shortBio", label: "Bio Singkat", placeholder: "Masukkan bio singkat kandidat" },
              ].map((field) => (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={field.name}>{field.label} *</Label>
                  <Input
                    id={field.name}
                    {...register(field.name as keyof CandidateFormData)}
                    placeholder={field.placeholder}
                    className={cn(errors[field.name as keyof CandidateFormData] && "border-red-500")}
                  />
                  {errors[field.name as keyof CandidateFormData] && (
                    <p className="text-sm text-red-500">
                      {errors[field.name as keyof CandidateFormData]?.message as string}
                    </p>
                  )}
                </div>
              ))}

              {/* Pemilihan */}
              <div className="grid gap-2">
                <Label htmlFor="electionId">Pemilihan *</Label>
                <Select
                  value={elections.find((e) => e.id === candidate?.election?.id)?.id}
                  onValueChange={(value) => setValue("electionId", value)}
                >
                  <SelectTrigger id="electionId" className={cn("w-full", errors.electionId && "border-red-500")}>
                    <SelectValue placeholder="Pilih pemilihan" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.length > 0 ? (
                      elections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>Tidak ada pemilihan tersedia</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.electionId && <p className="text-sm text-red-500">{errors.electionId.message}</p>}
              </div>
            </div>

            <DialogFooter className="px-8 pb-8 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">{candidate ? "Perbarui Kandidat" : "Buat Kandidat"}</Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
