"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Filter, ArrowRight, Vote, BarChart3, Users, Calendar, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import Footer from "@/components/voter/footer";


// Fetcher function for SWR
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const electionIdFromUrl = searchParams.get('electionId');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElection, setSelectedElection] = useState("all");
  

  // Fetch candidates data - if electionId is provided, fetch only for that election
  const apiUrl = electionIdFromUrl 
    ? `/api/candidate/getCandidateByElections?electionId=${electionIdFromUrl}`
    : "/api/candidate/getAllCandidates";
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);
  
  // Extract candidates array from response (handle both array and object responses)
  const candidates = Array.isArray(data) ? data : data?.candidates || [];
  
  // Set selected election from URL on mount
  useEffect(() => {
    if (electionIdFromUrl) {
      setSelectedElection(electionIdFromUrl);
    }
  }, [electionIdFromUrl]);

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

  // Filter candidates based on search and election
  const filteredCandidates = candidates?.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.election?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesElection = selectedElection === "all" || candidate.election?.id === selectedElection;
    return matchesSearch && matchesElection;
  });

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
        <div className="text-xl font-semibold text-red-500">
          Error: {error.message}
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background relative overflow-hidden rounded-lg"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-primary/30 via-blue-400/30 to-blue-300/30 rounded-full blur-[100px] opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-300/30 via-primary/30 to-blue-400/30 rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/30 via-blue-300/30 to-primary/30 rounded-full blur-[100px] opacity-20 animate-blob animation-delay-4000" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />
      </div>

      <div className="mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Kenali Para Kandidat Kita
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Temukan para visioner dan pemimpin yang sedang membentuk masa depan kita dengan ide-ide inovatif dan komitmen untuk perubahan yang positif.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm p-4 rounded-lg border"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari kandidat atau pemilu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          <Button variant="outline" className="gap-2 h-9">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </motion.div>

        {/* Candidates Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredCandidates?.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              variants={itemVariants}
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
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="object-cover w-full h-full rounded-full"
                        />
                        <AvatarFallback className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-2xl">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold mb-0.5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{candidate.election?.title}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Votes</span>
                      <span className="font-medium">{candidate.votePercentage}%</span>
                    </div>
                    <Progress value={parseFloat(candidate.votePercentage)} className="h-1 bg-primary/10" />
                  </div>

                  <Button 
                    className="w-full cursor-pointer gap-1.5 h-7 text-xs "
                    onClick={() => router.push(`/voter/candidates/${candidate.id}`)}
                  >
                    Lihat Profil
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      <Footer />

      </div>

      {/* Add these styles to your global CSS or in a style tag */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  );
}
