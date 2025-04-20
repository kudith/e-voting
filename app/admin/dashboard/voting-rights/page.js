"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users2,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
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
import { LoadingModal } from "@/components/ui/loading-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import VotingRightsTable from "@/components/admin/voting-rights/VotingRightsTable";
import VotingRightsForm from "@/components/admin/voting-rights/VotingRightsForm";
import SearchAndFilter from "@/components/admin/voting-rights/SearchAndFilter";
import DeleteConfirmation from "@/components/admin/voting-rights/DeleteConfirmation";
import VotingRightsStats from "@/components/admin/voting-rights/VotingRightsStats";

export default function VotingRightsPage() {
  // State for voting rights data
  const [voterElections, setVoterElections] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoterElection, setSelectedVoterElection] = useState(null);
  const [selectedVoterElections, setSelectedVoterElections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [electionFilter, setElectionFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [elections, setElections] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Calculate active filters count
  const activeFilters = [
    electionFilter !== "all",
    facultyFilter !== "all",
    majorFilter !== "all",
    yearFilter !== "all",
  ].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setElectionFilter("all");
    setFacultyFilter("all");
    setMajorFilter("all");
    setYearFilter("all");
  };

  // Fetch filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch elections
        const electionsRes = await fetch("/api/election/getAllElections");
        if (!electionsRes.ok) throw new Error("Failed to fetch elections");
        const electionsData = await electionsRes.json();
        setElections(electionsData);

        // Fetch faculties
        const facultiesRes = await fetch("/api/faculty/getAllFaculties");
        if (!facultiesRes.ok) throw new Error("Failed to fetch faculties");
        const facultiesData = await facultiesRes.json();
        setFaculties(facultiesData);

        // Generate years (current year - 4 to current year)
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from(
          { length: 5 },
          (_, i) => currentYear - i
        );
        setYears(yearOptions);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  // Fetch majors when faculty changes
  useEffect(() => {
    const fetchMajors = async () => {
      if (facultyFilter && facultyFilter !== "all") {
        try {
          const res = await fetch(
            `/api/major/getMajorsByFaculty?facultyId=${facultyFilter}`
          );
          if (!res.ok) throw new Error("Failed to fetch majors");
          const data = await res.json();
          setMajors(data);
        } catch (error) {
          console.error("Error fetching majors:", error);
          setMajors([]);
        }
      } else {
        setMajors([]);
      }
    };

    fetchMajors();
  }, [facultyFilter]);

  // Filter voter elections based on selected filters
  const filteredVoterElections = useMemo(() => {
    return voterElections.filter((ve) => {
      // Search filter
      const matchesSearch = searchQuery
        ? `${ve.voter?.name || ""} ${ve.voter?.email || ""} ${
            ve.voter?.voterCode || ""
          } ${ve.election?.title || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      // Status filter
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "eligible"
          ? ve.isEligible
          : statusFilter === "ineligible"
          ? !ve.isEligible
          : statusFilter === "voted"
          ? ve.hasVoted
          : statusFilter === "not_voted"
          ? !ve.hasVoted
          : true;

      // Election filter
      const matchesElection =
        electionFilter === "all" ? true : ve.election?.id === electionFilter;

      // Faculty filter - skip if no faculty data available
      const matchesFaculty = facultyFilter === "all" ? true : true; // We don't have faculty data in the API response

      // Major filter - skip if no major data available
      const matchesMajor = majorFilter === "all" ? true : true; // We don't have major data in the API response

      // Year filter - skip if no year data available
      const matchesYear = yearFilter === "all" ? true : true; // We don't have year data in the API response

      return (
        matchesSearch &&
        matchesStatus &&
        matchesElection &&
        matchesFaculty &&
        matchesMajor &&
        matchesYear
      );
    });
  }, [
    voterElections,
    searchQuery,
    statusFilter,
    electionFilter,
    facultyFilter,
    majorFilter,
    yearFilter,
  ]);

  // Fetch voter elections data from API
  useEffect(() => {
    const fetchVoterElections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/voterElection/getAllVoterElection");
        if (!response.ok) {
          throw new Error("Failed to fetch voting rights data");
        }
        const data = await response.json();
        setVoterElections(data);
      } catch (error) {
        console.error("Error fetching voting rights:", error);
        setError("Tidak ada data hak pilih");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoterElections();
  }, [dataChanged]);

  // Paginate voter elections
  const paginatedVoterElections = filteredVoterElections.slice(
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
    if (
      page >= 1 &&
      page <= Math.ceil(filteredVoterElections.length / rowsPerPage)
    ) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle delete voter election
  const handleDeleteVoterElections = async () => {
    try {
      setIsDeleting(true);

      // If deleting a single voter election
      if (selectedVoterElection) {
        setDeletingId(selectedVoterElection.id);

        const response = await fetch(
          `/api/voterElection/deleteVoterElection?id=${selectedVoterElection.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete voting right");
        }

        const result = await response.json();

        // Reset state
        setIsDeleteDialogOpen(false);
        setSelectedVoterElection(null);
        setSelectedVoterElections([]);

        // Refresh data
        setDataChanged((prev) => !prev);

        // Show success toast
        toast.success("Berhasil", {
          description: `Hak pilih untuk ${result.voterName} telah dihapus.`,
        });
      }
      // If deleting multiple voter elections
      else if (selectedVoterElections.length > 0) {
        const response = await fetch(
          "/api/voterElection/deleteVoterElections",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: selectedVoterElections }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete voting rights");
        }

        const result = await response.json();

        // Reset state
        setIsDeleteDialogOpen(false);
        setSelectedVoterElection(null);
        setSelectedVoterElections([]);

        // Refresh data
        setDataChanged((prev) => !prev);

        // Show success toast
        toast.success("Berhasil", {
          description: `${result.deletedCount} hak pilih telah dihapus.`,
        });
      }
    } catch (error) {
      console.error("Error deleting voting right(s):", error);
      toast.error("Gagal", {
        description:
          error.message || "Gagal menghapus hak pilih. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Calculate statistics
  const totalVoterElections = voterElections.length;
  const filteredVoterElectionsLength = filteredVoterElections.length;
  const eligibleVoters = voterElections.filter((ve) => ve.isEligible).length;
  const ineligibleVoters = totalVoterElections - eligibleVoters;
  const votedVoters = voterElections.filter((ve) => ve.hasVoted).length;
  const notVotedVoters = totalVoterElections - votedVoters;

  // Calculate percentages
  const eligiblePercentage =
    totalVoterElections > 0
      ? Math.round((eligibleVoters / totalVoterElections) * 100)
      : 0;
  const votedPercentage =
    totalVoterElections > 0
      ? Math.round((votedVoters / totalVoterElections) * 100)
      : 0;
  const ineligiblePercentage =
    totalVoterElections > 0
      ? Math.round((ineligibleVoters / totalVoterElections) * 100)
      : 0;
  const notVotedPercentage =
    totalVoterElections > 0
      ? Math.round((notVotedVoters / totalVoterElections) * 100)
      : 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 px-4 sm:px-6 md:px-8"
          >
            <VotingRightsStats
              voterElections={voterElections}
              totalVoterElections={totalVoterElections}
              filteredVoterElections={filteredVoterElectionsLength}
              eligibleVoters={eligibleVoters}
              ineligibleVoters={ineligibleVoters}
              votedVoters={votedVoters}
              notVotedVoters={notVotedVoters}
              eligiblePercentage={eligiblePercentage}
              ineligiblePercentage={ineligiblePercentage}
              votedPercentage={votedPercentage}
              notVotedPercentage={notVotedPercentage}
            />

            <Card className="shadow-md border-muted-foreground/10">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-primary" />
                    Manajemen Hak Pilih
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Mengelola hak pilih pemilih untuk setiap pemilu
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
                    facultyFilter={facultyFilter}
                    setFacultyFilter={setFacultyFilter}
                    majorFilter={majorFilter}
                    setMajorFilter={setMajorFilter}
                    yearFilter={yearFilter}
                    setYearFilter={setYearFilter}
                    elections={elections}
                    faculties={faculties}
                    majors={majors}
                    years={years}
                    activeFilters={activeFilters}
                    clearFilters={clearFilters}
                  />
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="gap-1 bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
                    disabled={isDeleting}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Hak Pilih
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedVoterElections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-between bg-primary/5 p-3 rounded-md border border-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {selectedVoterElections.length} hak pilih dipilih
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

                <VotingRightsTable
                  voterElections={paginatedVoterElections}
                  isLoading={isLoading}
                  selectedVoterElections={selectedVoterElections}
                  onSelectVoterElection={(id, checked) => {
                    if (checked) {
                      // Add the ID if it's not already in the array
                      setSelectedVoterElections((prev) =>
                        prev.includes(id) ? prev : [...prev, id]
                      );
                    } else {
                      // Remove the ID if it's in the array
                      setSelectedVoterElections((prev) =>
                        prev.filter((v) => v !== id)
                      );
                    }
                  }}
                  onSelectAll={(checked) =>
                    setSelectedVoterElections(
                      checked ? paginatedVoterElections.map((v) => v.id) : []
                    )
                  }
                  onEdit={(voterElection) => {
                    setSelectedVoterElection(voterElection);
                    setIsModalOpen(true);
                  }}
                  onDelete={(voterElection) => {
                    setSelectedVoterElection(voterElection);
                    setIsDeleteDialogOpen(true);
                  }}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  error={error}
                  isDeleting={isDeleting}
                  deletingId={deletingId}
                />

                {/* Pagination and Rows Per Page */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
                      <span className="text-sm font-medium text-muted-foreground">
                        Tampilkan
                      </span>
                      <Select
                        defaultValue="10"
                        onValueChange={handleRowsPerPageChange}
                      >
                        <SelectTrigger className="w-[px] h-7 text-sm border-1 bg-transparent p-2 focus:ring-0">
                          <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="40">40</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-md border border-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {filteredVoterElectionsLength}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        dari
                      </span>
                      <span className="text-sm font-medium">
                        {totalVoterElections}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        hak pilih
                      </span>
                    </div>
                  </div>

                  <Pagination className="flex items-center justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8 p-0"
                        />
                      </PaginationItem>
                      {Array.from(
                        {
                          length: Math.min(
                            Math.ceil(
                              filteredVoterElectionsLength / rowsPerPage
                            ),
                            5
                          ),
                        },
                        (_, index) => {
                          const page = index + 1;
                          const isCurrentPage = currentPage === page;

                          return (
                            <PaginationItem key={index}>
                              <PaginationLink
                                isActive={isCurrentPage}
                                onClick={() => handlePageChange(page)}
                                className={cn(
                                  "h-8 w-8 p-0",
                                  isCurrentPage && "bg-primary"
                                )}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage ===
                            Math.ceil(
                              filteredVoterElectionsLength / rowsPerPage
                            )
                          }
                          className="h-8 w-8 p-0"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Voting Rights Form Modal */}
      <VotingRightsForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVoterElection(null);
        }}
        onSave={(formData) => {
          setIsModalOpen(false);
          setDataChanged((prev) => !prev);
          if (selectedVoterElection) {
            setVoterElections((prev) =>
              prev.map((ve) =>
                ve.id === formData.id ? { ...ve, ...formData } : ve
              )
            );
          } else {
            setVoterElections((prev) => [...prev, formData]);
          }
          setSelectedVoterElection(null);
        }}
        voterElection={selectedVoterElection}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedVoterElection(null);
        }}
        onConfirm={handleDeleteVoterElections}
        count={selectedVoterElections.length}
        voterName={selectedVoterElection?.voter.name}
        type="voting-right"
      />

      {/* Global loading modal for bulk operations */}
      <LoadingModal
        isOpen={isDeleting && !selectedVoterElection}
        message={
          selectedVoterElections.length > 0
            ? `Menghapus ${selectedVoterElections.length} hak pilih...`
            : "Memproses permintaan..."
        }
      />
    </div>
  );
}
