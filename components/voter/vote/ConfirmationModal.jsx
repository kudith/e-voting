"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";

export function ConfirmationModal({ isOpen, onClose, onConfirm, candidate }) {
  if (!candidate) return null;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-bold text-center">
                  Konfirmasi Pilihan
                </DialogTitle>
                <DialogDescription className="text-center">
                  Pastikan pilihan Anda sudah benar. Suara tidak dapat diubah setelah dikonfirmasi.
                </DialogDescription>
              </DialogHeader>

              <div className="my-6">
                <div className="flex flex-col items-center bg-muted/50 rounded-lg p-4 space-y-3">
                  <Avatar className="h-16 w-16">
                    {candidate.photo ? (
                      <AvatarImage src={candidate.photo} alt={candidate.name} />
                    ) : (
                      <AvatarFallback className="text-lg">{getInitials(candidate.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{candidate.vision}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-md p-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Pilihan ini tidak dapat diubah setelah dikonfirmasi.</span>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-center sm:space-x-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Kembali
                </Button>
                <Button
                  onClick={onConfirm}
                  className="bg-primary hover:bg-primary/90"
                >
                  Ya, Saya Yakin
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 