"use client";

import { useEffect, useState } from "react";
import { 
  IconTrophy, 
  IconChevronDown, 
  IconUsers, 
  IconCheck, 
  IconX,
  IconPercentage,
  IconBuildingSkyscraper,
  IconSchool,
  IconChartBar,
  IconAlertCircle
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  PieChart,
  Pie,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Area,
  AreaChart
} from "recharts";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ElectionResultPage() {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrentElection() {
      try {
        setLoading(true);
        
        // Step 1: Mencoba menggunakan getCurrentVoterElection API terlebih dahulu
        const voterElectionResponse = await fetch('/api/voterElection/getCurrentVoterElection');
        
        if (voterElectionResponse.ok) {
          const voterElectionData = await voterElectionResponse.json();
          setActiveElection(voterElectionData);
          
          // Langsung mengambil hasil pemilihan menggunakan ID pemilihan
          await fetchElectionResults(voterElectionData?.election?.id);
          return;
        }
        
        // Jika getCurrentVoterElection gagal, gunakan metode alternatif
        // Step 2: Fetch current voter data to get voter ID
        const voterResponse = await fetch('/api/voter/getCurrentVoter');
        
        if (!voterResponse.ok) {
          throw new Error(`Gagal mengambil data pemilih: ${voterResponse.statusText}`);
        }
        
        const voterData = await voterResponse.json();
        const voterId = voterData.id;
        
        // Step 3: Fetch all voter elections to find the active one for this voter
        const voterElectionsResponse = await fetch('/api/voterElection/getAllVoterElection');
        
        if (!voterElectionsResponse.ok) {
          throw new Error(`Gagal mengambil data pemilihan pemilih: ${voterElectionsResponse.statusText}`);
        }
        
        const allVoterElections = await voterElectionsResponse.json();
        
        // Find the election for current voter - using voter.id from each voterElection
        const currentVoterElection = allVoterElections.find(ve => 
          ve?.voter?.id === voterId && 
          (ve?.election?.status === "active" || ve?.election?.status === "ongoing" || ve?.election?.status === "completed")
        );
        
        if (!currentVoterElection) {
          setError("Tidak ditemukan pemilihan aktif atau selesai untuk akun Anda");
          setLoading(false);
          return;
        }
        
        setActiveElection(currentVoterElection);

        // Step 4: Fetch election results using the election ID
        await fetchElectionResults(currentVoterElection?.election?.id);
      } catch (err) {
        console.error("Error mengambil data pemilihan saat ini:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    async function fetchElectionResults(electionId) {
      try {
        const response = await fetch(`/api/election/results/${electionId}`);
        
        if (!response.ok) {
          throw new Error(`Gagal mengambil hasil: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Gagal memuat hasil pemilihan");
        }
        
        setResultData(data.data);
      } catch (err) {
        console.error("Error mengambil hasil pemilihan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentElection();
  }, []);

  if (loading) {
    return <ResultsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">
              <IconAlertCircle className="inline-block mr-2" size={24} />
              Error Memuat Hasil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{error}</p>
            {error.includes("Tidak ditemukan pemilihan aktif atau selesai") && (
              <div className="text-muted-foreground text-sm">
                <p>Saat ini tidak ada pemilihan aktif atau selesai yang sedang diikuti oleh akun Anda.</p>
                <p className="mt-2">Silakan kembali ke halaman dashboard.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link 
              href="/voter/dashboard" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
            >
              Kembali ke Dashboard
            </Link>
            <button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2" 
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!resultData) return null;

  const {
    election,
    candidates,
    winner,
    participation,
    participationByFaculty,
    participationByMajor,
    timeline,
    candidateFacultyStats,
    candidateMajorStats
  } = resultData;

  // Format data for charts
  const candidateChartData = candidates?.map(candidate => {
    // Calculate correct percentage based on total votes for all candidates
    const totalVotes = election?.totalVotes || candidates?.reduce((sum, c) => sum + Number(c.voteCount || 0), 0) || 0;
    const percentage = totalVotes > 0 ? ((Number(candidate.voteCount || 0) / totalVotes) * 100).toFixed(2) : "0.00";
    
    return {
      name: candidate.name,
      votes: Number(candidate.voteCount || 0),
      percentage: Number(percentage)
    };
  }) || [];

  const timelineChartData = timeline?.map(item => ({
    date: item.date,
    votes: item.count
  })) || [];

  // Format participation by faculty for chart
  const facultyParticipationData = Object.entries(participationByFaculty || {}).map(
    ([faculty, count]) => ({
      name: faculty,
      value: count
    })
  );

  // Format participation by major for chart
  const majorParticipationData = Object.entries(participationByMajor || {}).map(
    ([major, count]) => ({
      name: major,
      value: count
    })
  );

  // Chart configurations
  const candidateChartConfig = candidates?.reduce((config, candidate, index) => {
    config[candidate.name] = {
      label: candidate.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`
    };
    return config;
  }, {
    votes: { label: "Total Suara" }
  }) || {};

  const timelineChartConfig = {
    votes: {
      label: "Suara",
      color: "hsl(var(--chart-1))"
    }
  };

  const facultyChartConfig = Object.entries(participationByFaculty || {}).reduce((config, [faculty, _], index) => {
    config[faculty] = {
      label: faculty,
      color: `hsl(var(--chart-${(index % 5) + 1}))`
    };
    return config;
  }, {});

  const majorChartConfig = Object.entries(participationByMajor || {}).reduce((config, [major, _], index) => {
    config[major] = {
      label: major,
      color: `hsl(var(--chart-${(index % 5) + 1}))`
    };
    return config;
  }, {});

  const participationChartConfig = {
    voted: {
      label: "Memilih",
      color: "hsl(var(--chart-2))"
    },
    notVoted: {
      label: "Tidak Memilih",
      color: "hsl(var(--chart-3))"
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing': 
      case 'active': 
        return 'bg-amber-500';
      case 'completed': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Status translation
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing': 
      case 'active': 
        return 'Berlangsung';
      case 'completed': return 'Selesai';
      case 'upcoming': return 'Akan Datang';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Hasil {election?.title}</h1>
        <div className="flex items-center mt-2 space-x-2">
          <Badge className={`${getStatusColor(election?.status)}`}>
            {getStatusLabel(election?.status)}
          </Badge>
          <p className="text-muted-foreground">
            {new Date(election?.startDate).toLocaleDateString()} - {new Date(election?.endDate).toLocaleDateString()}
          </p>
        </div>
        <p className="mt-2 text-muted-foreground">{election?.description}</p>
      </header>

      {/* Winner Section */}
      {winner && (
        <Card className="mb-8 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <IconTrophy className="text-amber-500" />
              Pemenang
            </CardTitle>
            <CardDescription>Pemenang Pemilihan dengan Jumlah Suara Tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-2 pt-4">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-amber-500 bg-muted">
                {/* Winner Photo here */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-amber-500">
                  {winner.name.charAt(0)}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{winner.name}</h2>
                <div className="mt-2 flex flex-col gap-1">
                  <p className="flex items-center gap-1">
                    <span className="font-semibold">{winner.voteCount}</span> suara
                  </p>
                  {/* Calculate correct percentage for winner */}
                  {(() => {
                    const totalVotes = election?.totalVotes || candidates?.reduce((sum, c) => sum + Number(c.voteCount || 0), 0) || 0;
                    const percentage = totalVotes > 0 ? ((Number(winner.voteCount || 0) / totalVotes) * 100).toFixed(2) : "0.00";
                    return (
                      <>
                        <Progress
                          value={Number(percentage)}
                          className="h-2 w-48"
                        />
                        <p className="text-sm text-muted-foreground">{percentage}% dari total suara</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Votes Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Suara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{election?.totalVotes || 0}</div>
            <p className="text-sm text-muted-foreground">Suara tercatat dalam pemilihan ini</p>
          </CardContent>
        </Card>

        {/* Participation Rate Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Partisipasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{participation?.percentage || 0}%</div>
            <Progress value={Number(participation?.percentage || 0)} className="mt-2" />
            <p className="text-sm text-muted-foreground">
              {participation?.voted || 0} dari {participation?.totalVoters || 0} pemilih yang memenuhi syarat
            </p>
          </CardContent>
        </Card>

        {/* Candidates Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{candidates?.length || 0}</div>
            <p className="text-sm text-muted-foreground">
              Total kandidat dalam pemilihan
            </p>
          </CardContent>
        </Card>

        {/* Date Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Periode Pemilihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {new Date(election?.startDate).toLocaleDateString()} - {new Date(election?.endDate).toLocaleDateString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Pemilihan {new Date(election?.endDate) < new Date() ? 'selesai' : 'aktif'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Vote Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribusi Suara</CardTitle>
            <CardDescription>Rincian suara per kandidat</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer 
              config={candidateChartConfig} 
              className="min-h-[300px] w-full"
            >
              <BarChart 
                accessibilityLayer 
                data={candidateChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="votes" 
                  fill="var(--color-votes)"
                  radius={[4, 4, 0, 0]}
                >
                  {candidateChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Total suara: {election?.totalVotes || 0}
            </p>
          </CardFooter>
        </Card>

        {/* Voting Timeline */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Timeline Pemilihan</CardTitle>
            <CardDescription>Jumlah suara dari waktu ke waktu</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer 
              config={timelineChartConfig} 
              className="min-h-[300px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={timelineChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="votes" 
                  stroke="var(--color-votes)" 
                  fill="var(--color-votes-25, hsla(var(--chart-1), 0.25))" 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Dari {timeline?.[0]?.date || election?.startDate} hingga {timeline?.[timeline?.length - 1]?.date || election?.endDate}
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Detailed Tabs Section */}
      <div className="mt-8">
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="candidates">
              <IconUsers className="mr-2 h-4 w-4" />
              Kandidat
            </TabsTrigger>
            <TabsTrigger value="demographics">
              <IconBuildingSkyscraper className="mr-2 h-4 w-4" />
              Demografi
            </TabsTrigger>
            <TabsTrigger value="participation">
              <IconChartBar className="mr-2 h-4 w-4" />
              Partisipasi
            </TabsTrigger>
          </TabsList>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performa Kandidat</CardTitle>
                <CardDescription>Rincian detail suara untuk setiap kandidat</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Peringkat</TableHead>
                      <TableHead>Kandidat</TableHead>
                      <TableHead>Suara</TableHead>
                      <TableHead>Persentase</TableHead>
                      <TableHead>Performa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates?.map((candidate, index) => {
                      // Calculate correct percentage based on total votes
                      const totalVotes = election?.totalVotes || candidates?.reduce((sum, c) => sum + Number(c.voteCount || 0), 0) || 0;
                      const percentage = totalVotes > 0 ? ((Number(candidate.voteCount || 0) / totalVotes) * 100).toFixed(2) : "0.00";
                      
                      return (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.voteCount || 0}</TableCell>
                          <TableCell>{percentage}%</TableCell>
                          <TableCell className="w-[30%]">
                            <Progress 
                              value={Number(percentage)} 
                              className="h-2" 
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Fakultas</CardTitle>
                  <CardDescription>Pola pemilihan berdasarkan fakultas</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer 
                    config={facultyChartConfig} 
                    className="min-h-[300px] w-full"
                  >
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <Pie
                        data={facultyParticipationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {facultyParticipationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Jurusan</CardTitle>
                  <CardDescription>Pola pemilihan berdasarkan jurusan</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer 
                    config={majorChartConfig} 
                    className="min-h-[300px] w-full"
                  >
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <Pie
                        data={majorParticipationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {majorParticipationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performa Kandidat per Fakultas</CardTitle>
                  <CardDescription>Bagaimana performa kandidat di berbagai fakultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 pr-4">
                    {candidates?.map((candidate) => {
                      const candidateFaculty = candidateFacultyStats?.[candidate.id] || {};
                      return (
                        <div key={candidate.id} className="mb-6">
                          <h3 className="mb-2 font-semibold">{candidate.name}</h3>
                          {Object.entries(candidateFaculty).map(([faculty, stats]) => (
                            <div key={faculty} className="mb-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{faculty}</span>
                                <span className="font-medium">{stats?.percentage || 0}%</span>
                              </div>
                              <Progress value={Number(stats?.percentage || 0)} className="h-1.5" />
                            </div>
                          ))}
                          <Separator className="my-4" />
                        </div>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performa Kandidat per Jurusan</CardTitle>
                  <CardDescription>Bagaimana performa kandidat di berbagai jurusan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 pr-4">
                    {candidates?.map((candidate) => {
                      const candidateMajor = candidateMajorStats?.[candidate.id] || {};
                      return (
                        <div key={candidate.id} className="mb-6">
                          <h3 className="mb-2 font-semibold">{candidate.name}</h3>
                          {Object.entries(candidateMajor).map(([major, stats]) => (
                            <div key={major} className="mb-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{major}</span>
                                <span className="font-medium">{stats?.percentage || 0}%</span>
                              </div>
                              <Progress value={Number(stats?.percentage || 0)} className="h-1.5" />
                            </div>
                          ))}
                          <Separator className="my-4" />
                        </div>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Participation Tab */}
          <TabsContent value="participation" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Partisipasi Pemilih</CardTitle>
                  <CardDescription>Ikhtisar partisipasi pemilih</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 pt-0">
                  <div className="relative h-56 w-56">
                    <ChartContainer
                      config={participationChartConfig}
                      className="min-h-[220px]"
                    >
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Memilih", value: participation?.voted || 0 },
                            { name: "Tidak Memilih", value: participation?.notVoted || 0 }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="hsl(var(--chart-2))" />
                          <Cell fill="hsl(var(--chart-3))" />
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{participation?.percentage || 0}%</div>
                        <div className="text-sm text-muted-foreground">Partisipasi</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-8">
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
                      <span>{participation?.voted || 0} Memilih</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
                      <span>{participation?.notVoted || 0} Tidak Memilih</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partisipasi Fakultas</CardTitle>
                  <CardDescription>Tingkat partisipasi berdasarkan fakultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 pr-4">
                    {Object.entries(participationByFaculty || {}).map(([faculty, count]) => {
                      const totalInFaculty = participation?.totalVoters || 0;
                      const percentage = totalInFaculty > 0 
                        ? ((count / totalInFaculty) * 100).toFixed(2) 
                        : "0.00";
                      
                      return (
                        <div key={faculty} className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>{faculty}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={Number(percentage)} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {count}/{totalInFaculty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partisipasi Jurusan</CardTitle>
                  <CardDescription>Tingkat partisipasi berdasarkan jurusan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 pr-4">
                    {Object.entries(participationByMajor || {}).map(([major, count]) => {
                      const totalInMajor = participation?.totalVoters || 0;
                      const percentage = totalInMajor > 0 
                        ? ((count / totalInMajor) * 100).toFixed(2) 
                        : "0.00";
                      
                      return (
                        <div key={major} className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>{major}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={Number(percentage)} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {count}/{totalInMajor}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function ResultsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-8" />
      
      <Skeleton className="h-40 w-full mb-8" />
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}