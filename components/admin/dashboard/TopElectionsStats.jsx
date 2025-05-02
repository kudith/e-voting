"use client";

import { useEffect, useState } from "react";
import { BarChart4, ExternalLink, Vote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function TopElectionsStats({ isLoading = true }) {
  const [topElections, setTopElections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopElections = async () => {
      try {
        const response = await fetch('/api/election/results/getAllResults');
        
        if (!response.ok) {
          throw new Error('Failed to fetch election results');
        }
        
        const result = await response.json();
        
        if (result.success) {
          const { data } = result;
          
          // Get active elections with highest participation rate
          const activeElections = data
            .filter(election => election.status === "ACTIVE" && election.participation)
            .sort((a, b) => parseFloat(b.participation.percentage) - parseFloat(a.participation.percentage))
            .slice(0, 4)
            .map(election => ({
              id: election.id,
              title: election.title,
              participation: parseFloat(election.participation.percentage || 0),
              totalVotes: election.totalVotes,
              totalVoters: election.participation.totalVoters,
              endsAt: new Date(election.endDate)
            }));
            
          setTopElections(activeElections);
        }
      } catch (error) {
        console.error('Error fetching top elections:', error);
        setError(error.message);
        
        // Fallback to placeholder data
        setTopElections([
          {
            id: "placeholder-1",
            title: "Pemilihan Ketua BEM 2025",
            participation: 75.5,
            totalVotes: 1250,
            totalVoters: 1500,
            endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: "placeholder-2",
            title: "Pemilihan Ketua Himpunan Teknik",
            participation: 68.2,
            totalVotes: 420,
            totalVoters: 600,
            endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: "placeholder-3",
            title: "Pemilihan Ketua Divisi Kesenian",
            participation: 45.1,
            totalVotes: 95,
            totalVoters: 210,
            endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: "placeholder-4",
            title: "Pemilihan Perwakilan Fakultas",
            participation: 32.8,
            totalVotes: 180,
            totalVoters: 550,
            endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        ]);
      }
    };

    if (!isLoading) {
      fetchTopElections();
    }
  }, [isLoading]);

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
                  <div className="font-medium text-sm truncate max-w-[220px]" title={election.title}>
                    {election.title}
                  </div>
                  <div className="text-sm font-semibold">{election.participation.toFixed(1)}%</div>
                </div>
                <Progress value={election.participation} className={getProgressColor(election.participation)} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Vote className="h-3 w-3" />
                    {election.totalVotes} / {election.totalVoters}
                  </div>
                  <div>{formatTimeRemaining(election.endsAt)}</div>
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