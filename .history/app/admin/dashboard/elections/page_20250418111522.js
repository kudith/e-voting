"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import ElectionConfirmation from "@/components/admin/elections/DeleteConfirmation";
import SearchAndFilter from "@/components/admin/elections/searchAndFilter";
import ElectionTable from "@/components/admin/elections/ElectionTable";
import ElectionForm from "@/components/admin/elections/ElectionForm";

export default function ElectionsPage() {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [deletingElectionId, setDeletingElectionId] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState("");
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedElections, setSelectedElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/election/getAllElections");
        if (!response.ok) {
          throw new Error("Failed to fetch elections data");
        }

        const data = await response.json();
        setElections(data);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections data. Please try again.");
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, []);

 const handleDeleteElection = async () => {
   try {
     setIsDeleting(true);
     setDeletingElectionId(selectedElection.id); // Set the ID of the election being deleted

     const response = await fetch(
       `/api/election/deleteElection?id=${selectedElection.id}`,
       {
         method: "DELETE",
       }
     );

     if (!response.ok) {
       throw new Error("Failed to delete election");
     }

     setElections((prev) => prev.filter((e) => e.id !== selectedElection.id));
     toast.success("Election deleted successfully.");
   } catch (err) {
     console.error("Error deleting election:", err);
     toast.error("Failed to delete election. Please try again.");
   } finally {
     setIsDeleting(false);
     setDeletingElectionId(null); // Reset after deletion
     setIsDeleteDialogOpen(false);
     setSelectedElection(null);
   }
 };

const filteredElections = elections.filter((election) => {
  const title = election?.title ?? "";
  const startDate = election?.startDate;
  const endDate = election?.endDate;
  const status = election?.status ?? "";

  const matchesSearch = title
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || status === statusFilter;

  const matchesStartDate =
    !startDateFilter ||
    (startDate && !isNaN(new Date(startDate)) &&
      new Date(startDate) >= new Date(startDateFilter));

  const matchesEndDate =
    !endDateFilter ||
    (endDate && !isNaN(new Date(endDate)) &&
      new Date(endDate) <= new Date(endDateFilter));

  return (
    matchesSearch &&
    matchesStatus &&
    matchesStartDate &&
    matchesEndDate
  );
});

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedElections = [...elections].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setElections(sortedElections);
  };

  const handleSelectElection = (id, isSelected) => {
    setSelectedElections((prev) =>
      isSelected
        ? [...prev, id]
        : prev.filter((electionId) => electionId !== id)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedElections(isSelected ? elections.map((e) => e.id) : []);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <Card className="shadow-md border-muted-foreground/10">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Election Management
                </CardTitle>
                <CardDescription>
                  Manage elections for your system
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <SearchAndFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  startDateFilter={startDateFilter}
                  setStartDateFilter={setStartDateFilter}
                  endDateFilter={endDateFilter}
                  setEndDateFilter={setEndDateFilter}
                  activeFilters={[
                    ...(statusFilter !== "all"
                      ? [{ label: "Status", value: statusFilter }]
                      : []),
                    ...(startDateFilter
                      ? [{ label: "Start Date", value: startDateFilter }]
                      : []),
                    ...(endDateFilter
                      ? [{ label: "End Date", value: endDateFilter }]
                      : []),
                  ]}
                  clearFilters={() => {
                    setStatusFilter("all");
                    setStartDateFilter("");
                    setEndDateFilter("");
                  }}
                />
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="gap-1 bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Election
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <ElectionTable
                elections={filteredElections}
                isLoading={isLoading}
                selectedElections={selectedElections}
                onSelectElection={handleSelectElection}
                onSelectAll={handleSelectAll}
                onEdit={(election) => {
                  setSelectedElection(election);
                  setIsModalOpen(true);
                }}
                onDelete={(election) => {
                  setSelectedElection(election);
                  setIsDeleteDialogOpen(true);
                }}
                sortConfig={sortConfig}
                requestSort={requestSort}
                error={error}
                isDeleting={isDeleting}
                deletingElectionId={deletingElectionId}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Election Form */}
      <ElectionForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedElection(null);
        }}
        onSave={(formData) => {
          setIsModalOpen(false);
          if (selectedElection) {
            setElections((prev) =>
              prev.map((election) =>
                election.id === formData.id
                  ? { ...election, ...formData }
                  : election
              )
            );
          } else {
            setElections((prev) => [...prev, formData]);
          }
          setSelectedElection(null);
        }}
        election={selectedElection}
      />

      {/* Delete Confirmation */}
      <ElectionConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedElection(null);
        }}
        onConfirm={handleDeleteElection}
        electionTitle={selectedElection?.title}
      />
    </div>
  );
}
