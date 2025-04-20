"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { electionSchema } from "@/validations/ElectionSchme";

export default function ElectionForm({ isOpen, onClose, onSave, election }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(electionSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (election) {
        reset({
          title: election.title || "",
          description: election.description || "",
          startDate: election.startDate || "",
          endDate: election.endDate || "",
          status: election.status || "active",
        });
      } else {
        reset();
      }
    }
  }, [isOpen, election, reset]);

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
              {election ? "Edit Election" : "Create Election"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {election
                ? "Update the election details below."
                : "Fill in the details for the new election below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title", {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue("title", value, { shouldValidate: true });
                    },
                  })}
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
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  {...register("description", {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue("description", value, { shouldValidate: true });
                    },
                  })}
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
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Start Date Field */}
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue("startDate", value, { shouldValidate: true });
                    },
                  })}
                  className={cn(
                    "transition-colors",
                    errors.startDate &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.startDate && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date Field */}
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue("endDate", value, { shouldValidate: true });
                    },
                  })}
                  className={cn(
                    "transition-colors",
                    errors.endDate &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.endDate && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  {...register("status", {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue("status", value, { shouldValidate: true });
                    },
                  })}
                  className={cn(
                    "transition-colors border rounded-md p-2",
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
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="px-8 pb-8 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {election ? "Update Election" : "Create Election"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
