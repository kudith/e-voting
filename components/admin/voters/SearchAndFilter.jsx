"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-3 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pemilih..."
          className={cn(
            "pl-8 w-full transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20",
            "border-muted-foreground/20 hover:border-muted-foreground/40"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={cn(
            "w-full sm:w-[180px] pl-8",
            "transition-all duration-200",
            "border-muted-foreground/20 hover:border-muted-foreground/40"
          )}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Voted">Sudah Memilih</SelectItem>
            <SelectItem value="Not Voted">Belum Memilih</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
