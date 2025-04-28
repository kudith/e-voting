"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function CandidateCard({ candidate, isSelected, onSelect, onViewDetails }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card
        className={`h-full transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900 bg-primary/5"
            : "hover:shadow-md"
        }`}
        onClick={() => onSelect(candidate)}
      >
        <CardContent className="pt-6 pb-2">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Candidate Image */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                {candidate.photo ? (
                  <AvatarImage src={candidate.photo} alt={candidate.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(candidate.name)}</AvatarFallback>
                )}
              </Avatar>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Candidate Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              
              {candidate.voteCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {candidate.voteCount} Suara
                </Badge>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-3">
                {candidate.vision || "Tidak ada visi tersedia"}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-4">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
} 