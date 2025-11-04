"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Activity,
  Users,
  Vote,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatNumber } from "@/lib/utils";
import ElectionVotingChart from "@/components/admin/dashboard/ElectionVotingChart";
import TopElectionsStats from "@/components/admin/dashboard/TopElectionsStats";
import LatestVotesActivity from "@/components/admin/dashboard/LatestVotesActivity";
import UpcomingElectionsWidget from "@/components/admin/dashboard/UpcomingElectionsWidget";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalElections: 0,
    activeElections: 0,
    completedElections: 0,
    upcomingElections: 0,
    totalVotes: 0,
    totalVoters: 0,
    participationRate: 0,
    totalCandidates: 0,
    recentActivity: [],
    votingTrend: [],
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/dashboard/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        if (data.success) {
          setDashboardStats(data.data);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 p-4 sm:p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground mt-1">
                Selamat datang di dashboard admin sistem e-voting
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard/monitoring">
                  <BarChart className="h-4 w-4 mr-2" />
                  Monitoring
                </Link>
              </Button>
              <Button>
                <a href="/admin/dashboard/elections">
                  <Vote className="h-4 w-4 mr-2" />
                  Pemilu
                </a>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="elections">Pemilu</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Elections */}
                <Card className="bg-gradient-to-br from-primary/5 to-card border-none shadow-md">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Pemilu</CardDescription>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CardTitle className="text-2xl font-semibold">
                        {dashboardStats.totalElections}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge className="mr-2 bg-primary/20 text-primary hover:bg-primary/20">
                        {dashboardStats.activeElections} Aktif
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                        {dashboardStats.completedElections} Selesai
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>

                {/* Total Votes */}
                <Card className="bg-gradient-to-br from-blue-50 to-card dark:from-blue-950/20 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Suara</CardDescription>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CardTitle className="text-2xl font-semibold">
                        {formatNumber(dashboardStats.totalVotes)}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Semua suara tercatat dan terverifikasi
                      </span>
                    )}
                  </CardFooter>
                </Card>

                {/* Total Voters */}
                <Card className="bg-gradient-to-br from-violet-50 to-card dark:from-violet-950/20 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Pemilih</CardDescription>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CardTitle className="text-2xl font-semibold">
                        {formatNumber(dashboardStats.totalVoters)}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        {dashboardStats.participationRate}% tingkat partisipasi
                      </span>
                    )}
                  </CardFooter>
                </Card>

                {/* Upcoming Elections */}
                <Card className="bg-gradient-to-br from-amber-50 to-card dark:from-amber-950/20 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <CardDescription>Pemilu Mendatang</CardDescription>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CardTitle className="text-2xl font-semibold">
                        {dashboardStats.upcomingElections}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Terjadwal dan siap dilaksanakan
                      </span>
                    )}
                  </CardFooter>
                </Card>
              </div>

              {/* Voting Activity Chart */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Aktivitas Pemilihan</CardTitle>
                  <CardDescription>
                    Tren jumlah suara yang masuk per hari
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[350px] w-full flex items-center justify-center">
                      <Skeleton className="h-[300px] w-full" />
                    </div>
                  ) : (
                    <ElectionVotingChart data={dashboardStats.votingTrend} />
                  )}
                </CardContent>
              </Card>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Elections */}
                <TopElectionsStats isLoading={isLoading} />

                {/* Recent Voting Activity */}
                <LatestVotesActivity
                  isLoading={isLoading}
                  activities={dashboardStats.recentActivity}
                />
              </div>
            </TabsContent>

            {/* Elections Tab */}
            <TabsContent value="elections" className="space-y-6 mt-6">
              <UpcomingElectionsWidget />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6 mt-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>
                    Log aktivitas terbaru pada sistem e-voting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : dashboardStats.recentActivity?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardStats.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 border-b pb-4"
                        >
                          <div
                            className={`rounded-full p-2 ${
                              activity.status === "COMPLETED"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            <Vote className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{activity.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDate(activity.date)}</span>
                              <span>•</span>
                              <span>{activity.votes} suara</span>
                              <Badge
                                variant={
                                  activity.status === "COMPLETED"
                                    ? "outline"
                                    : "default"
                                }
                                className="ml-2"
                              >
                                {activity.status === "COMPLETED"
                                  ? "Selesai"
                                  : "Aktif"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Activity className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="font-medium text-lg">
                        Belum ada aktivitas
                      </h3>
                      <p className="text-muted-foreground max-w-sm mt-1">
                        Aktivitas akan muncul saat pemilu dan pemilihan mulai
                        berlangsung.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
