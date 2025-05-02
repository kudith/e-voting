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
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Vote, Calendar, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

// Function to format dates with time
const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const formattedDate = format(date, "dd MMMM yyyy", { locale: id });
    const formattedTime = format(date, "HH:mm", { locale: id });
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    return { date: dateString, time: "" };
  }
};

// Function to check if dates are on the same day
const isSameDay = (startDate, endDate) => {
  try {
    return format(new Date(startDate), "dd MMMM yyyy") === format(new Date(endDate), "dd MMMM yyyy");
  } catch (error) {
    return false;
  }
};

// Function to get time duration in hours
const getDurationInHours = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return Math.round(diffInHours);
  } catch (error) {
    return 0;
  }
};

// Function to get relative time status
const getTimeStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    const daysToStart = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return `Dimulai dalam ${daysToStart} hari`;
  } else if (now > end) {
    const daysAgo = Math.ceil((now - end) / (1000 * 60 * 60 * 24));
    return `Berakhir ${daysAgo} hari yang lalu`;
  } else {
    const hoursLeft = Math.ceil((end - now) / (1000 * 60 * 60));
    return `${hoursLeft} jam tersisa`;
  }
};

// Function to get status in Indonesian
const getStatusInIndonesian = (status) => {
  switch (status) {
    case "ongoing":
      return "Sedang Berlangsung";
    case "completed":
      return "Selesai";
    case "upcoming":
      return "Akan Datang";
    default:
      return status;
  }
};

// Function to get status badge color
const getStatusBadgeColor = (status) => {
  switch (status) {
    case "ongoing":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    case "upcoming":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
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
  isDeleting,
  deletingId,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalElections,
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

  // Enhanced animations for the table
  const tableAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.05
      } 
    },
  };

  const rowAnimation = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
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
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected ? "true" : undefined}
                    onCheckedChange={onSelectAll}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center">
                    <Vote className="h-4 w-4 mr-2 text-muted-foreground" />
                    Judul {getSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("description")}
                >
                  <div className="flex items-center">
                    Deskripsi {getSortIcon("description")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("startDate")}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Periode {getSortIcon("startDate")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("status")}
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
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-red-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <p className="font-medium">{error}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : elections.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Vote className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-lg font-medium">Tidak ada pemilu ditemukan</p>
                      <p className="text-sm text-muted-foreground">Coba sesuaikan pencarian atau filter Anda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                elections.map((election) => (
                  <TableRow
                    key={election.id}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                      selectedElections.includes(election.id) && "bg-muted/30"
                    )}
                  >
                    <TableCell>
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <Checkbox
                          checked={selectedElections.includes(election.id)}
                          onCheckedChange={(checked) =>
                            onSelectElection(election.id, checked)
                          }
                          className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
                        />
                      </motion.div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <div className="flex flex-col">
                          <span>{election.title}</span>
                        </div>
                      </motion.div>
                    </TableCell>
                    <TableCell className="whitespace-normal break-words max-w-[300px]">
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        {election.description}
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <div className="flex flex-col space-y-1.5">
                          {isSameDay(election.startDate, election.endDate) ? (
                            // Single day election
                            <>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <span className="text-sm font-medium">
                                  {formatDateTime(election.startDate).date}
                                </span>
                              </div>
                              <div className="flex items-center text-muted-foreground text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {formatDateTime(election.startDate).time} - {formatDateTime(election.endDate).time} WIB
                                </span>
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                                  {getDurationInHours(election.startDate, election.endDate)} jam
                                </span>
                              </div>
                            </>
                          ) : (
                            // Multi-day election
                            <>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-sm">Mulai: {formatDateTime(election.startDate).date}</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground ml-5">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Pukul {formatDateTime(election.startDate).time} WIB</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-sm">Selesai: {formatDateTime(election.endDate).date}</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground ml-5">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Pukul {formatDateTime(election.endDate).time} WIB</span>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="text-xs">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                election.status === "ongoing" && "bg-green-50 text-green-700 border-green-200",
                                election.status === "upcoming" && "bg-blue-50 text-blue-700 border-blue-200",
                                election.status === "completed" && "bg-gray-50 text-gray-700 border-gray-200"
                              )}
                            >
                              {getTimeStatus(election.startDate, election.endDate)}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <Badge
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
                            getStatusBadgeColor(election.status)
                          )}
                        >
                          {getStatusInIndonesian(election.status)}
                        </Badge>
                      </motion.div>
                    </TableCell>
                    <TableCell className="text-right">
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
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
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit pemilu</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDelete(election)}
                                  disabled={isDeleting}
                                  className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer"
                                >
                                  {isDeleting && deletingId === election.id ? (
                                    <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hapus pemilu</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
            <span className="text-sm font-medium text-muted-foreground">
              Tampilkan
            </span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => onRowsPerPageChange(Number(value))}
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
              {elections.length}
            </span>
            <span className="text-sm text-muted-foreground">
              dari
            </span>
            <span className="text-sm font-medium">
              {totalElections}
            </span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              pemilu
            </span>
          </div>
        </div>

        <Pagination className="flex items-center justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              />
            </PaginationItem>
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, index) => {
                const page = index + 1;
                const isCurrentPage = currentPage === page;

                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={isCurrentPage}
                      onClick={() => onPageChange(page)}
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
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
}
