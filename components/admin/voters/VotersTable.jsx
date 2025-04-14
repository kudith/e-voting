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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VotersTable({
  voters,
  isLoading,
  selectedVoters,
  onSelectVoter,
  onSelectAll,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  error,
  isDeleting,
  deletingVoterId,
}) {
  // Check if all visible voters are selected
  const allSelected =
    voters.length > 0 &&
    voters.every((voter) => selectedVoters.includes(voter.id));

  // Check if some but not all voters are selected
  const someSelected =
    voters.length > 0 &&
    voters.some((voter) => selectedVoters.includes(voter.id)) &&
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
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Nama
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("voterCode")}
                >
                  <div className="flex items-center">
                    Kode Voter
                    {getSortIcon("voterCode")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("phone")}
                >
                  <div className="flex items-center">
                    Nomor Telepon
                    {getSortIcon("phone")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("fakultas")}
                >
                  <div className="flex items-center">
                    Fakultas
                    {getSortIcon("fakultas")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("jurusan")}
                >
                  <div className="flex items-center">
                    Jurusan
                    {getSortIcon("jurusan")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("angkatan")}
                >
                  <div className="flex items-center">
                    Angkatan
                    {getSortIcon("angkatan")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("votingStatus")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("votingStatus")}
                  </div>
                </TableHead>
                <TableHead>Daftar Pemilu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-10 text-red-500"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : voters.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">Tidak ada pemilih ditemukan</p>
                      <p className="text-sm text-muted-foreground">Coba sesuaikan pencarian atau filter Anda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                voters.map((voter, index) => (
                  <motion.tr
                    key={voter.id}
                    variants={rowAnimation}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                      selectedVoters.includes(voter.id) && "bg-muted/30"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedVoters.includes(voter.id)}
                        onCheckedChange={(checked) =>
                          onSelectVoter(voter.id, checked)
                        }
                        className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{voter.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{voter.email}</TableCell>
                    <TableCell className="font-mono text-sm">{voter.voterCode}</TableCell>
                    <TableCell>{voter.phone}</TableCell>
                    <TableCell>{voter.faculty?.name}</TableCell>
                    <TableCell>{voter.major?.name}</TableCell>
                    <TableCell>{voter.year}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
                          Array.isArray(voter.voterElections) &&
                          voter.voterElections.some((ve) => ve.hasVoted)
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        )}
                      >
                        {Array.isArray(voter.voterElections) &&
                        voter.voterElections.some((ve) => ve.hasVoted) ? (
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
                      </span>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(voter.voterElections) &&
                      voter.voterElections.length > 0 ? (
                        <ul className="list-disc pl-4 max-h-20 overflow-y-auto">
                          {voter.voterElections.map((ve) => (
                            <li key={ve.id} className="text-sm">
                              {ve.election?.title || "Unknown Election"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground text-sm">Belum mengikuti pemilu</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(voter)}
                          disabled={isDeleting}
                          className="hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(voter)}
                          disabled={isDeleting}
                          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all duration-200 cursor-pointer"
                        >
                          {isDeleting && deletingVoterId === voter.id ? (
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
