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
          candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.candidateCode?.includes(searchQuery)
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

  // Function to create a new candidate
  const createCandidate = async (formData) => {
    try {
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
        onClose={() => setIsModalOpen(false)}
        onSave={(formData) => {
          if (selectedCandidate) {
            // Update candidate logic
          } else {
            createCandidate(formData); // Call createCandidate function
          }
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
}