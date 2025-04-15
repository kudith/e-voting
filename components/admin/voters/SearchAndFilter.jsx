"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Calendar,
  SlidersHorizontal
} from "lucide-react";
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
  fakultasFilter,
  setFakultasFilter,
  jurusanFilter,
  setJurusanFilter,
  angkatanFilter,
  setAngkatanFilter,
  faculties,
  majors,
  years,
  activeFilters,
  clearFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters (excluding search query)
  const activeFilterCount = activeFilters.length;
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pemilih..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Pemilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Voted">Sudah Memilih</SelectItem>
              <SelectItem value="NotVoted">Belum Memilih</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
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
                    <label className="text-sm font-medium">Fakultas</label>
                    <Select value={fakultasFilter} onValueChange={setFakultasFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Fakultas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Fakultas</SelectItem>
                        {faculties.map((faculty, index) => (
                          <SelectItem key={`faculty-${index}`} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jurusan</label>
                    <Select value={jurusanFilter} onValueChange={setJurusanFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jurusan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Jurusan</SelectItem>
                        {majors.map((major, index) => (
                          <SelectItem key={`major-${index}`} value={major.id}>
                            {major.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Angkatan</label>
                    <Select value={angkatanFilter} onValueChange={setAngkatanFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Angkatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Angkatan</SelectItem>
                        {years.map((year, index) => (
                          <SelectItem key={`year-${index}`} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {activeFilters.length > 0 && (
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
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map((filter, index) => (
              <motion.div
                key={`filter-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <span className="font-medium">{filter.label}:</span>
                  <span>{filter.value}</span>
                  <button
                    onClick={filter.onRemove}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
