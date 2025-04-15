import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import VotingRightsTable from "@/components/voting-rights/VotingRightsTable";
import SearchAndFilter from "@/components/voting-rights/SearchAndFilter";
import VotingRightsForm from "@/components/voting-rights/VotingRightsForm";
import BatchAssignmentDialog from "@/components/voting-rights/BatchAssignmentDialog";

export default function VotingRightsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    election: "",
    faculty: "",
    major: "",
    year: "",
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    // Refresh the table data here if needed
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Voting Rights Management</h1>
        <div className="space-x-2">
          <BatchAssignmentDialog onSuccess={handleSuccess} />

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Voting Right
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Voting Right</DialogTitle>
              </DialogHeader>
              <VotingRightsForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      <VotingRightsTable
        searchQuery={searchQuery}
        filters={filters}
      />
    </div>
  );
} 