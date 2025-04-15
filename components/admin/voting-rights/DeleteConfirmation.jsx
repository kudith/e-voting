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
import { Trash2, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  count,
  voterName,
  type = "voting-right",
}) {
  const title = count > 0 
    ? `Hapus ${count} hak pilih?` 
    : `Hapus hak pilih untuk ${voterName}?`;

  const description = count > 0
    ? `Anda akan menghapus ${count} hak pilih. Tindakan ini tidak dapat dibatalkan.`
    : `Anda akan menghapus hak pilih untuk ${voterName}. Tindakan ini tidak dapat dibatalkan.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md border-muted-foreground/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            <div className="flex items-start gap-2 mt-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{description}</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="mt-0 border-muted-foreground/20 hover:bg-muted/50">
            <X className="h-4 w-4 mr-2" />
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 