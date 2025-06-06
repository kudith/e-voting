"use client";

import { useState, useEffect } from "react";
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
import { candidateSchema } from "@/validations/CandidateSchema"; // Import validation schema
import { z } from "zod"; // Import Zod for error handling

export default function CandidatesForm({
  isOpen,
  onClose,
  onSave,
  candidate,
  elections,
}) {
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    vision: "",
    mission: "",
    shortBio: "",
    electionId: "",
  });

  const [errors, setErrors] = useState({}); // State to store validation errors

  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        setFormData({
          name: candidate.name || "",
          photo: candidate.photo || "",
          vision: candidate.vision || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
          electionId: candidate.election ? String(candidate.election.id) : "",
        });
      } else {
        setFormData({
          name: "",
          photo: "",
          vision: "",
          mission: "",
          shortBio: "",
          electionId: "",
        });
      }
    }
  }, [isOpen, candidate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleElectionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      electionId: value,
    }));
  };

  const handleSave = () => {
    try {
      // Validate formData using the schema
      candidateSchema.parse(formData);
      setErrors({}); // Clear errors if validation passes
      onSave(formData); // Call the onSave function with valid data
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to a format suitable for the UI
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors); // Set validation errors
      }
    }
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
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama kandidat"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Photo Field */}
            <div className="grid gap-2">
              <Label htmlFor="photo">URL Foto *</Label>
              <Input
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="Masukkan URL foto kandidat"
              />
              {errors.photo && (
                <p className="text-red-500 text-sm">{errors.photo}</p>
              )}
            </div>

            {/* Vision Field */}
            <div className="grid gap-2">
              <Label htmlFor="vision">Visi *</Label>
              <Input
                id="vision"
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                placeholder="Masukkan visi kandidat"
              />
              {errors.vision && (
                <p className="text-red-500 text-sm">{errors.vision}</p>
              )}
            </div>

            {/* Mission Field */}
            <div className="grid gap-2">
              <Label htmlFor="mission">Misi *</Label>
              <Input
                id="mission"
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                placeholder="Masukkan misi kandidat"
              />
              {errors.mission && (
                <p className="text-red-500 text-sm">{errors.mission}</p>
              )}
            </div>

            {/* Short Bio Field */}
            <div className="grid gap-2">
              <Label htmlFor="shortBio">Bio Singkat *</Label>
              <Input
                id="shortBio"
                name="shortBio"
                value={formData.shortBio}
                onChange={handleInputChange}
                placeholder="Masukkan bio singkat kandidat"
              />
              {errors.shortBio && (
                <p className="text-red-500 text-sm">{errors.shortBio}</p>
              )}
            </div>

            {/* Election ID Field */}
            <div className="grid gap-2">
              <Label htmlFor="electionId">Pemilihan *</Label>
              <Select
                value={formData.electionId}
                onValueChange={handleElectionChange}
              >
                <SelectTrigger id="electionId" className="w-full">
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
                <p className="text-red-500 text-sm">{errors.electionId}</p>
              )}
            </div>
          </div>
          <DialogFooter className="px-8 pb-8 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              {candidate ? "Perbarui Kandidat" : "Buat Kandidat"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
