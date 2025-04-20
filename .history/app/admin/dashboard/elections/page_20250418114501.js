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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedElections, setSelectedElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/election/getAllElections");
        if (!res.ok) throw new Error("Failed to fetch elections");
        const data = await res.json();
        setElections(data);
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

  const filteredElections = getFilteredAndSortedElections();

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
      const res = await fetch(`/api/election/deleteElection?id=${id}`, {
        method: "DELETE",
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

  const handleSaveElection = (formData) => {
    if (selectedElection) {
      updateElection({ id: selectedElection.id, ...formData });
    } else {
      createElection(formData);
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
                Election Management
              </CardTitle>
              <CardDescription>
                Manage elections for your system
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
                <Plus className="h-4 w-4" /> Add Election
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedElections.length > 0 && (
              <div className="mb-4 p-2 bg-red-50 rounded-md flex items-center justify-between">
                <span className="text-sm text-red-600">
                  {selectedElections.length} elections selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete ${selectedElections.length} elections?`
                      )
                    ) {
                      // Add bulk delete logic here
                    }
                  }}
                >
                  Delete Selected
                </Button>
              </div>
            )}

            <ElectionTable
              elections={filteredElections}
              isLoading={isLoading}
              selectedElections={selectedElections}
              onSelectElection={(id, checked) =>
                setSelectedElections((prev) =>
                  checked ? [...prev, id] : prev.filter((e) => e !== id)
                )
              }
              onSelectAll={(checked) =>
                setSelectedElections(
                  checked ? filteredElections.map((e) => e.id) : []
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
      </motion.div>
    </div>
  );
}
