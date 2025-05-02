"use client";

import { motion } from "framer-motion";
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

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  count,
  electionTitle,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              {count > 1 ? (
                <div className="space-y-2">
                  <div className="text-base font-medium text-foreground">
                    Anda akan menghapus {count} pemilu
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tindakan ini akan menghapus pemilu yang dipilih secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-base font-medium text-foreground">
                    Anda akan menghapus pemilu "{electionTitle}"
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tindakan ini akan menghapus pemilu secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-2">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
