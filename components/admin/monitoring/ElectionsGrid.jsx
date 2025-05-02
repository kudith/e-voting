import { motion } from "framer-motion";
import ElectionCard from "./ElectionCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ElectionsGrid({ elections, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <CardSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (!elections || elections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-muted-foreground/30 bg-muted/10">
        <p className="text-muted-foreground text-center">
          Tidak ada pemilihan yang tersedia. Mulai buat pemilihan baru untuk melihat hasilnya di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {elections.map((election, index) => (
        <motion.div
          key={election.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ElectionCard election={election} />
        </motion.div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="border border-muted-foreground/20 rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-primary/5">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        
        <Skeleton className="h-8 w-full mt-2" />
      </div>
      <div className="p-3 bg-muted/20">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
} 