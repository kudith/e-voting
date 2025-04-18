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
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ElectionTable({
  elections,
  isLoading,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  error,
  isDeleting,
  deletingElectionId,
}) {
  // Get sort icon for column
 const getSortIcon = (columnName) => {
   if (!sortConfig || !sortConfig.key || sortConfig.key !== columnName) {
     return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
   }
   return sortConfig.direction === "ascending" ? (
     <ArrowUp className="h-4 w-4 ml-1 text-primary" />
   ) : (
     <ArrowDown className="h-4 w-4 ml-1 text-primary" />
   );
 };
 const [sortConfig, setSortConfig] = useState({
   key: null, // Kolom default (atau null jika tidak ada)
   direction: "ascending", // Arah default
 });

  // Enhanced animations for the table
  const tableAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const rowAnimation = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-md border shadow-sm bg-card overflow-hidden"
    >
      <div className="relative w-full">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    {getSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("description")}
                >
                  <div className="flex items-center">
                    Description
                    {getSortIcon("description")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("startDate")}
                >
                  <div className="flex items-center">
                    Start Date
                    {getSortIcon("startDate")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("endDate")}
                >
                  <div className="flex items-center">
                    End Date
                    {getSortIcon("endDate")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-red-500"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : elections.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">No elections found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                elections.map((election) => (
                  <motion.tr
                    key={election.id}
                    variants={rowAnimation}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50"
                    )}
                  >
                    <TableCell className="font-medium">
                      {election.title}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {election.description}
                    </TableCell>
                    <TableCell>{election.startDate}</TableCell>
                    <TableCell>{election.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          election.status === "active" ? "success" : "secondary"
                        }
                        className={cn(
                          "px-2 py-1 text-xs font-medium transition-all duration-200",
                          election.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
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
                          disabled={isDeleting}
                          className="hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(election)}
                          disabled={isDeleting}
                          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer"
                        >
                          {isDeleting && deletingElectionId === election.id ? (
                            <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
