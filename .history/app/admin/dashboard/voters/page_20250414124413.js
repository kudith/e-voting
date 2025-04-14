"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import VoterForm from "@/components/admin/voters/VotersForm";
import VotersTable from "@/components/admin/voters/VotersTable";
import SearchAndFilter from "@/components/admin/voters/SearchAndFilter";
import DeleteConfirmation from "@/components/admin/voters/DeleteConfirmation";
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

export default function VotersPage() {
  // State for voters data
  const [voters, setVoters] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch voters data from API
  useEffect(() => {
    const fetchVoters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/voter/getAllVoters");
        if (!response.ok) {
          throw new Error("Failed to fetch voters data");
        }
        const data = await response.json();
        setVoters(data);
      } catch (error) {
        console.error("Error fetching voters:", error);
        setError("Tidak ada data pemilih");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoters();
  }, [dataChanged]);

  // Filter and sort voters
  const getFilteredAndSortedVoters = () => {
    let filteredData = [...voters];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(
        (voter) =>
          voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voter.voterCode.includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter((voter) =>
        statusFilter === "Voted" ? voter.voted === true : voter.voted === false
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

  // Paginate voters
  const paginatedVoters = getFilteredAndSortedVoters().slice(
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
    if (page >= 1 && page <= Math.ceil(voters.length / rowsPerPage)) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Manajemen Pemilih
              </CardTitle>
              <CardDescription>
                Mengelola pemilih yang terdaftar untuk pemilu
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
                Add Vote
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedVoters.length > 0 && (
              <div className="mb-4 flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">
                  {selectedVoters.length} voters selected
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

            <VotersTable
              voters={paginatedVoters}
              isLoading={isLoading}
              selectedVoters={selectedVoters}
              onSelectVoter={(id, checked) =>
                setSelectedVoters((prev) =>
                  checked ? [...prev, id] : prev.filter((v) => v !== id)
                )
              }
              onSelectAll={(checked) =>
                setSelectedVoters(
                  checked ? paginatedVoters.map((v) => v.id) : []
                )
              }
              onEdit={(voter) => {
                setSelectedVoter(voter); // Pastikan voter diterima dan disimpan di state
                setIsModalOpen(true); // Buka modal untuk mengedit voter
              }}
              onDelete={(voter) => {
                setSelectedVoter(voter);
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
                        getFilteredAndSortedVoters().length / rowsPerPage
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
                          getFilteredAndSortedVoters().length / rowsPerPage
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

      {/* Voter Form Modal */}
      <VoterForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVoter(null); // Reset selected voter saat modal ditutup
        }}
        onSave={(formData) => {
          setIsModalOpen(false);
          setDataChanged((prev) => !prev); // Trigger re-fetch data
          if (selectedVoter) {
            // Update voter di state jika edit mode
            setVoters((prev) =>
              prev.map((voter) =>
                voter.id === formData.id ? { ...voter, ...formData } : voter
              )
            );
          } else {
            // Tambahkan voter baru ke state jika add mode
            setVoters((prev) => [...prev, formData]);
          }
          setSelectedVoter(null); // Reset selected voter
        }}
        voter={selectedVoter}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          setVoters((prev) =>
            prev.filter((voter) => !selectedVoters.includes(voter.id))
          );
          toast("Voters deleted", {
            description: `${selectedVoters.length} voters have been removed.`,
          });
          setIsDeleteDialogOpen(false);
          setSelectedVoters([]);
        }}
        count={selectedVoters.length}
        voterName={selectedVoter?.name}
      />
    </div>
  );
}
