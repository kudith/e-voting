"use client";

import { useEffect, useState } from "react";
import { BarChart4, ExternalLink, Vote } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function TopElectionsStats({ isLoading }) {
  const [topElections, setTopElections] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/stats");
        const result = await res.json();
        if (result.success) {
          // Ambil pemilu populer dari status ACTIVE dan COMPLETED
          const elections = result.data.elections
            .filter((election) => election.status === "ACTIVE")
            .sort((a, b) => b.totalVotes - a.totalVotes)
            .slice(0, 5); // Top 5 aktif
          setTopElections(elections);
        }
      } catch (error) {
        setTopElections([]);
      }
    };
    fetchStats();
  }, []);

  function formatTimeRemaining(date) {
    const now = new Date();
    const diff = date - now;

    if (diff <= 0) return "Selesai";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} hari lagi`;
    return `${hours} jam lagi`;
  }

  function getProgressColor(participation) {
    if (participation >= 75) return "bg-emerald-600";
    if (participation >= 50) return "bg-blue-600";
    if (participation >= 25) return "bg-amber-600";
    return "bg-red-600";
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-primary" />
              Pemilu Populer
            </div>
          </CardTitle>
          <CardDescription>
            Pemilu aktif dengan tingkat partisipasi tertinggi
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <a href="/admin/dashboard/monitoring">
            <span className="sr-md:inline">Lihat Semua</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between text-xs">
                  <Skeleton className="h-3 w-[60px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        ) : topElections.length > 0 ? (
          <div className="space-y-4">
            {topElections.map((election) => (
              <div key={election.id} className="space-y-2">
                <div className="flex justify-between">
                  <div
                    className="font-medium text-sm truncate max-w-[220px]"
                    title={election.title}
                  >
                    {election.title}
                  </div>
                  <div className="text-sm font-semibold">
                    {Number(election.participation?.percentage ?? 0).toFixed(1)}
                    %
                  </div>
                </div>
                <Progress
                  value={election.participation}
                  className={getProgressColor(election.participation)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Vote className="h-3 w-3" />
                    {election.totalVotes} / {election.totalVoters}
                  </div>
                  <div>{formatTimeRemaining(new Date(election.endDate))}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Vote className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-medium">Belum ada pemilu aktif</h3>
            <p className="text-muted-foreground max-w-sm mt-1 text-sm">
              Pemilu yang sedang berlangsung akan muncul di sini.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
