"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, label: "Pilih" },
  { id: 2, label: "Konfirmasi" },
  { id: 3, label: "Selesai" },
];

export function Stepper({ currentStep }) {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10">
            <motion.div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep > step.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </motion.div>
            <span
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-medium whitespace-nowrap ${
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 