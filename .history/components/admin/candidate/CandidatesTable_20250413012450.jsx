"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function CandidatesTable({
  candidates,
  isLoading,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  error,
}) {
  const allSelected =
    candidates.length > 0 &&
    candidates.every((candidate) => selectedCandidates.includes(candidate.id));

  const someSelected =
    candidates.length > 0 &&
    candidates.some((candidate) => selectedCandidates.includes(candidate.id)) &&
    !allSelected;

  // Function to get the appropriate sort icon
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const tableAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-md border overflow-hidden"
    >
      <div className="overflow-x-auto">
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected || undefined}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>Photo</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("mission")}
              >
                <div className="flex items-center">
                  Mission
                  {getSortIcon("mission")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("shortBio")}
              >
                <div className="flex items-center">
                  Short Bio
                  {getSortIcon("shortBio")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("voteCount")}
              >
                <div className="flex items-center">
                  Vote Count
                  {getSortIcon("voteCount")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("electionId")}
              >
                <div className="flex items-center">
                  Election ID
                  {getSortIcon("electionId")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : candidates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) =>
                        onSelectCandidate(candidate.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {candidate.name}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-[200px]">
                    {candidate.mission}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-[300px]">
                    {candidate.shortBio}
                  </TableCell>
                  <TableCell>{candidate.voteCount}</TableCell>
                  <TableCell className="whitespace-normal break-words max-w-[200px]">
                    {candidate.election ? String(candidate.election.id) : "N/A"}{" "}
                    {/* Safely access election.id */}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(candidate)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(candidate)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
