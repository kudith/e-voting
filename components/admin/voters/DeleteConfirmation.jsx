"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { LoadingModal } from "@/components/ui/loading-modal"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, count, voterName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="sm:max-w-md border-0 shadow-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <AlertTriangle className="h-6 w-6" />
              </motion.div>
              <AlertDialogTitle className="text-xl font-bold">Apakah Anda yakin?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-3 text-base">
              {count > 1
                ? `Tindakan ini akan menghapus ${count} pemilih secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`
                : `Tindakan ini akan menghapus data `}<span className="font-bold">{voterName}</span>{` secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="mt-0 border-muted-foreground/20 hover:bg-muted/80 cursor-pointer transition-all duration-200"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  <span>Menghapus...</span>
                </motion.div>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingModal 
        isOpen={isDeleting} 
        message={count > 1 
          ? `Menghapus ${count} pemilih...` 
          : `Menghapus data ${voterName}...`} 
      />
    </>
  )
}
