"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmationModal({ isOpen, onClose, onConfirm, candidate }) {
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
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Konfirmasi Pilihan
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Apakah Anda yakin memilih{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {candidate?.name}
                  </span>
                  ?
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Pilihan ini tidak dapat diubah setelah dikonfirmasi.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  Kembali
                </Button>
                <Button
                  onClick={onConfirm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Ya, Saya Yakin
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 