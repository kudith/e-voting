"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
import { useTheme } from "@/lib/theme-provider";
import NoVotingRights from "@/components/voter/no-voting-rights";

// Styles for gradient effects
const gradientHoverStyles = {
  primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
  secondary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600",
  success: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600",
};

const glassCardStyles = {
  light: "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",
  dark: "bg-gray-900/10 backdrop-blur-md border border-gray-800/20 shadow-lg",
};

export default function VoterDashboard() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [voter, setVoter] = useState(null);
  const [currentElection, setCurrentElection] = useState(null);
  const [voterStatus, setVoterStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVotingRights, setHasVotingRights] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Fetch voter data and check if has voting rights
  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        // Step 1: Get voter data
        const voterResponse = await fetch("/api/voter/getCurrentVoter");
        if (!voterResponse.ok) {
          throw new Error("Failed to fetch voter data");
        }
        const voterData = await voterResponse.json();
        setVoter(voterData);
        
        // Step 2: Get all voter elections
        const voterElectionsResponse = await fetch("/api/voterElection/getAllVoterElection");
        if (!voterElectionsResponse.ok) {
          throw new Error("Failed to fetch voter elections");
        }
        const voterElections = await voterElectionsResponse.json();
        
        // Step 3: Check if voter has any election rights
        const voterElectionData = voterElections.find(ve => ve.voter.id === voterData.id);
        const voterHasElection = !!voterElectionData;
        
        console.log("Voter has election rights:", voterHasElection);
        setHasVotingRights(voterHasElection);
        
        // If voter has no voting rights, stop loading
        if (!voterHasElection) {
          setIsLoading(false);
          return;
        }
        
        // Step 4: Get election data and voter status from voterElectionData
        const electionData = voterElectionData.election;
        const electionId = electionData.id;
        
        // Calculate election stats
        const totalVoters = voterElections.filter(ve => ve.election.id === electionId).length;
        const votedCount = voterElections.filter(ve => ve.election.id === electionId && ve.hasVoted).length;
        
        // Set voter status
        setVoterStatus({
          isEligible: voterElectionData.isEligible,
          hasVoted: voterElectionData.hasVoted,
          voteHash: voterElectionData.voteHash || null
        });
        
        // Step 5: Get election with candidates
        try {
          // Set current election with additional stats
          setCurrentElection({
            ...electionData,
            totalVoters,
            votedCount
          });
          
          // Fetch candidates using the getCandidateByElections endpoint
          const candidatesResponse = await fetch(`/api/candidate/getCandidateByElections?electionId=${electionId}`);
          
          if (candidatesResponse.ok) {
            const candidatesData = await candidatesResponse.json();
            console.log("Candidates data fetched:", candidatesData.length, "candidates");
            
            // Log the first candidate to debug photo issues
            if (candidatesData.length > 0) {
              console.log("First candidate details:", {
                name: candidatesData[0].name,
                photo: candidatesData[0].photo,
                vision: candidatesData[0].vision?.substring(0, 50)
              });
            }
            
            // Transform candidates to match expected format if needed
            const formattedCandidates = candidatesData.map(candidate => ({
              id: candidate.id,
              name: candidate.name,
              photo: candidate.photo || "https://via.placeholder.com/300x225?text=No+Photo",
              position: "Candidate", // Default value
              vision: candidate.vision || "No vision statement provided",
              mission: candidate.mission || "No mission statement provided", 
              voteCount: candidate.voteCount || 0
            }));
            
            setCandidates(formattedCandidates);
          } else {
            console.warn("Could not fetch candidates for election");
            setCandidates([]);
          }
        } catch (error) {
          console.error("Error fetching candidates:", error);
          // Still set basic election data on error
          setCurrentElection({
            ...electionData,
            totalVoters,
            votedCount
          });
          setCandidates([]);
        }
        
        toast.success("Selamat datang!", {
          description: "Anda telah masuk ke platform SiPilih.",
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
        setIsLoading(false);
        toast.error("Kesalahan", {
          description: "Gagal memuat data. Silakan coba lagi nanti.",
        });
      }
    };

    fetchVoterData();
  }, []);

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
          "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
          "border border-blue-500/30",
          "hover:from-blue-500/30 hover:to-purple-500/30",
          "hover:scale-105 hover:shadow-lg",
          isDarkMode ? "text-blue-400" : "text-blue-600"
        )}
      >
        {value}
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  // Check if voter has no voting rights
  if (!hasVotingRights) {
    return <NoVotingRights voter={voter} />;
  }

  // Get election stats
  const totalVoters = currentElection?.totalVoters || 0;
  const votedCount = currentElection?.votedCount || 0;
  const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

  // Get voter's voting status
  const isEligible = voterStatus?.isEligible || false;
  const hasVoted = voterStatus?.hasVoted || false;

  return (
    <div className={cn(
      "min-h-screen w-full transition-colors duration-500",
      isDarkMode ? "bg-gray-950" : "bg-gray-50"
    )}>
      <div className="mx-auto px-4 py-8 relative z-10">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top Section - Greeting and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Greeting Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className={cn(
                "border-0 shadow-xl overflow-hidden",
                isDarkMode ? glassCardStyles.dark : glassCardStyles.light
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Hello, {voter?.name}!
                      </CardTitle>
                      <CardDescription className={cn(
                        "text-base mt-1",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {currentElection?.title || "No active election"}
                      </CardDescription>
                    </div>
                    <Badge className={cn(
                      "px-3 py-1 text-sm flex items-center gap-1 self-start",
                      hasVoted
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30"
                        : currentElection?.status === "ongoing"
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30",
                    )}>
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
                    <div className={cn(
                      "flex-1 rounded-xl p-4",
                      "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
                      "border border-blue-500/20",
                      "hover:from-blue-500/20 hover:to-purple-500/20",
                      "transition-all duration-300"
                    )}>
                      <div className="flex items-center mb-2">
                        <Vote className={cn(
                          "h-5 w-5 mr-2",
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        )} />
                        <h3 className="font-medium">Election Status</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            Participation
                          </span>
                          <span className="font-medium">
                            {Math.round(participationRate)}%
                          </span>
                        </div>
                        <div className={cn(
                          "w-full h-2 rounded-full overflow-hidden",
                          isDarkMode ? "bg-gray-800/70" : "bg-gray-200/70"
                        )}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${participationRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {votedCount} out of {totalVoters} voters
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "flex-1 rounded-xl p-4",
                      "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
                      "border border-emerald-500/20",
                      "hover:from-emerald-500/20 hover:to-teal-500/20",
                      "transition-all duration-300"
                    )}>
                      <div className="flex items-center mb-2">
                        <Clock className={cn(
                          "h-5 w-5 mr-2",
                          isDarkMode ? "text-emerald-400" : "text-emerald-600"
                        )} />
                        <h3 className="font-medium">Time Remaining</h3>
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
              <Card className={cn(
                "border-0 shadow-xl h-full",
                isDarkMode ? glassCardStyles.dark : glassCardStyles.light
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Take Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-[calc(100%-80px)]">
                  {!hasVoted && isEligible ? (
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center mb-4",
                        "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                        "border border-blue-500/30",
                        "hover:from-blue-500/30 hover:to-purple-500/30",
                        "transition-all duration-300"
                      )}>
                        <Vote className={cn(
                          "h-12 w-12",
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        )} />
                      </div>
                      <p className="mb-6 text-sm">
                        Your vote matters! Cast your ballot to make your voice heard in this election.
                      </p>
                      <Button
                        onClick={handleVoteSubmit}
                        className={cn(
                          "w-full py-6 rounded-xl font-medium transition-all duration-300",
                          gradientHoverStyles.primary,
                          "text-white shadow-lg hover:shadow-xl border-0"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          🗳️ Start Voting <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={cn(
                        "p-4 rounded-lg border flex flex-col items-center text-center",
                        "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
                        "border border-emerald-500/20",
                        "hover:from-emerald-500/20 hover:to-teal-500/20",
                        "transition-all duration-300"
                      )}>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                          <CheckCheck className="h-6 w-6 text-emerald-400" />
                        </div>
                        <p className="text-emerald-400 font-medium mb-3">
                          Your vote has been recorded securely
                        </p>
                        <div className="flex items-center gap-2 w-full">
                          <div className={cn(
                            "text-xs font-mono p-2 rounded overflow-hidden overflow-ellipsis flex-1",
                            isDarkMode ? "bg-gray-800" : "bg-gray-100"
                          )}>
                            {voterStatus?.voteHash}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            className={cn(
                              "flex-shrink-0 transition-all duration-300",
                              copied
                                ? "text-emerald-500 border-emerald-500/50"
                                : isDarkMode
                                  ? "border-gray-700"
                                  : "border-gray-300"
                            )}
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
              <Card className={cn(
                "border-0 shadow-xl",
                isDarkMode ? glassCardStyles.dark : glassCardStyles.light
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Top Candidates
                      </CardTitle>
                      <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        Meet the candidates running in this election
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-sm font-medium",
                        "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10",
                        "transition-all duration-300"
                      )}
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {candidates.map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <Card className={cn(
                          "h-full border transition-all duration-300 overflow-hidden group",
                          "hover:shadow-md hover:shadow-blue-500/10",
                          isDarkMode
                            ? "bg-gray-800/80 border-gray-700/50 hover:border-blue-400/30"
                            : "bg-white/90 border-gray-200/50 hover:border-blue-500/30"
                        )}>
                          <div className="relative p-3 pt-4">
                            <div className="aspect-[1/1] w-full overflow-hidden rounded-lg">
                              <img
                                src={candidate.photo || "https://via.placeholder.com/300x300?text=No+Photo"}
                                alt={candidate.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  console.log(`Image error for ${candidate.name}:`, e.target.src);
                                  e.target.src = "https://via.placeholder.com/300x300?text=No+Photo";
                                }}
                              />
                            </div>
                          </div>
                          <div className="px-4 pb-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={cn(
                                "px-2.5 py-0.5 text-xs font-medium rounded-md",
                                "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
                                "border border-blue-500/20",
                                isDarkMode ? "text-blue-300" : "text-blue-600"
                              )}>
                                {candidate.voteCount || 0} votes
                              </Badge>
                              <Badge variant="outline" className={cn(
                                "px-2.5 py-0.5 text-xs font-medium rounded-md",
                                isDarkMode 
                                  ? "border-gray-700 text-gray-300" 
                                  : "border-gray-200 text-gray-600"
                              )}>
                                #{index + 1}
                              </Badge>
                            </div>
                            
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
                                {candidate.name}
                              </h3>
                              <p className={cn(
                                "text-xs mt-0.5",
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              )}>
                                {candidate.position || "Candidate"}
                              </p>
                            </div>
                            
                            <div className={cn(
                              "rounded-md p-2 text-xs italic",
                              isDarkMode 
                                ? "bg-gray-900/50 text-gray-300" 
                                : "bg-gray-50 text-gray-600"
                            )}>
                              "{candidate.vision?.substring(0, 60) || "No vision statement"}..."
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full flex items-center justify-center gap-1 text-xs transition-colors",
                                "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10",
                                isDarkMode
                                  ? "border-gray-700 hover:border-blue-500/50 bg-gray-800/50"
                                  : "border-gray-200 hover:border-blue-500/50 bg-white/50"
                              )}
                            >
                              View Profile <ExternalLink className="h-3 w-3 ml-1" />
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
            <Card className={cn(
              "border-0 shadow-xl",
              isDarkMode ? glassCardStyles.dark : glassCardStyles.light
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                    "border border-blue-500/30"
                  )}>
                    <Shield className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      Verify Your Vote
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                      Ensure your vote was recorded correctly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={cn(
                  "text-sm mb-4",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  Our blockchain technology allows you to verify that your vote was counted correctly without revealing who you voted for.
                </p>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-5",
                    "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10",
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 hover:border-blue-500/50"
                      : "bg-white/50 border-gray-300 hover:border-blue-500/50"
                  )}
                >
                  <Search className="h-4 w-4" /> Verify Your Vote
                </Button>
              </CardContent>
            </Card>

            <Card className={cn(
              "border-0 shadow-xl",
              isDarkMode ? glassCardStyles.dark : glassCardStyles.light
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                    "border border-emerald-500/30"
                  )}>
                    <BarChart3 className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      Live Results
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                      View real-time election statistics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={cn(
                  "text-sm mb-4",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  Track the election progress in real-time with detailed analytics, charts, and breakdowns of voting patterns.
                </p>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-5",
                    "hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10",
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 hover:border-emerald-500/50"
                      : "bg-white/50 border-gray-300 hover:border-emerald-500/50"
                  )}
                >
                  <BarChart3 className="h-4 w-4" /> View Live Results
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className={cn(
              "mt-8 pt-6 border-t text-center text-sm",
              isDarkMode
                ? "border-gray-800 text-gray-500"
                : "border-gray-200 text-gray-600"
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Secured by blockchain technology</span>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 hover:text-blue-500 transition-colors"
                >
                  Terms of Service
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 hover:text-blue-500 transition-colors"
                >
                  Help Center
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs">
                © 2025 VotingChain. All rights reserved.
              </p>
            </div>
          </motion.footer>
        </motion.main>
      </div>
    </div>
  );
}
