"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import CandidatesForm from "@/components/admin/candidate/CandidatesForm";
import CandidatesTable from "@/components/admin/candidate/CandidatesTable";
import SearchAndFilter from "@/components/admin/candidate/SearchAndFilter";
import DeleteConfirmation from "@/components/admin/candidate/DeleteConfirmation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CandidatesPage() {ca
  // Data state
  const [candidates, setCandidates] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort, filter, pagination state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal and selection state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  // Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/candidate/getAllCandidates");
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load candidates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [dataChanged]);

  // Filtering and sorting logic
  const getFilteredAndSortedCandidates = () => {
    let filtered = [...candidates];

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const paginatedCandidates = getFilteredAndSortedCandidates().slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sorting
  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  // Pagination
  const handlePageChange = (page) => {
    const maxPage = Math.ceil(candidates.length / rowsPerPage);
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Create
  const createCandidate = async (formData) => {
    try {
      const res = await fetch("/api/candidate/createCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create candidate");
      }

      const result = await res.json();
      toast.success(`Candidate "${formData.name}" added.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      toast.error(err.message || "Failed to create candidate.");
    }
  };

  // Update
  const updateCandidate = async (formData) => {
    try {
      const res = await fetch("/api/candidate/updateCandidate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update candidate");
      }

      const result = await res.json();
      toast.success(`Candidate "${formData.name}" updated.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      toast.error(err.message || "Failed to update candidate.");
    }
  };

  // Delete
  const deleteCandidate = async (id) => {
    try {
      const res = await fetch(`/api/candidate/deleteCandidate?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete candidate");
      }

      toast.success("Candidate deleted.");
      setIsDeleteDialogOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      toast.error(err.message || "Failed to delete candidate.");
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
                Manage candidates for the election
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
                <Plus className="h-4 w-4" /> Add Candidate
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
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Modal */}
      <CandidatesForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
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

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() =>
          selectedCandidate && deleteCandidate(selectedCandidate.id)
        }
        candidateName={selectedCandidate?.name}
      />
    </div>
  );
}
