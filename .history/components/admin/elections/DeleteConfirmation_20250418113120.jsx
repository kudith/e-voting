export default function ElectionConfirmation({
  isOpen,
  onClose,
  onConfirm,
  electionTitle,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm(); // Ensure this calls the correct function
    } catch (error) {
      console.error("Error in election confirmation:", error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
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
            <AlertDialogTitle className="text-xl font-bold">
              Are you sure?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-3 text-base">
            This action will permanently delete the election{" "}
            <span className="font-bold">{electionTitle}</span> from the system.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel
            disabled={isProcessing}
            className="mt-0 border-muted-foreground/20 hover:bg-muted/80 cursor-pointer transition-all duration-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>Deleting...</span>
              </motion.div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
