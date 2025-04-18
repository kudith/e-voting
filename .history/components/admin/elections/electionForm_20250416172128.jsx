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
import { electionSchema } from "@/validations/ElectionSchema"; // Create a Zod schema for validation
import { z } from "zod";
import { LoadingModal } from "@/components/ui/loading-modal";
import { Calendar, CheckCircle2, Clipboard, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ElectionForm({ isOpen, onClose, onSave, election }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (election) {
        setFormData({
          title: election.title || "",
          description: election.description || "",
          startDate: election.startDate || "",
          endDate: election.endDate || "",
          status: election.status || "active",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "active",
        });
      }
      setErrors({});
    }
  }, [isOpen, election]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    try {
      const fieldToValidate = { [name]: value };
      electionSchema.pick({ [name]: true }).parse(fieldToValidate);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "Invalid input";
        setErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      electionSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      const endpoint = election
        ? `/api/election/updateElection`
        : `/api/election/createElection`;
      const method = election ? "PATCH" : "POST";

      if (election) {
        payload.id = election.id;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save election");
      }

      const result = await response.json();
      resetForm();
      onSave(result || payload);
      onClose();

      toast.success("Success", {
        description: election
          ? "Election updated successfully."
          : "Election created successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        toast.error("Error", {
          description:
            error.message || "Failed to save election. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
    setErrors({});
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-lg">
          <AnimatePresence>
            {isOpen && (
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
                      {election ? "Edit Election" : "Create New Election"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {election
                        ? "Update the election details below."
                        : "Fill in the details for the new election below."}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="flex items-center gap-1.5"
                      >
                        <Clipboard className="h-4 w-4 text-muted-foreground" />
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter election title"
                        className={cn(
                          "transition-colors",
                          errors.title &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.title && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="flex items-center gap-1.5"
                      >
                        <Clipboard className="h-4 w-4 text-muted-foreground" />
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter election description"
                        className={cn(
                          "transition-colors",
                          errors.description &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.description && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="flex items-center gap-1.5"
                      >
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={cn(
                          "transition-colors",
                          errors.startDate &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.startDate && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="endDate"
                        className="flex items-center gap-1.5"
                      >
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={cn(
                          "transition-colors",
                          errors.endDate &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.endDate && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.endDate}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="status"
                        className="flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        Status <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange(e)}
                        className={cn(
                          "transition-colors",
                          errors.status &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {errors.status && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-muted/50 border-t mx-6 flex flex-col sm:flex-row gap-2 md:gap-2 sm:gap-0 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200"
                  >
                    {election ? "Save" : "Create"}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <LoadingModal
        isOpen={isSubmitting}
        message={election ? "Updating election..." : "Creating election..."}
      />
    </>
  );
}
