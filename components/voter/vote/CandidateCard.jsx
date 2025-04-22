"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CandidateCard({ candidate, isSelected, onSelect, onViewDetails }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
            : "hover:shadow-lg"
        }`}
        onClick={() => onSelect(candidate)}
      >
        <div className="flex flex-col items-center text-center">
          {/* Candidate Image */}
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={candidate.photo || "/placeholder-avatar.png"}
              alt={candidate.name}
              fill
              className="rounded-full object-cover"
            />
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 rounded-full ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
              />
            )}
          </div>

          {/* Candidate Info */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {candidate.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {candidate.vision}
          </p>

          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(candidate);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat Detail
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 