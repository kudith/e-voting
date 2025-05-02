"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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

export default function CandidatesForm({ isOpen, onClose, onSave, candidate }) {
  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    mission: "",
    shortBio: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or candidate changes
  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        setFormData({
          photo: candidate.photo || "",
          name: candidate.name || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
        });
      } else {
        setFormData({
          photo: "",
          name: "",
          mission: "",
          shortBio: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, candidate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setErrors({}); // Clear errors if validation passes
      setIsSubmitting(true);

      // Call API to update candidate
      const response = await fetch(`/api/candidate/update/${candidate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update candidate");
      }

      toast("Success", {
        description: "Candidate has been successfully updated.",
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast("Error", {
        description:
          error.message || "Failed to update candidate. Please try again.",
      });
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
                <DialogTitle>Edit Candidate</DialogTitle>
                <DialogDescription>
                  Update the candidate's information in the form below.
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo">Photo URL *</Label>
                  <Input
                    id="photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="Enter photo URL"
                  />
                  {errors.photo && (
                    <p className="text-red-500 text-sm">{errors.photo}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter candidate name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mission">Mission *</Label>
                  <Input
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    placeholder="Enter candidate mission"
                  />
                  {errors.mission && (
                    <p className="text-red-500 text-sm">{errors.mission}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shortBio">Short Bio *</Label>
                  <Input
                    id="shortBio"
                    name="shortBio"
                    value={candidate.shortBio}
                    onChange={handleInputChange}
                    placeholder="Enter candidate short bio"
                  />
                  {errors.shortBio && (
                    <p className="text-red-500 text-sm">{errors.shortBio}</p>
                  )}
                </div>
              </div>
              <DialogFooter className="px-6 pb-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Update Candidate"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
