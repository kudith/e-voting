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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// Function to format dates
const formatDate = (dateString, format = "dd-mm-yyyy") => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  if (format === "dd-mm-yyyy") {
    return `${day}-${month}-${year}`;
  } else if (format === "yyyy-mm-dd") {
    return `${year}-${month}-${day}`;
  }
  return dateString;
};

export default function ElectionTable({
  elections,
  isLoading,
  selectedElections,
  onSelectElection,
  onSelectAll,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  error,
}) {
  const allSelected =
    elections.length > 0 &&
    elections.every((election) => selectedElections.includes(election.id));

  const someSelected =
    elections.length > 0 &&
    elections.some((election) => selectedElections.includes(election.id)) &&
    !allSelected;

  // Function to get the appropriate sort icon
  const getSortIcon = (columnName) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 text-primary" />
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
              <TableHead
                onClick={() => requestSort("title")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Judul {getSortIcon("title")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => requestSort("description")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Deskripsi {getSortIcon("description")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => requestSort("startDate")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Tanggal Mulai {getSortIcon("startDate")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => requestSort("endDate")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Tanggal Selesai {getSortIcon("endDate")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => requestSort("status")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : elections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  No elections found
                </TableCell>
              </TableRow>
            ) : (
              elections.map((election) => (
                <TableRow
                  key={election.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedElections.includes(election.id)}
                      onCheckedChange={(checked) =>
                        onSelectElection(election.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {election.title}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-[300px]">
                    {election.description}
                  </TableCell>
                  <TableCell>{formatDate(election.startDate)}</TableCell>
                  <TableCell>{formatDate(election.endDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        election.status === "active" ? "success" : "secondary"
                      }
                      className={`px-2 py-1 text-xs font-medium ${
                        election.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {election.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(election)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(election)}
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
