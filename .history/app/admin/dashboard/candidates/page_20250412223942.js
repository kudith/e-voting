"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import CandidatesForm from "@/components/admin/candidate/CandidatesForm";

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
import CandidatesTable from "@/components/admin/candidate/CandidatesTable";
import SearchAndFilter from "@/components/admin/candidate/SearchAndFilter";
import DeleteConfirmation from "@/components/admin/candidate/DeleteConfirmation";

export default function CandidatesPage() {
  // State for candidates data
  const [candidates, setCandidates] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch candidates data from API
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/candidate/getAllCandidates");
        if (!response.ok) {
          throw new Error("Failed to fetch candidates data");
        }
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setError("Failed to load candidates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [dataChanged]);

  // Filter and sort candidates
  const getFilteredAndSortedCandidates = () => {
    let filteredData = [...candidates];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  // Paginate candidates
  const paginatedCandidates = getFilteredAndSortedCandidates().slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(candidates.length / rowsPerPage)) {
      setCurrentPage(page);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset errors
  setErrors({});

  // Validate form fields
  if (!formData.name) {
    setErrors((prev) => ({ ...prev, name: "Name is required" }));
    return;
  }

  if (!formData.electionId) {
    setErrors((prev) => ({ ...prev, electionId: "Election ID is required" }));
    return;
  }

  try {
    await onSave(formData); // Call the onSave function passed as a prop
    onClose(); // Close the modal
  } catch (error) {
    console.error("Error saving candidate:", error);
  }
};
  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Function to create a new candidate
const createCandidate = async (formData) => {
  try {
    console.log("Creating candidate with data:", formData); // Debugging log
    const response = await fetch("/api/candidate/createCandidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create candidate");
    }

    const result = await response.json();
    console.log("Candidate created successfully:", result); // Debugging log
    toast({
      title: "Candidate added",
      description: `${formData.name} has been added successfully.`,
    });
    setDataChanged((prev) => !prev); // Trigger data refresh
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error creating candidate:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to create candidate.",
      variant: "destructive",
    });
  }
};

  // Function to update an existing candidate
  const updateCandidate = async (formData) => {
    try {
      const response = await fetch("/api/candidate/updateCandidate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update candidate");
      }

      const result = await response.json();
      toast({
        title: "Candidate updated",
        description: `${formData.name} has been updated successfully.`,
      });
      setDataChanged((prev) => !prev); // Trigger data refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update candidate.",
        variant: "destructive",
      });
    }
  };

  // Function to delete a candidate
  const deleteCandidate = async (id) => {
    try {
      const response = await fetch(`/api/candidate/deleteCandidate?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete candidate");
      }

      const result = await response.json();
      toast({
        title: "Candidate deleted",
        description: "The candidate has been deleted successfully.",
      });
      setDataChanged((prev) => !prev); // Trigger data refresh
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete candidate.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Candidate Management
              </CardTitle>
              <CardDescription>
                Manage candidates registered for the election
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <Button onClick={() => setIsModalOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CandidatesTable
              candidates={paginatedCandidates}
              isLoading={isLoading}
              selectedCandidates={selectedCandidates}
              onSelectCandidate={(id, checked) =>
                setSelectedCandidates((prev) =>
                  checked ? [...prev, id] : prev.filter((c) => c !== id)
                )
              }
              onSelectAll={(checked) =>
                setSelectedCandidates(
                  checked ? paginatedCandidates.map((c) => c.id) : []
                )
              }
              onEdit={(candidate) => {
                setSelectedCandidate(candidate);
                setIsModalOpen(true);
              }}
              onDelete={(candidate) => {
                setSelectedCandidate(candidate);
                setIsDeleteDialogOpen(true);
              }}
              sortConfig={sortConfig}
              requestSort={requestSort}
              error={error}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Candidate Form Modal */}
      <CandidatesForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null); // Reset selectedCandidate saat modal ditutup
        }}
        onSave={(formData) => {
          if (selectedCandidate) {
            updateCandidate({ id: selectedCandidate.id, ...formData });
          } else {
            createCandidate(formData);
          }
        }}
        candidate={selectedCandidate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedCandidate) {
            deleteCandidate(selectedCandidate.id);
          }
        }}
        candidateName={selectedCandidate?.name}
      />
    </div>
  );
}
