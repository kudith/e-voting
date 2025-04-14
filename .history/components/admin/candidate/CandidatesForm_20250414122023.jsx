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
  eelctionsId
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
          electionId: String(electionId || ""), // Convert to string
        });
      }
    }
  }, [isOpen, candidate, electionId]);

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
              {candidate ? "Edit Candidate" : "Add Candidate"}
            </DialogTitle>
            <DialogDescription>
              {candidate
                ? "Update the candidate's information."
                : "Fill out the form to add a new candidate."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 grid gap-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter candidate's name"
              />
            </div>

            {/* Photo Field */}
            <div className="grid gap-2">
              <Label htmlFor="photo">Photo URL *</Label>
              <Input
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="Enter photo URL"
              />
            </div>

            {/* Vision Field */}
            <div className="grid gap-2">
              <Label htmlFor="vision">Vision *</Label>
              <Input
                id="vision"
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                placeholder="Enter candidate's vision"
              />
            </div>

            {/* Mission Field */}
            <div className="grid gap-2">
              <Label htmlFor="mission">Mission *</Label>
              <Input
                id="mission"
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                placeholder="Enter candidate's mission"
              />
            </div>

            {/* Short Bio Field */}
            <div className="grid gap-2">
              <Label htmlFor="shortBio">Short Bio *</Label>
              <Input
                id="shortBio"
                name="shortBio"
                value={formData.shortBio}
                onChange={handleInputChange}
                placeholder="Enter candidate's short bio"
              />
            </div>

            {/* Election ID Field */}
            <div className="grid gap-2">
              <Label htmlFor="electionId">Election *</Label>
              <select
                id="electionId"
                name="electionId"
                value={formData.electionId}
                onChange={handleInputChange}
                className="border rounded-md p-2"
              >
                <option value="">Select an election</option>
                {elections && elections.length > 0 ? (
                  elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))
                ) : (
                  <option disabled>No elections available</option>
                )}
              </select>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(formData)}>
              {candidate ? "Update Candidate" : "Create Candidate"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
