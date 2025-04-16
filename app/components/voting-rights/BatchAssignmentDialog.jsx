import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BatchAssignmentForm from "./BatchAssignmentForm";

export default function BatchAssignmentDialog({ onSuccess }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Batch Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batch Assign Voting Rights</DialogTitle>
          <DialogDescription>
            Assign voting rights to multiple voters based on faculty, major, or year.
          </DialogDescription>
        </DialogHeader>
        <BatchAssignmentForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
} 