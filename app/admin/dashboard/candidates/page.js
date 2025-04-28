"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Users, Loader2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { LoadingModal } from "@/components/ui/loading-modal";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CandidatesPage() {
  // Data state
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);
  const [error, setError] = useState(null);

  // Sort, filter, pagination state
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [electionFilter, setElectionFilter] = useState("all");
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
      setError(null);
      try {
        const res = await fetch("/api/candidate/getAllCandidates", {
          cache: "no-store",
          next: { revalidate: 0 }
        });
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();

        // Map data to ensure all fields are properly populated
        const enhancedData = data.map(candidate => ({
          ...candidate,
          voteCount: candidate.voteCount || 0,
          votePercentage: candidate.votePercentage || "0.0",
          status: candidate.status || "Active",
          details: candidate.details || "",
          socialMedia: candidate.socialMedia || null,
          education: candidate.education || [],
          experience: candidate.experience || [],
          achievements: candidate.achievements || [],
          programs: candidate.programs || [],
          stats: candidate.stats || {
            experience: 0,
            leadership: 0,
            innovation: 0,
            publicSupport: 0
          },
        }));

        setCandidates(enhancedData);
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

    // Apply election filter if not 'all'
    if (electionFilter !== "all") {
      filtered = filtered.filter((c) => 
        c.election && c.election.id === electionFilter
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.election && c.election.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        // Handle specific fields
        switch (sortConfig.key) {
          case "electionId":
            aVal = a.election ? a.election.title : "";
            bVal = b.election ? b.election.title : "";
            break;
          default:
            aVal = a[sortConfig.key] || "";
            bVal = b[sortConfig.key] || "";
        }

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

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = [];
    
    if (statusFilter !== "all") {
      filters.push({
        label: "Status",
        value: statusFilter === "Active" ? "Aktif" : "Nonaktif",
        onRemove: () => setStatusFilter("all")
      });
    }
    
    if (electionFilter !== "all") {
      const election = elections.find(e => e.id === electionFilter);
      if (election) {
        filters.push({
          label: "Pemilihan",
          value: election.title,
          onRemove: () => setElectionFilter("all")
        });
      }
    }
    
    return filters;
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("all");
    setElectionFilter("all");
    setSearchQuery("");
  };

  // Calculate pagination
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
      const res = await fetch("/api/candidate/createCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create candidate");
      }

      toast.success(`Kandidat "${formData.name}" berhasil ditambahkan.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error creating candidate:", err);
      toast.error(
        err.message || "Gagal menambahkan kandidat. Silakan coba lagi."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update
  const updateCandidate = async (formData) => {
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/candidate/updateCandidate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update candidate");
      }

      toast.success(`Kandidat "${formData.name}" berhasil diperbarui.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error updating candidate:", err);
      toast.error(
        err.message || "Gagal memperbarui kandidat. Silakan coba lagi."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete
  const deleteCandidate = async (id) => {
    try {
      setIsDeleting(true);
      setDeletingCandidateId(id);
      
      const res = await fetch(`/api/candidate/deleteCandidate?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete candidate");
      }

      toast.success("Kandidat berhasil dihapus.");
      setIsDeleteDialogOpen(false);
      setSelectedCandidate(null);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error deleting candidate:", err);
      toast.error(
        err.message || "Gagal menghapus kandidat. Silakan coba lagi."
      );
    } finally {
      setIsDeleting(false);
      setDeletingCandidateId(null);
    }
  };

  // Bulk delete
  const bulkDeleteCandidates = async () => {
    if (selectedCandidates.length === 0) return;

    try {
      setIsDeleting(true);
      
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
        `${selectedCandidates.length} kandidat berhasil dihapus.`
      );
      setSelectedCandidates([]);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error bulk deleting candidates:", err);
      toast.error(
        err.message || "Gagal menghapus kandidat. Silakan coba lagi."
      );
    } finally {
      setIsDeleting(false);
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

  // Stats computation
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => c.status === "Active").length;
  const inactiveCandidates = totalCandidates - activeCandidates;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 px-4"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Kandidat</p>
                      <h3 className="text-2xl font-bold">{totalCandidates}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kandidat Aktif</p>
                      <h3 className="text-2xl font-bold">{activeCandidates}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-yellow-500/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kandidat Nonaktif</p>
                      <h3 className="text-2xl font-bold">{inactiveCandidates}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Card className="shadow-md border-muted-foreground/10">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Manajemen Kandidat
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Mengelola kandidat untuk pemilihan
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <SearchAndFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    electionFilter={electionFilter}
                    setElectionFilter={setElectionFilter}
                    elections={elections}
                    activeFilters={getActiveFilters()}
                    clearFilters={clearAllFilters}
                  />
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="gap-1 bg-primary hover:bg-primary/90 transition-colors"
                    disabled={isDeleting}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Kandidat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedCandidates.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-between bg-primary/5 p-3 rounded-md border border-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {selectedCandidates.length} kandidat dipilih
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isDeleting}
                      className="gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus Terpilih
                    </Button>
                  </motion.div>
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
                  isDeleting={isDeleting}
                  deletingCandidateId={deletingCandidateId}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  totalCandidates={filteredCandidates.length}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Form Modal */}
      <CandidatesForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSave={handleSaveCandidate}
        candidate={selectedCandidate}
        elections={elections}
        isSubmitting={formSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCandidate(null);
        }}
        onConfirm={() =>
          selectedCandidate ? deleteCandidate(selectedCandidate.id) : bulkDeleteCandidates()
        }
        candidateName={selectedCandidate?.name}
        count={selectedCandidates.length}
      />

      {/* Global loading modal for bulk operations */}
      <LoadingModal 
        isOpen={isDeleting && !selectedCandidate} 
        message={selectedCandidates.length > 0 
          ? `Menghapus ${selectedCandidates.length} kandidat...` 
          : "Memproses permintaan..."} 
      />
    </div>
  );
}
