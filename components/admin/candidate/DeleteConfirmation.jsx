"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  count,
  candidateName,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-red-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle className="text-red-600">
                Konfirmasi Penghapusan
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              {count > 1
                ? `Tindakan ini akan menghapus ${count} kandidat secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`
                : `Tindakan ini akan menghapus kandidat "${candidateName}" secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {count > 1 ? `Hapus ${count} Kandidat` : "Hapus Kandidat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
