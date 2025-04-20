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
      window.location.href = `/voter/vote/${currentElection.id}`;
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
                        Hello, {voter?.name}!
                      </CardTitle>
                      <CardDescription className="text-base mt-1 ">
                        Selamat Datang di Platform SiPilih. Anda mengikuti pemilu untuk:
                        <br />
                        <span className="font-bold text-primary">{currentElection?.title || "No active election"}</span>
                      </CardDescription>
                    </div>
                    <Badge className="px-3 py-1 text-sm flex items-center gap-1 self-start border bg-blue-500/10 text-blue-600">
                      {hasVoted ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Voted
                        </>
                      ) : currentElection?.status === "ongoing" ? (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" /> Ongoing
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" /> Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <div className="flex-1 rounded-xl p-4 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300">
                      <div className="flex items-center mb-2">
                        <Vote className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium ">Election Status</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="">Participation</span>
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
                          {votedCount} out of {totalVoters} voters
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl p-4 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                        <h3 className="font-medium ">Time Remaining</h3>
                      </div>
                      <div className="flex justify-between gap-2 mt-3">
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <TimeUnit value={timeLeft.hours} label="Hours" />
                        <TimeUnit value={timeLeft.minutes} label="Mins" />
                        <TimeUnit value={timeLeft.seconds} label="Secs" />
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
                  <CardTitle className="text-xl ">Take Action</CardTitle>
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
                          🗳️ Mulai Voting <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border flex flex-col items-center text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-emerald-500/20">
                          <CheckCheck className="h-6 w-6 text-emerald-400" />
                        </div>
                        <p className="font-medium mb-3 text-emerald-600">
                          Your vote has been recorded securely
                        </p>
                        <div className="flex items-center gap-2 w-full">
                          <div className="text-xs font-mono p-2 rounded overflow-hidden overflow-ellipsis flex-1 bg-gray-100">
                            {voterStatus?.voteHash}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            className="flex-shrink-0 transition-all duration-300 border-gray-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Candidates Preview */}
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
                      >
                        <Card className="shadow-xl border-accent transition-all duration-300 overflow-hidden group hover:shadow-md py-4 gap-2">
                          <CardHeader className="p-3 pb-0 space-y-0 py-0">
                            <div className="w-full aspect-square overflow-hidden rounded-lg">
                              <img
                                src={candidate.photo || "https://via.placeholder.com/300x300?text=No+Photo"}
                                alt={candidate.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-3 space-y-3 py-0">
                            <div className="flex items-center justify-between">
                              <Badge className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600">
                                {candidate.voteCount || 0} votes
                              </Badge>
                              <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium rounded-md border-gray-200 ">
                                #{index + 1}
                              </Badge>
                            </div>
                            <div>
                              <h3 className="text-base font-semibold leading-tight line-clamp-1 ">
                                {candidate.name}
                              </h3>
                            </div>
                            <div className="rounded-md text-xs italic">
                              <p className="line-clamp-3">"{candidate.vision?.substring(0, 80) || "No vision statement"}..."</p>
                            </div>
                          </CardContent>
                          <div className="px-4 pb-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/voter/candidates/${candidate.id}`)}
                              className="w-full cursor-pointer flex items-center justify-center gap-1 text-xs"
                            >
                              Lihat Profil <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
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
                      Verify Your Vote
                    </CardTitle>
                    <CardDescription className="">
                      Ensure your vote was recorded correctly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 ">
                  Our blockchain technology allows you to verify that your vote was counted correctly without revealing who you voted for.
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:border-blue-500/50 bg-white/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                >
                  <Search className="h-4 w-4" /> Verify Your Vote
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
                      Live Results
                    </CardTitle>
                    <CardDescription className="">
                      View real-time election statistics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 ">
                  Track the election progress in real-time with detailed analytics, charts, and breakdowns of voting patterns.
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:border-emerald-500/50 bg-white/50 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10"
                >
                  <BarChart3 className="h-4 w-4" /> View Live Results
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
