import Link from "next/link";
import { CalendarDays, Clock, Users, Award, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function ElectionCard({ election }) {
  if (!election) return null;
  
  // Format dates for display
  const startDate = formatDate(election.startDate);
  const endDate = formatDate(election.endDate);
  
  // Determine status badge style
  const getBadgeVariant = (status) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "UPCOMING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Get status text for display
  const getStatusText = (status) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Aktif";
      case "COMPLETED":
        return "Selesai";
      case "UPCOMING":
        return "Akan Datang";
      default:
        return status;
    }
  };

  // Calculate participation percentage
  const participationPercent = election.participation?.percentage || "0.00";

  return (
    <Card className="overflow-hidden border border-muted-foreground/20 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-lg font-bold">{election.title}</CardTitle>
          <Badge className={getBadgeVariant(election.status)}>
            {getStatusText(election.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="text-sm line-clamp-2 text-muted-foreground mb-3">
            {election.description}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Mulai:</span>
              <span>{startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Selesai:</span>
              <span>{endDate}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-4 bg-primary/5 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <Vote className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{election.totalVotes || 0} Suara</span>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{participationPercent}%</span>
              </div>
            </div>

            {election.winner && (
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                <span className="text-sm font-medium truncate">{election.winner.name}</span>
                <span className="ml-auto text-xs font-medium">{election.winner.percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-3">
        <Link href={`/admin/dashboard/monitoring/${election.id}`} className="w-full">
          <Button variant="outline" className="w-full bg-white hover:bg-primary hover:text-white transition-colors dark:bg-card">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 