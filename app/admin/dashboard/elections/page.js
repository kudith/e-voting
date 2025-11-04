"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import ElectionForm from "@/components/admin/elections/ElectionForm";
import ElectionTable from "@/components/admin/elections/ElectionTable";
import DeleteConfirmation from "@/components/admin/elections/DeleteConfirmation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchAndFilter from "@/components/admin/elections/searchAndFilter";

export default function ElectionsPage() {
  const [elections, setElections] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedElections, setSelectedElections] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElections, setTotalElections] = useState(0);

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/election/getAllElections");
        if (!res.ok) throw new Error("Failed to fetch elections");
        const data = await res.json();
        setElections(data);
        setTotalElections(data.length);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, [dataChanged]);

  const getFilteredAndSortedElections = () => {
    let filtered = [...elections];

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDateFilter) {
      const startFilterDate = new Date(startDateFilter);
      startFilterDate.setHours(0, 0, 0, 0); // Start of day
      filtered = filtered.filter(
        (e) => new Date(e.startDate) >= startFilterDate
      );
    }

    if (endDateFilter) {
      const endFilterDate = new Date(endDateFilter);
      endFilterDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((e) => new Date(e.endDate) <= endFilterDate);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // For date sorting
        if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
          return sortConfig.direction === "ascending"
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        }

        // For text sorting
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

  const filteredElections = getFilteredAndSortedElections();
  const totalPages = Math.ceil(filteredElections.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedElections = filteredElections.slice(startIndex, endIndex);

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const createElection = async (formData) => {
    try {
      const res = await fetch("/api/election/createElection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create election");

      toast.success(`Election "${formData.title}" created successfully.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error creating election:", err);
      toast.error("Failed to create election. Please try again.");
    }
  };

  const updateElection = async (formData) => {
    try {
      const res = await fetch("/api/election/updateElection", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update election");

      toast.success(`Election "${formData.title}" updated successfully.`);
      setIsModalOpen(false);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error updating election:", err);
      toast.error("Failed to update election. Please try again.");
    }
  };

  const deleteElection = async (id) => {
    try {
      const res = await fetch("/api/election/deleteElection", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!res.ok) throw new Error("Failed to delete election");

      toast.success("Election deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSelectedElection(null);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error deleting election:", err);
      toast.error("Failed to delete election. Please try again.");
    }
  };

  const bulkDeleteElections = async () => {
    try {
      const res = await fetch("/api/election/deleteElection", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedElections }),
      });

      if (!res.ok) throw new Error("Failed to delete elections");

      toast.success("Selected elections deleted successfully.");
      setIsBulkDeleteDialogOpen(false);
      setSelectedElections([]);
      setDataChanged((prev) => !prev);
    } catch (err) {
      console.error("Error deleting elections:", err);
      toast.error("Failed to delete elections. Please try again.");
    }
  };

  const handleSaveElection = (formData) => {
    if (selectedElection) {
      updateElection({ id: selectedElection.id, ...formData });
    } else {
      createElection(formData);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
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
                Manajemen Pemilihan
              </CardTitle>
              <CardDescription>
                Kelola data pemilihan dalam sistem Anda
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
                clearFilters={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
              />
              <Button
                onClick={() => {
                  setSelectedElection(null);
                  setIsModalOpen(true);
                }}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> Tambah Pemilihan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedElections.length > 0 && (
              <div className="mb-4 p-2 bg-red-50 rounded-md flex items-center justify-between">
                <span className="text-sm text-red-600">
                  {selectedElections.length} pemilihan dipilih
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                >
                  Hapus yang Dipilih
                </Button>
              </div>
            )}

            <ElectionTable
              elections={paginatedElections}
              isLoading={isLoading}
              selectedElections={selectedElections}
              onSelectElection={(id, checked) =>
                setSelectedElections((prev) =>
                  checked ? [...prev, id] : prev.filter((e) => e !== id)
                )
              }
              onSelectAll={(checked) =>
                setSelectedElections(
                  checked ? paginatedElections.map((e) => e.id) : []
                )
              }
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalElections={filteredElections.length}
            />
          </CardContent>
        </Card>

        <ElectionForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedElection(null);
          }}
          onSave={handleSaveElection}
          election={selectedElection}
        />

        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedElection(null);
          }}
          onConfirm={() =>
            selectedElection && deleteElection(selectedElection.id)
          }
          electionTitle={selectedElection?.title}
        />

        <DeleteConfirmation
          isOpen={isBulkDeleteDialogOpen}
          onClose={() => setIsBulkDeleteDialogOpen(false)}
          onConfirm={bulkDeleteElections}
          count={selectedElections.length}
        />
      </motion.div>
    </div>
  );
}
