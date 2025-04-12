"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import CandidatesForm from "@/components/admin/candidate/CandidatesForm";
import SearchAndFilter from "@/components/admin/candidates/SearchAndFilter";
import DeleteConfirmation from "@/components/admin/candidateskDeleteConfirmation";
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
import CandidatesTable from "@/components/admin/candidate/CandidatesTable";

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
        setError("Tidak ada data kandidat");
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
      filteredData = filteredData.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.candidateCode.includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter((candidate) =>
        statusFilter === "Active"
          ? candidate.active === true
          : candidate.active === false
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

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
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
              <CardDescription>
                Mengelola kandidat yang terdaftar untuk pemilu
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
            {selectedCandidates.length > 0 && (
              <div className="mb-4 flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">
                  {selectedCandidates.length} candidates selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Selected
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
            />
            {/* Pagination and Rows Per Page */}
            <div className="flex items-center justify-between mt-4">
              <Select onValueChange={handleRowsPerPageChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={`${rowsPerPage} rows`} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Pagination className={"flex items-center justify-end"}>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from(
                    {
                      length: Math.ceil(
                        getFilteredAndSortedCandidates().length / rowsPerPage
                      ),
                    },
                    (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          getFilteredAndSortedCandidates().length / rowsPerPage
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Candidate Form Modal */}
      <CandidatesForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(formData) => {
          if (selectedCandidate) {
            setCandidates((prev) =>
              prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                  ? { ...candidate, ...formData }
                  : candidate
              )
            );
            toast({
              title: "Candidate updated",
              description: `${formData.fullName}'s information has been updated.`,
            });
          } else {
            const newCandidate = { id: Date.now().toString(), ...formData };
            setCandidates((prev) => [...prev, newCandidate]);
            toast({
              title: "Candidate added",
              description: `${formData.fullName} has been added to the system.`,
            });
          }
          setIsModalOpen(false);
          setDataChanged((prev) => !prev);
        }}
        candidate={selectedCandidate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          setCandidates((prev) =>
            prev.filter(
              (candidate) => !selectedCandidates.includes(candidate.id)
            )
          );
          toast({
            title: "Candidates deleted",
            description: `${selectedCandidates.length} candidates have been removed.`,
          });
          setIsDeleteDialogOpen(false);
          setSelectedCandidates([]);
        }}
        count={selectedCandidates.length}
        candidateName={selectedCandidate?.name}
      />
    </div>
  );
}
