"use client";

import { useState } from "react";
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
import {
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  User,
  Eye,
  Target,
  Info,
  Gavel,
  VoteIcon,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CandidateDetailView from "./CandidateDetailView";

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
  isDeleting,
  deletingCandidateId,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalCandidates
}) {
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);

  // Check if all visible candidates are selected
  const allSelected =
    candidates.length > 0 &&
    candidates.every((candidate) => selectedCandidates.includes(candidate.id));

  // Check if some but not all candidates are selected
  const someSelected =
    candidates.length > 0 &&
    candidates.some((candidate) => selectedCandidates.includes(candidate.id)) &&
    !allSelected;

  // Get sort icon for column
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
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

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className={cn(
              "h-8 w-8 p-0",
              currentPage === i && "bg-primary"
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const handleViewDetails = (candidate) => {
    setViewingCandidate(candidate);
    setDetailViewOpen(true);
  };

  return (
    <div className="space-y-4">
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
                      indeterminate={someSelected ? true : undefined}
                      onCheckedChange={onSelectAll}
                      className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Foto</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Nama
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("vision")}
                  >
                    <div className="flex items-center">
                      Visi
                      {getSortIcon("vision")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("mission")}
                  >
                    <div className="flex items-center">
                      Misi
                      {getSortIcon("mission")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors w-[100px]"
                    onClick={() => requestSort("voteCount")}
                  >
                    <div className="flex items-center">
                      Suara
                      {getSortIcon("voteCount")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("electionId")}
                  >
                    <div className="flex items-center">
                      Pemilihan
                      {getSortIcon("electionId")}
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">Detail</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-10 text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : candidates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-10 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-lg font-medium">Tidak ada kandidat ditemukan</p>
                        <p className="text-sm text-muted-foreground">Coba sesuaikan pencarian atau filter Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((candidate, index) => (
                    <motion.tr
                      key={candidate.id}
                      variants={rowAnimation}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                        selectedCandidates.includes(candidate.id) && "bg-muted/30"
                      )}
                    >
                      <TableCell>
                        {isDeleting && deletingCandidateId === candidate.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Checkbox
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={(checked) =>
                              onSelectCandidate(candidate.id, checked)
                            }
                            className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="relative w-14 h-14 rounded-full overflow-hidden">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {candidate.name}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words max-w-[180px]">
                        {candidate.vision}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words max-w-[200px]">
                        {candidate.mission}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {candidate.voteCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {candidate.election ? (
                          <Badge variant="outline" className="bg-muted/50">
                            {candidate.election.title}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500">
                            Tidak ada
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider>
                            {candidate.socialMedia && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">
                                    <Globe className="h-3 w-3" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Media Sosial</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {candidate.education?.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
                                    <GraduationCap className="h-3 w-3" />
                                    <span className="ml-0.5">{candidate.education.length}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{candidate.education.length} Pendidikan</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {candidate.experience?.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
                                    <Briefcase className="h-3 w-3" />
                                    <span className="ml-0.5">{candidate.experience.length}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{candidate.experience.length} Pengalaman</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {candidate.achievements?.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500 text-xs">
                                    <Award className="h-3 w-3" />
                                    <span className="ml-0.5">{candidate.achievements.length}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{candidate.achievements.length} Prestasi</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {candidate.programs?.length > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 text-xs">
                                    <MessageSquare className="h-3 w-3" />
                                    <span className="ml-0.5">{candidate.programs.length}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{candidate.programs.length} Program</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TooltipProvider>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(candidate)}
                            className="h-6 px-2 text-primary hover:text-primary/90 hover:bg-primary/10"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Lihat
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(candidate)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(candidate)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
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

      {/* Pagination */}
      {!isLoading && candidates.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
              <span className="text-sm font-medium text-muted-foreground">Tampilkan</span>
              <Select value={rowsPerPage?.toString() || "10"} onValueChange={onRowsPerPageChange}>
                <SelectTrigger className="h-7 text-sm border-0 bg-transparent p-2 focus:ring-0">
                  <SelectValue
                    placeholder={rowsPerPage || 10}
                    className="text-sm text-center"
                  />
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
              <span className="text-sm font-medium text-primary">{totalCandidates || 0}</span>
              <span className="text-sm text-muted-foreground">kandidat</span>
            </div>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="flex items-center justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === 1 && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === totalPages && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Candidate Detail View */}
      <CandidateDetailView
        isOpen={detailViewOpen}
        onClose={() => setDetailViewOpen(false)}
        candidate={viewingCandidate}
        onEdit={(candidate) => {
          setDetailViewOpen(false);
          onEdit(candidate);
        }}
      />
    </div>
  );
}
