"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        setFormData({
          name: candidate.name || "",
          photo: candidate.photo || "",
          vision: candidate.vision || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
          electionId: candidate.election ? String(candidate.election.id) : "", // Safely access election.id
        });
      } else {
        setFormData({
          name: "",
          photo: "",
          vision: "",
          mission: "",
          shortBio: "",
          electionId: "", // Set electionId to an empty string
        });
      }
    }
  }, [isOpen, candidate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "electionId" ? String(value) : value, // Ensure electionId is a string
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <DialogHeader className="px-6 pt-6">
        <DialogTitle>
          {candidate ? "Edit Kandidat" : "Tambah Kandidat"}
        </DialogTitle>
        <DialogDescription>
          {candidate
            ? "Perbarui informasi kandidat."
            : "Isi formulir untuk menambahkan kandidat baru."}
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 py-4 grid gap-4">
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
        </div>

        {/* Election ID Field */}
        <div className="grid gap-2">
          <Label htmlFor="electionId">Pemilihan *</Label>
          <select
            id="electionId"
            name="electionId"
            value={formData.electionId}
            onChange={handleInputChange}
            className="border rounded-md p-2"
          >
            <option value="">Pilih pemilihan</option>
            {elections && elections.length > 0 ? (
              elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))
            ) : (
              <option disabled>Tidak ada pemilihan tersedia</option>
            )}
          </select>
        </div>
      </div>
      <DialogFooter className="px-6 pb-6">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={() => onSave(formData)}>
          {candidate ? "Perbarui Kandidat" : "Buat Kandidat"}
        </Button>
      </DialogFooter>
    </motion.div>
  </DialogContent>
</Dialog>
  );
}
