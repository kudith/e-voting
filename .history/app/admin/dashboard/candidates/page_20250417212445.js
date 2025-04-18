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

export default function CandidatesPage() {
  // Data state
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort, filter, pagination state
  const [sortConfig, setSortConfig] = useState({
    key: "name",
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
  const [formSubmitting, setFormSubmitting] = useState(false);

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
        console.error("Error fetching candidates:", err);
        setError("Failed to load candidates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [dataChanged]);

  // Fetch all elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("/api/election/getAllElections");
        if (!res.ok) throw new Error("Failed to fetch elections");
        const data = await res.json();
        setElections(data);
      } catch (err) {
        console.error("Error fetching elections:", err);
        toast.error("Failed to load elections. Please refresh the page.");
      }
    };

    fetchElections();
  }, []);

  // Filtering and sorting logic
  const getFilteredAndSortedCandidates = () => {
    let filtered = [...candidates];

    // Apply status filter if not 'all'
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortConfig.direction === "ascending"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  };

  const filteredCandidates = getFilteredAndSortedCandidates();
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

  const paginatedCandidates = filteredCandidates.slice(
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Create
  const createCandidate = async (formData) => {
    setFormSubmitting(true);
    try {
      const payload = {
        ...formData,
        electionId: String(formData.electionId), // Convert to string
      };

      const res = await fetch("/api/candidate/createCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create candidate");
      }

      toast.success(`Candidate "${formData.name}" added successfully.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error creating candidate:", err);
      toast.error(
        err.message || "Failed to create candidate. Please try again."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update
  const updateCandidate = async (formData) => {
    setFormSubmitting(true);
    try {
      // Client-side validation
      const requiredFields = [
        "name",
        "photo",
        "vision",
        "mission",
        "shortBio",
        "electionId",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      console.log("Updating candidate data:", formData);

      const res = await fetch("/api/candidate/updateCandidate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update candidate");
      }

      toast.success(`Candidate "${formData.name}" updated successfully.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error updating candidate:", err);
      toast.error(
        err.message || "Failed to update candidate. Please try again."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete
  const deleteCandidate = async (id) => {
    try {
      const res = await fetch(`/api/candidate/deleteCandidate?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete candidate");
      }

      toast.success("Candidate deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSelectedCandidate(null);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error deleting candidate:", err);
      toast.error(
        err.message || "Failed to delete candidate. Please try again."
      );
    }
  };

  // Bulk delete
  const bulkDeleteCandidates = async () => {
    if (selectedCandidates.length === 0) return;

    try {
      const res = await fetch("/api/candidate/bulkDeleteCandidates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedCandidates }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete candidates");
      }

      toast.success(
        `${selectedCandidates.length} candidates deleted successfully.`
      );
      setSelectedCandidates([]);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error bulk deleting candidates:", err);
      toast.error(
        err.message || "Failed to delete candidates. Please try again."
      );
    }
  };

  // Handle form submission
  const handleSaveCandidate = (formData) => {
    if (selectedCandidate) {
      updateCandidate({ id: selectedCandidate.id, ...formData });
    } else {
      createCandidate(formData);
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
                Manajemen Kandidat
              </CardTitle>
              <CardDescription>Kelola kandidat untuk pemilihan</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <Button onClick={() => setIsModalOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" /> Tambah Kandidat
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCandidates.length > 0 && (
              <div className="mb-4 p-2 bg-red-50 rounded-md flex items-center justify-between">
                <span className="text-sm text-red-600">
                  {selectedCandidates.length} kandidat dipilih
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Apakah Anda yakin ingin menghapus ${selectedCandidates.length} kandidat?`
                      )
                    ) {
                      bulkDeleteCandidates();
                    }
                  }}
                >
                  Hapus yang Dipilih
                </Button>
              </div>
            )}

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
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalCandidates={filteredCandidates.length}
            />
          </CardContent>
        </Card>

        {/* Form Modal */}
        <CandidatesForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCandidate(null);
          }}
          onSave={handleSaveCandidate}
          candidate={selectedCandidate}
          elections={elections} // Pass the elections data here
          isSubmitting={formSubmitting}
        />
        {/* Election ID Field */}
        <div className="grid gap-2">
          <Label htmlFor="electionId">Pemilihan *</Label>
          <Select
            value={watch("electionId")} // Use watch to observe the value
            onValueChange={(value) => setValue("electionId", value)}
          >
            <SelectTrigger id="electionId" className="w-full">
              <SelectValue placeholder="Pilih pemilihan" />
            </SelectTrigger>
            <SelectContent>
              {elections && elections.length > 0 ? (
                elections.map((election) => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Tidak ada pemilihan tersedia</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.electionId && (
            <p className="text-red-500 text-sm">{errors.electionId.message}</p>
          )}
        </div>
        {/* Delete Confirmation */}
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCandidate(null);
          }}
          onConfirm={() =>
            selectedCandidate && deleteCandidate(selectedCandidate.id)
          }
          candidateName={selectedCandidate?.name}
        />
      </motion.div>
    </div>
  );
}
