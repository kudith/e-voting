"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { voterSchema } from "@/validations/voterSchema";
import { z } from "zod"; // Tambahkan impor ini

export default function VoterForm({ isOpen, onClose, onSave, voter }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nim: "",
    faculty: "",
    department: "",
    year: "",
    phone: "",
    status: "aktif",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or voter changes
  useEffect(() => {
    if (isOpen) {
      if (voter) {
        setFormData({
          fullName: voter.name,
          email: voter.email,
          nim: voter.nim,
          faculty: voter.fakultas,
          department: voter.jurusan,
          year: voter.angkatan,
          phone: voter.phone || "",
          status: voter.status || "aktif",
        });
      } else {
        setFormData({
          fullName: "",
          email: "",
          nim: "",
          faculty: "",
          department: "",
          year: "",
          phone: "",
          status: "aktif",
        });
      }
      setErrors({});
    }
  }, [isOpen, voter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data using Zod
      voterSchema.parse(formData);
      setErrors({}); // Clear errors if validation passes

      setIsSubmitting(true);

      // Call API to add voter
      const response = await fetch("/api/voter/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nim: formData.nim,
          name: formData.fullName,
          email: formData.email,
          fakultas: formData.faculty,
          jurusan: formData.department,
          angkatan: formData.year,
          phone: formData.phone,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add voter");
      }

      toast("Success", {
        description: "Voter has been successfully added.",
      });

      // Reset form and close modal
      setFormData({
        fullName: "",
        email: "",
        nim: "",
        faculty: "",
        department: "",
        year: "",
        phone: "",
        status: "aktif",
      });

      onSave();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to form fields
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        console.error("Error adding voter:", error);
        toast("Error", {
          description: error.message || "Failed to add voter. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>{voter ? "Edit Voter" : "Add New Voter"}</DialogTitle>
                <DialogDescription>
                  {voter
                    ? "Update the voter's information in the form below."
                    : "Fill in the details to add a new voter to the system."}
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-4 grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nim">NIM *</Label>
                    <Input
                      id="nim"
                      name="nim"
                      value={formData.nim}
                      onChange={handleInputChange}
                      placeholder="Enter NIM"
                    />
                    {errors.nim && <p className="text-red-500 text-sm">{errors.nim}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year (Angkatan) *</Label>
                    <Input
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="Enter year"
                    />
                    {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="faculty">Faculty *</Label>
                    <Input
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                      placeholder="Enter faculty"
                    />
                    {errors.faculty && <p className="text-red-500 text-sm">{errors.faculty}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department"
                    />
                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
              </div>
              <DialogFooter className="px-6 pb-6">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : voter ? "Update Voter" : "Add Voter"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}