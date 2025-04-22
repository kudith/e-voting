"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/voter/vote/Stepper";
import { CandidateCard } from "@/components/voter/vote/CandidateCard";
import { ConfirmationModal } from "@/components/voter/vote/ConfirmationModal";
import { SuccessPage } from "@/components/voter/vote/SuccessPage";
import { AlreadyVotedPage } from "@/components/voter/vote/AlreadyVotedPage";

export default function VotingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useKindeBrowserClient();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteHash, setVoteHash] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentElection, setCurrentElection] = useState(null);
  const [voterData, setVoterData] = useState(null);
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
  const [voterElectionData, setVoterElectionData] = useState(null);

  // First, fetch the current voter data and their elections
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Get current voter data
        const voterResponse = await fetch("/api/voter/getCurrentVoter");
        if (!voterResponse.ok) {
          throw new Error("Failed to fetch voter data");
        }
        const voterData = await voterResponse.json();
        setVoterData(voterData);

        // 2. Get all voter elections
        const electionsResponse = await fetch("/api/voterElection/getAllVoterElection");
        if (!electionsResponse.ok) {
          throw new Error("Failed to fetch voter elections");
        }
        const electionsData = await electionsResponse.json();

        // 3. Find the ongoing election for this voter
        const ongoingElection = electionsData.find(ve => 
          ve.voter.id === voterData.id && 
          ve.election.status === "ongoing"
        );

        if (!ongoingElection) {
          throw new Error("Tidak ada pemilu aktif yang tersedia untuk Anda");
        }

        setVoterElectionData(ongoingElection);
        setCurrentElection(ongoingElection.election);
        
        // Check if voter has already voted
        if (ongoingElection.hasVoted) {
          setHasAlreadyVoted(true);
          
          // Fetch vote hash if already voted
          try {
            const voteResponse = await fetch(`/api/vote/getVoteByVoterAndElection?voterId=${voterData.id}&electionId=${ongoingElection.election.id}`);
            if (voteResponse.ok) {
              const voteData = await voteResponse.json();
              if (voteData && voteData.voteHash) {
                setVoteHash(voteData.voteHash);
              }
            }
          } catch (error) {
            console.error("Error fetching vote data:", error);
          }
          return;
        }

        // 4. Fetch candidates for the active election
        const candidatesResponse = await fetch(`/api/candidate/getCandidateByElections?electionId=${ongoingElection.election.id}`);
        if (!candidatesResponse.ok) {
          throw new Error("Failed to fetch candidates");
        }
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchData();
    }
  }, [isAuthenticated, isAuthLoading]);

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/api/auth/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSubmit = async () => {
    if (!selectedCandidate || !voterData || !currentElection) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/vote/submitVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId: currentElection.id,
          candidateId: selectedCandidate.id,
          voterId: voterData.id,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setVoteHash(data.data.voteHash);
        setCurrentStep(3);
        toast.success("Suara Anda berhasil dikirim!");
      } else {
        throw new Error(data.error || "Gagal mengirim suara");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => router.push("/voter/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentElection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tidak Ada Pemilu Aktif
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Saat ini tidak ada pemilu yang sedang berlangsung untuk Anda.
          </p>
          <Button onClick={() => router.push("/voter/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Show already voted page if voter has already voted
  if (hasAlreadyVoted) {
    return <AlreadyVotedPage voteHash={voteHash} electionTitle={currentElection.title} />;
  }

  if (currentStep === 3) {
    return <SuccessPage voteHash={voteHash} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pilih Kandidat Anda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Anda hanya dapat memilih satu kali. Pastikan pilihan Anda sudah tepat sebelum melanjutkan.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Pemilu: {currentElection.title}
          </p>
        </motion.div>

        <Stepper currentStep={currentStep} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={selectedCandidate?.id === candidate.id}
                onSelect={handleCandidateSelect}
                onViewDetails={() => {
                  // Implement candidate details modal
                  toast.info("Fitur detail kandidat akan segera hadir");
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedCandidate || isSubmitting}
            onClick={() => setShowConfirmation(true)}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mengirim...</span>
              </div>
            ) : (
              "Lanjutkan"
            )}
          </Button>
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleSubmit}
        candidate={selectedCandidate}
      />
    </div>
  );
}
