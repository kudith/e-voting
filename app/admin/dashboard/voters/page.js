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
import { Plus, Loader2, Users, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function VotersPage() {
  // State for voters data
  const [voters, setVoters] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingVoterId, setDeletingVoterId] = useState(null);
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
      filteredData = filteredData.filter((voter) => {
        const hasVoted = Array.isArray(voter.voterElections) && 
          voter.voterElections.some(ve => ve.hasVoted);
        
        return statusFilter === "Voted" ? hasVoted : !hasVoted;
      });
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

  // Tambahkan fungsi untuk menghapus voter
  const handleDeleteVoters = async () => {
    try {
      setIsDeleting(true);
      
      // Jika menghapus satu voter
      if (selectedVoter) {
        setDeletingVoterId(selectedVoter.id);
        
        const response = await fetch(`/api/voter/deleteVoter?id=${selectedVoter.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete voter');
        }

        const result = await response.json();
        
        // Reset state
        setIsDeleteDialogOpen(false);
        setSelectedVoter(null);
        setSelectedVoters([]);
        
        // Refresh data
        setDataChanged(prev => !prev);
        
        // Show success toast after operation completes
        toast.success("Berhasil", {
          description: `Pemilih ${result.voterName || selectedVoter.name} telah dihapus.`,
        });
      } 
      // Jika menghapus multiple voters
      else if (selectedVoters.length > 0) {
        // Gunakan endpoint bulk deletion
        const response = await fetch('/api/voter/deleteVoters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voterIds: selectedVoters }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete voters');
        }

        const result = await response.json();
        
        // Reset state
        setIsDeleteDialogOpen(false);
        setSelectedVoter(null);
        setSelectedVoters([]);
        
        // Refresh data
        setDataChanged(prev => !prev);
        
        // Show success toast after operation completes
        toast.success("Berhasil", {
          description: `${result.deletedCount} pemilih telah dihapus.`,
        });
      }
    } catch (error) {
      console.error('Error deleting voter(s):', error);
      toast.error("Gagal", {
        description: error.message || "Gagal menghapus pemilih. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingVoterId(null);
    }
  };

  // Calculate total voters and filtered voters
  const totalVoters = voters.length;
  const filteredVoters = getFilteredAndSortedVoters().length;
  const votedVoters = voters.filter(voter => 
    Array.isArray(voter.voterElections) && 
    voter.voterElections.some(ve => ve.hasVoted)
  ).length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
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
                      <p className="text-sm font-medium text-muted-foreground">Total Pemilih</p>
                      <h3 className="text-2xl font-bold">{totalVoters}</h3>
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
                      <p className="text-sm font-medium text-muted-foreground">Sudah Memilih</p>
                      <h3 className="text-2xl font-bold">{votedVoters}</h3>
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
                      <p className="text-sm font-medium text-muted-foreground">Belum Memilih</p>
                      <h3 className="text-2xl font-bold">{totalVoters - votedVoters}</h3>
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
                    Manajemen Pemilih
                  </CardTitle>
                  <CardDescription className="mt-1">
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
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="gap-1 bg-primary hover:bg-primary/90 transition-colors"
                    disabled={isDeleting}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Pemilih
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedVoters.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-between bg-primary/5 p-3 rounded-md border border-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {selectedVoters.length} pemilih dipilih
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
                    setSelectedVoter(voter);
                    setIsModalOpen(true);
                  }}
                  onDelete={(voter) => {
                    setSelectedVoter(voter);
                    setIsDeleteDialogOpen(true);
                  }}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  error={error}
                  isDeleting={isDeleting}
                  deletingVoterId={deletingVoterId}
                />
                
                {/* Pagination and Rows Per Page */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
                      <span className="text-sm font-medium text-muted-foreground">Tampilkan</span>
                      <Select onValueChange={handleRowsPerPageChange} defaultValue={rowsPerPage.toString()}>
                        <SelectTrigger className="w-[60px] h-7 text-sm border-0 bg-transparent p-0 focus:ring-0">
                          <SelectValue placeholder={rowsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                          {[10, 20, 30, 40, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-md border border-primary/10">
                      <span className="text-sm font-medium text-primary">{filteredVoters}</span>
                      <span className="text-sm text-muted-foreground">dari</span>
                      <span className="text-sm font-medium">{totalVoters}</span>
                      <span className="text-sm text-muted-foreground">pemilih</span>
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
                            Math.ceil(filteredVoters / rowsPerPage),
                            5
                          ),
                        },
                        (_, index) => {
                          // Show first page, last page, current page, and pages around current page
                          const page = index + 1;
                          const isCurrentPage = currentPage === page;
                          
                          return (
                            <PaginationItem key={index}>
                              <PaginationLink
                                href="#"
                                isActive={isCurrentPage}
                                onClick={() => handlePageChange(page)}
                                className={cn(
                                  "h-8 w-8 p-0",
                                  isCurrentPage && "bg-primary text-primary-foreground"
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
                            Math.ceil(filteredVoters / rowsPerPage)
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
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedVoter(null);
        }}
        onConfirm={handleDeleteVoters}
        count={selectedVoters.length}
        voterName={selectedVoter?.name}
      />

      {/* Global loading modal for bulk operations */}
      <LoadingModal 
        isOpen={isDeleting && !selectedVoter} 
        message={selectedVoters.length > 0 
          ? `Menghapus ${selectedVoters.length} pemilih...` 
          : "Memproses permintaan..."} 
      />
    </div>
  );
}
