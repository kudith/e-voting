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

export default function CandidatesForm({
  isOpen,
  onClose,
  onSave,
  candidate,
  electionId,
}) {
  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    mission: "",
    shortBio: "",
    electionId: electionId || "", // Initialize with electionId
  });

  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        setFormData({
          photo: candidate.photo || "",
          name: candidate.name || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
          electionId: candidate.electionId || electionId || "",
        });
      } else {
        setFormData({
          photo: "",
          name: "",
          mission: "",
          shortBio: "",
          electionId: electionId || "",
        });
      }
    }
  }, [isOpen, candidate, electionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            {/* Other fields */}
            <div className="grid gap-2">
              <Label htmlFor="electionId">Election ID *</Label>
              <Input
                id="electionId"
                name="electionId"
                value={formData.electionId}
                onChange={handleInputChange}
                placeholder="Enter election ID"
                disabled={!!electionId} // Disable if electionId is passed as props
              />
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
