"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X, Vote, GraduationCap, Building2, BookOpen, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  electionFilter,
  setElectionFilter,
  facultyFilter,
  setFacultyFilter,
  majorFilter,
  setMajorFilter,
  yearFilter,
  setYearFilter,
  elections,
  faculties,
  majors,
  years,
  activeFilters,
  clearFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters (excluding search query)
  const activeFilterCount = [
    electionFilter !== "all",
    facultyFilter !== "all",
    majorFilter !== "all",
    yearFilter !== "all",
  ].filter(Boolean).length;
  
  // Get election title for display
  const getElectionTitle = (id) => {
    if (!id || id === "all") return "";
    const election = elections?.find(e => e.id === id);
    return election?.title || "";
  };
  
  // Get faculty name for display
  const getFacultyName = (id) => {
    if (!id || id === "all") return "";
    const faculty = faculties?.find(f => f.id === id);
    return faculty?.name || "";
  };
  
  // Get major name for display
  const getMajorName = (id) => {
    if (!id || id === "all") return "";
    const major = majors?.find(m => m.id === id);
    return major?.name || "";
  };
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari hak pilih..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Hak Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="eligible">Memenuhi Syarat</SelectItem>
              <SelectItem value="ineligible">Tidak Memenuhi Syarat</SelectItem>
              <SelectItem value="voted">Sudah Memilih</SelectItem>
              <SelectItem value="not_voted">Belum Memilih</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Lanjutan</h4>
                  <p className="text-sm text-muted-foreground">
                    Pilih filter tambahan untuk mempersempit hasil pencarian
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Vote className="h-4 w-4 text-primary" />
                      Pemilu
                    </label>
                    <Select value={electionFilter} onValueChange={setElectionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pemilu">
                          {electionFilter !== "all" ? getElectionTitle(electionFilter) : "Pilih Pemilu"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Pemilu</SelectItem>
                        {elections?.map((election) => (
                          <SelectItem key={election.id} value={election.id}>
                            {election.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Fakultas
                    </label>
                    <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Fakultas">
                          {facultyFilter !== "all" ? getFacultyName(facultyFilter) : "Pilih Fakultas"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Fakultas</SelectItem>
                        {faculties?.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Program Studi
                    </label>
                    <Select value={majorFilter} onValueChange={setMajorFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Program Studi">
                          {majorFilter !== "all" ? getMajorName(majorFilter) : "Pilih Program Studi"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Program Studi</SelectItem>
                        {majors?.map((major) => (
                          <SelectItem key={major.id} value={major.id}>
                            {major.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Tahun Angkatan
                    </label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tahun Angkatan">
                          {yearFilter !== "all" ? yearFilter : "Pilih Tahun Angkatan"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        {years?.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hapus Semua Filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {electionFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Pemilu: {getElectionTitle(electionFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setElectionFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {facultyFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Fakultas: {getFacultyName(facultyFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setFacultyFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {majorFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Prodi: {getMajorName(majorFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setMajorFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {yearFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Tahun: {yearFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setYearFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 