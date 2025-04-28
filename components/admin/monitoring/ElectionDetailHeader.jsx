import { CalendarDays, Trophy, Vote, User, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ElectionDetailHeader({ election }) {
  if (!election) return null;

  // Format dates
  const startDate = formatDateTime(election.startDate);
  const endDate = formatDateTime(election.endDate);
  
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

  return (
    <div className="space-y-6">
      {/* Election Title and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{election.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{election.description}</p>
        </div>
        <Badge className={`${getBadgeVariant(election.status)} text-sm px-3 py-1`}>
          {getStatusText(election.status)}
        </Badge>
      </div>

      {/* Election Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tanggal Mulai</p>
            <p className="font-medium text-sm">{startDate}</p>
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tanggal Selesai</p>
            <p className="font-medium text-sm">{endDate}</p>
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Vote className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Suara</p>
            <p className="font-medium text-sm">{election.totalVotes || 0} suara</p>
          </div>
        </div>
        
        <div className={`${election.winner ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50' : 'bg-muted/20'} rounded-lg p-4 flex items-center gap-3`}>
          <div className={`p-2 rounded-full ${election.winner ? 'bg-yellow-100 dark:bg-yellow-700/50' : 'bg-primary/10'}`}>
            {election.winner ? (
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <Users className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {election.winner ? 'Pemenang' : 'Partisipasi'}
            </p>
            {election.winner ? (
              <p className="font-medium text-sm truncate">{election.winner.name} ({election.winner.percentage}%)</p>
            ) : (
              <p className="font-medium text-sm">
                {election.participation?.percentage || "0.00"}% Pemilih
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Statistics */}
      {election.participation && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Pemilih</p>
              <p className="font-medium text-sm">{election.participation.totalVoters || 0} pemilih</p>
            </div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sudah Memilih</p>
              <p className="font-medium text-sm">{election.participation.voted || 0} pemilih</p>
            </div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
              <User className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Memilih</p>
              <p className="font-medium text-sm">{election.participation.notVoted || 0} pemilih</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 