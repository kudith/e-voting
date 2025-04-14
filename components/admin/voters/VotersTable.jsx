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
} from "lucide-react";

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
  error, // Tambahkan properti error
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
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  // Simple fade-in animation for the table
  const tableAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-md border overflow-hidden max-w-7xl"
    >
      <div className="overflow-x-auto">
        <Table>
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
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Nama
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("voterCode")}
              >
                <div className="flex items-center">
                  Kode Voter
                  {getSortIcon("voterCode")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("phone")}
              >
                <div className="flex items-center">
                  Nomor Telepon
                  {getSortIcon("phone")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("fakultas")}
              >
                <div className="flex items-center">
                  Fakultas
                  {getSortIcon("fakultas")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("jurusan")}
              >
                <div className="flex items-center">
                  Jurusan
                  {getSortIcon("jurusan")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("angkatan")}
              >
                <div className="flex items-center">
                  Angkatan
                  {getSortIcon("angkatan")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
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
                  No voters found
                </TableCell>
              </TableRow>
            ) : (
              voters.map((voter) => (
                <TableRow
                  key={voter.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedVoters.includes(voter.id)}
                      onCheckedChange={(checked) =>
                        onSelectVoter(voter.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{voter.name}</TableCell>
                  <TableCell>{voter.email}</TableCell>
                  <TableCell>{voter.voterCode}</TableCell>
                  <TableCell>{voter.phone}</TableCell>
                  <TableCell>{voter.faculty?.name}</TableCell>
                  <TableCell>{voter.major?.name}</TableCell>
                  <TableCell>{voter.year}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        Array.isArray(voter.voterElections) &&
                        voter.voterElections.some((ve) => ve.hasVoted)
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
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
                      <ul className="list-disc pl-4">
                        {voter.voterElections.map((ve) => (
                          <li key={ve.id}>
                            {ve.election?.title || "Unknown Election"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Elections"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(voter)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(voter)}
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
