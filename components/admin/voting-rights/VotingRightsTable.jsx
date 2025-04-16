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
  Calendar,
  Vote,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function VotingRightsTable({
  voterElections,
  isLoading,
  selectedVoterElections,
  onSelectVoterElection,
  onSelectAll,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  error,
  isDeleting,
  deletingId,
}) {
  // Check if all visible voter elections are selected
  const allSelected =
    voterElections.length > 0 &&
    voterElections.every((ve) => selectedVoterElections.includes(ve.id));

  // Check if some but not all voter elections are selected
  const someSelected =
    voterElections.length > 0 &&
    voterElections.some((ve) => selectedVoterElections.includes(ve.id)) &&
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

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
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
                  onClick={() => requestSort("voter.name")}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    Nama Pemilih
                    {getSortIcon("voter.name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("voter.email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("voter.email")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("voter.voterCode")}
                >
                  <div className="flex items-center">
                    Kode Voter
                    {getSortIcon("voter.voterCode")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("election.title")}
                >
                  <div className="flex items-center">
                    <Vote className="h-4 w-4 mr-2 text-muted-foreground" />
                    Nama Pemilu
                    {getSortIcon("election.title")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("election.startDate")}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Periode
                    {getSortIcon("election.startDate")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("isEligible")}
                >
                  <div className="flex items-center">
                    Status Kelayakan
                    {getSortIcon("isEligible")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("hasVoted")}
                >
                  <div className="flex items-center">
                    Status Memilih
                    {getSortIcon("hasVoted")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow key="loading-state">
                  <TableCell colSpan={10} className="text-center py-10">
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow key="error-state">
                  <TableCell
                    colSpan={10}
                    className="text-center py-10 text-red-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <p className="font-medium">{error}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : voterElections.length === 0 ? (
                <TableRow key="empty-state">
                  <TableCell
                    colSpan={10}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Vote className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-lg font-medium">Tidak ada hak pilih ditemukan</p>
                      <p className="text-sm text-muted-foreground">Coba sesuaikan pencarian atau filter Anda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                voterElections.map((voterElection, index) => (
                  <TableRow
                    key={voterElection?.id ? `voter-election-${voterElection.id}` : `voter-election-index-${index}`}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                      selectedVoterElections.includes(voterElection?.id) && "bg-muted/30"
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
                          checked={selectedVoterElections.includes(voterElection?.id)}
                          onCheckedChange={(checked) =>
                            onSelectVoterElection(voterElection?.id, checked)
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
                          <span>{voterElection.voter?.name || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">{voterElection.voter?.email || 'N/A'}</span>
                        </div>
                      </motion.div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        {voterElection.voter?.email || 'N/A'}
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <Badge variant="outline" className="font-mono text-[11px] bg-muted/30 border-muted-foreground/20 px-2 py-0.5">
                          {voterElection.voter?.voterCode || 'N/A'}
                        </Badge>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        variants={rowAnimation}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{voterElection.election?.title || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">
                            {voterElection.election?.status === "active" ? "Aktif" : 
                             voterElection.election?.status === "upcoming" ? "Akan Datang" : 
                             voterElection.election?.status === "ended" ? "Selesai" : voterElection.election?.status || 'N/A'}
                          </span>
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
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {voterElection.election?.startDate ? formatDate(voterElection.election.startDate) : 'N/A'} - {voterElection.election?.endDate ? formatDate(voterElection.election.endDate) : 'N/A'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {voterElection.election?.status === "active" ? "Sedang Berlangsung" : 
                             voterElection.election?.status === "upcoming" ? "Belum Dimulai" : 
                             voterElection.election?.status === "ended" ? "Sudah Selesai" : ""}
                          </span>
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
                            voterElection.isEligible
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {voterElection.isEligible ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Memenuhi Syarat
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-3 w-3" />
                              Tidak Memenuhi Syarat
                            </>
                          )}
                        </Badge>
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
                            voterElection.hasVoted
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          {voterElection.hasVoted ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Sudah Memilih
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-3 w-3" />
                              Belum Memilih
                            </>
                          )}
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
                                  onClick={() => onEdit(voterElection)}
                                  disabled={isDeleting}
                                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit hak pilih</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDelete(voterElection)}
                                  disabled={isDeleting}
                                  className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer"
                                >
                                  {isDeleting && deletingId === voterElection.id ? (
                                    <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hapus hak pilih</p>
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
    </motion.div>
  );
} 