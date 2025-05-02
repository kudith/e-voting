import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useSWR from "swr";
import Footer from "./footer";
import {
  Copy,
  Moon,
  Sun,
  CheckCircle,
  ExternalLink,
  Search,
  BarChart3,
  Vote,
  Clock,
  ChevronRight,
  Shield,
  Lock,
  CheckCheck,
  ArrowRight,
  Award,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import NoVotingRights from "@/components/voter/no-voting-rights";
import Link from "next/link";

// Styles for gradient effects

// Fetcher function for SWR
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function VoterDashboard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Fetch voter data using SWR
  const { data: voterData, error: voterError } = useSWR("/api/voter/getCurrentVoter", fetcher);
  
  // Fetch voter elections using SWR
  const { data: voterElections, error: voterElectionsError } = useSWR("/api/voterElection/getAllVoterElection", fetcher);

  // Fetch candidates using SWR
  const { data: candidatesData, error: candidatesError } = useSWR(
    voterData?.id ? `/api/candidate/getCandidateByElections?electionId=${voterData?.voterElections?.[0]?.election?.id}` : null,
    fetcher
  );

  // Process voter data
  const voter = voterData;
  const voterElectionData = voterElections?.find(ve => ve.voter.id === voter?.id);
  const hasVotingRights = !!voterElectionData;
  const currentElection = voterElectionData?.election;
  const candidates = candidatesData || [];

  // Set voter status
  const voterStatus = voterElectionData ? {
    isEligible: voterElectionData.isEligible,
    hasVoted: voterElectionData.hasVoted,
    voteHash: voterElectionData.voteHash || null
  } : null;

  // Calculate election stats
  const totalVoters = voterElections?.filter(ve => ve.election.id === currentElection?.id).length || 0;
  const votedCount = voterElections?.filter(ve => ve.election.id === currentElection?.id && ve.hasVoted).length || 0;
  const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

  // Get voter's voting status
  const isEligible = voterStatus?.isEligible || false;
  const hasVoted = voterStatus?.hasVoted || false;

  // Update countdown timer for active election
  useEffect(() => {
    if (!currentElection) return;

    const interval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(currentElection.endDate);
      const distance = endTime.getTime() - now.getTime();

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentElection]);

  // Handle vote submission
  const handleVoteSubmit = async () => {
    try {
      // Check if voter is eligible and hasn't voted
      if (!currentElection) {
        toast.error("Kesalahan", {
          description: "Tidak ada pemilu aktif saat ini.",
        });
        return;
      }

      if (!voterStatus?.isEligible) {
        toast.error("Kesalahan", {
          description: "Anda tidak memenuhi syarat untuk memilih dalam pemilu ini.",
        });
        return;
      }

      if (voterStatus?.hasVoted) {
        toast.error("Kesalahan", {
          description: "Anda sudah memberikan suara dalam pemilu ini.",
        });
        return;
      }

      // Redirect to voting page
      window.location.href = `/voter/vote/`;
    } catch (error) {
      console.error("Error navigating to vote page:", error);
      toast.error("Kesalahan", {
        description: "Gagal membuka halaman pemilihan. Silakan coba lagi.",
      });
    }
  };

  // Copy hash to clipboard
  const copyToClipboard = () => {
    if (!voterStatus?.voteHash) return;

    navigator.clipboard.writeText(voterStatus.voteHash);
    setCopied(true);
    toast.success("Berhasil", {
      description: "Hash suara telah disalin ke clipboard.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Render time unit for countdown
  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-2 transition-all duration-300",
          "border border-accent shadow-md",
          "hover:scale-105 hover:shadow-lg",
          "text-primary"
        )}
      >
        {value}
      </div>
      <span className="text-sm font-medium  dark:">{label}</span>
    </div>
  );

  // Show loading state
  if (!voterData && !voterError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (voterError || voterElectionsError || candidatesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-xl font-semibold text-red-500">
          Error: {voterError?.message || voterElectionsError?.message || candidatesError?.message}
        </div>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  // Check if voter has no voting rights
  if (!hasVotingRights) {
    return <NoVotingRights voter={voter} />;
  }

  return (
    <div className="min-h-screen w-full transition-colors duration-500 bg-background">
      <div className="mx-auto px-4 py-8 relative z-10 ">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 "
        >
          {/* Top Section - Greeting and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            {/* Greeting Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-0 shadow-xl overflow-hidden py-9 ">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl font-bold ">
                        Halo, {voter?.name}!
                      </CardTitle>
                      <CardDescription className="text-base mt-1 ">
                        Selamat Datang di Platform SiPilih. Anda mengikuti pemilu untuk:
                        <br />
                        <span className="font-bold text-primary">{currentElection?.title || "Tidak ada pemilu aktif"}</span>
                      </CardDescription>
                    </div>
                    <Badge className="px-3 py-1 text-sm flex items-center gap-1 self-start border border-primary">
                      {hasVoted ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Sudah Memilih
                        </>
                      ) : currentElection?.status === "ongoing" ? (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" /> Sedang Berlangsung
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" /> Menunggu
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <div className="flex-1 rounded-xl p-4 border transition-all duration-300">
                      <div className="flex items-center mb-2">
                        <Vote className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium ">Status Pemilihan</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="">Tingkat Partisipasi</span>
                          <span className="font-medium ">
                            {Math.round(participationRate)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200/70">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${participationRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                        <p className="text-xs ">
                          {votedCount} dari {totalVoters} pemilih
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl p-4 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                        <h3 className="font-medium ">Waktu Tersisa</h3>
                      </div>
                      <div className="flex justify-between gap-2 mt-3">
                        <TimeUnit value={timeLeft.days} label="Hari" />
                        <TimeUnit value={timeLeft.hours} label="Jam" />
                        <TimeUnit value={timeLeft.minutes} label="Menit" />
                        <TimeUnit value={timeLeft.seconds} label="Detik" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Call-to-Action Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl h-full ">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl ">Ambil Tindakan</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-[calc(100%-80px)]">
                  {!hasVoted && isEligible ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300">
                        <Vote className="h-12 w-12 text-blue-600" />
                      </div>
                      <p className="text-sm ">
                        Suara Anda penting! Berikan suara Anda untuk membuat suara Anda didengar dalam pemilihan ini.
                      </p>
                      <Button
                        onClick={handleVoteSubmit}
                        variant="outline"
                        className="w-full py-6 mt-4 rounded-xl font-medium transition-all duration-300 cursor-pointer shadow-md bg-primary-foreground text-primary hover:bg-primary/5"
                      >
                        <span className="flex items-center gap-2">
                          Mulai Voting <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border flex flex-col items-center text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-emerald-500/20">
                          <CheckCheck className="h-6 w-6 text-emerald-400" />
                        </div>
                        <p className="font-medium mb-2 text-emerald-600">
                          Suara Anda telah direkam secara aman
                        </p>
                        <Button
                          onClick={() => router.push(`/voter/verify`)}
                          variant="outline"
                          className="w-full py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer border-emerald-300 text-emerald-600"
                        >
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Verifikasi Suara Anda
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Kandidat yang mengikuti berdasarkan election yang diikuti voter */}
          {candidates.length > 0 && (
            <motion.section variants={itemVariants}>
              <Card className="border-0 shadow-xl ">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold ">
                        Kandidat {currentElection?.title}
                      </CardTitle>
                      <CardDescription className="">
                        Temui para kandidat yang mencalonkan diri dalam pemilihan ini
                      </CardDescription>
                    </div>
                    <Link
                      href="/voter/candidates"
                      className="text-sm font-medium cursor-pointer bg-none shadow-none"
                    >
                      <span className="flex items-center gap-1">
                        Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates.map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                        <Card className="relative py-0 gap-2 h-full border-0 shadow-lg overflow-hidden bg-background/40 backdrop-blur-sm transition-all duration-500 group-hover:bg-background/60">
                          <CardHeader className="p-0">
                            <div className="relative aspect-square w-full overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-lg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-lg" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Avatar className="w-full h-full p-2 rounded-lg border-0 shadow-none transition-transform duration-500 group-hover:scale-105">
                                  <AvatarImage 
                                    src={candidate.photo || "https://via.placeholder.com/300x300?text=No+Photo"} 
                                    alt={candidate.name}
                                    className="object-cover w-full h-full rounded-full"
                                  />
                                  <AvatarFallback className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-2xl">
                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              {/* Ranking badge */}
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium border-primary/20">
                                  No. {candidate.peringkat || index + 1}
                                </Badge>
                              </div>
                              {/* Top candidate indicator */}
                              {(candidate.peringkat === 1 || index === 0) && (
                                <div className="absolute bottom-2 right-2">
                                  <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs font-medium">
                                    <Star className="h-3 w-3 mr-1" /> Teratas
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 space-y-2">
                            <div className="text-center">
                              <h3 className="text-sm font-semibold mb-0.5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                {candidate.name}
                              </h3>
                              {candidate.shortBio && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{candidate.shortBio}</p>
                              )}
                            </div>

                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Vote className="h-3 w-3" /> Suara
                                </span>
                                <span className="font-medium">{candidate.voteCount || 0} ({candidate.votePercentage || "0.0"}%)</span>
                              </div>
                              <Progress 
                                value={parseFloat(candidate.votePercentage) || 0} 
                                className={cn(
                                  "h-1.5 rounded-full",
                                  (candidate.peringkat === 1 || index === 0) ? "bg-primary/20" : "bg-primary/10"
                                )}
                              />
                            </div>

                            <Button 
                              className={cn(
                                "w-full cursor-pointer gap-1.5 h-7 text-xs mt-1",
                                (candidate.peringkat === 1 || index === 0) ? "bg-primary/90 hover:bg-primary" : ""
                              )}
                              onClick={() => router.push(`/voter/candidates/${candidate.id}`)}
                            >
                              Lihat Profil
                              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Verification & Live Count */}
          <motion.section
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="border-0 shadow-xl ">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg ">
                      Verifikasi Suara Anda
                    </CardTitle>
                    <CardDescription className="">
                      Pastikan suara Anda telah direkam dengan benar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 ">
                  Teknologi blockchain kami memungkinkan Anda untuk memverifikasi bahwa suara Anda telah direkam dengan benar tanpa mengungkapkan siapa yang Anda pilih.
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:border-blue-500/50 bg-white/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                  onClick={() => router.push('/voter/verify')}
                >
                  <Search className="h-4 w-4" /> Verifikasi Suara Anda
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl ">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg ">
                      Hasil Langsung
                    </CardTitle>
                    <CardDescription className="">
                      Lihat statistik pemilihan secara real-time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 ">
                  Lacak kemajuan pemilihan secara real-time dengan analitik terperinci, grafik, dan breakdown pola pemilihan.
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:border-emerald-500/50 bg-white/50 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10"
                  onClick={() => router.push('/voter/result')}
                >
                  <BarChart3 className="h-4 w-4" /> Lihat Hasil Langsung
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          {/* Footer Section */}
          <Footer />
        </motion.main>
      </div>
    </div>
  );
}
