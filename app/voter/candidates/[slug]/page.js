"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Vote,
  BarChart3,
  Calendar,
  Users,
  Award,
  BookOpen,
  MessageSquare,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Trophy,
  Target,
  Star,
  Heart,
  Lightbulb,
  Users2,
  FileText,
  Bookmark,
  Clock,
  Building2,
} from "lucide-react";
import Footer from '@/components/voter/footer';

// Fetcher function for SWR
const fetcher = (...args) => fetch(...args).then(res => res.json());

const CandidatePage = ({ params }) => {
  const router = useRouter();
  const slug = React.use(params).slug;
  
  const { data: candidate, error, isLoading } = useSWR(
    `/api/candidate/getCandidateById?id=${slug}`,
    fetcher
  );

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
        <Button onClick={() => router.push('/voter/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  if (!candidate) return null;

  // Calculate vote percentage
  const votePercentage = candidate.election?.totalVotes > 0 
    ? (candidate.voteCount / candidate.election.totalVotes) * 100 
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background relative overflow-hidden rounded-b-lg"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-primary via-blue-400 to-blue-300 rounded-full blur-[100px] opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-300 via-primary to-blue-400 rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 via-blue-300 to-primary rounded-full blur-[100px] opacity-20 animate-blob animation-delay-4000" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />
        
        {/* Animated Blur Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
            {/* Candidate Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-xl transition-transform duration-300"
              >
                <Avatar className="w-full h-full rounded-lg shadow-xl">
                  <AvatarImage 
                    src={candidate.photo} 
                    alt={candidate.name} 
                    className="object-cover w-full h-full" 
                  />
                  <AvatarFallback className="text-4xl bg-primary/20 flex items-center justify-center">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>

            {/* Candidate Info */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="space-y-2">
                <motion.h1 variants={itemVariants} className="text-4xl font-bold">
                  {candidate.name}
                </motion.h1>
                <motion.p variants={itemVariants} className="text-muted-foreground">
                  {candidate.election?.title}
                </motion.p>
              </div>

              {/* Vote Stats */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-4 py-1">
                    <Vote className="mr-2 h-4 w-4" />
                    {candidate.voteCount} votes
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {votePercentage.toFixed(1)}% of total votes
                  </Badge>
                </div>
                <div className="relative">
                  <Progress value={votePercentage} className="h-2 border-2 border-primary" />
                  <span className="absolute right-0 -top-6 text-sm font-medium">
                    {Math.round(votePercentage)}%
                  </span>
                </div>
              </motion.div>

              {/* Stats Overview */}
              {candidate.stats && (
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Experience</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{candidate.stats.experience}%</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Leadership</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{candidate.stats.leadership}%</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Innovation</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{candidate.stats.innovation}%</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Public Support</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{candidate.stats.publicSupport}%</div>
                  </Card>
                </motion.div>
              )}

              {/* Social Links */}
              <motion.div variants={itemVariants} className="flex gap-4">
                {candidate.socialMedia?.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={candidate.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.socialMedia?.facebook && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={candidate.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.socialMedia?.instagram && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={candidate.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.socialMedia?.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={candidate.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.socialMedia?.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={candidate.socialMedia.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 relative">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vision">
              <Target className="mr-2 h-4 w-4" />
              Vision & Mission
            </TabsTrigger>
            <TabsTrigger value="background">
              <BookOpen className="mr-2 h-4 w-4" />
              Background
            </TabsTrigger>
            <TabsTrigger value="campaign">
              <MessageSquare className="mr-2 h-4 w-4" />
              Campaign
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" key="overview" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Short Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {candidate.shortBio}
                    </p>
                  </CardContent>
                </Card>

                {/* Detailed Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Detailed Biography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {candidate.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="vision" key="vision" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Vision */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Vision Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {candidate.vision}
                    </p>
                  </CardContent>
                </Card>

                {/* Mission */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Mission Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {candidate.mission}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="background" key="background" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Education */}
                {candidate.education && candidate.education.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {candidate.education.map((edu, index) => (
                          <motion.div
                            key={`education-${edu.degree}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-start"
                          >
                            <div className="space-y-1">
                              <h3 className="font-medium">{edu.degree}</h3>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            </div>
                            <Badge variant="outline">{edu.year}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Experience */}
                {candidate.experience && candidate.experience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {candidate.experience.map((exp, index) => (
                          <motion.div
                            key={`experience-${exp.position}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-start"
                          >
                            <div className="space-y-1">
                              <h3 className="font-medium">{exp.position}</h3>
                              <p className="text-sm text-muted-foreground">{exp.organization}</p>
                            </div>
                            <Badge variant="outline">{exp.period}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Achievements */}
                {candidate.achievements && candidate.achievements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {candidate.achievements.map((achievement, index) => (
                          <motion.div
                            key={`achievement-${achievement.title}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{achievement.title}</h3>
                              {achievement.year && (
                                <Badge variant="outline">{achievement.year}</Badge>
                              )}
                            </div>
                            {achievement.description && (
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="campaign" key="campaign" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Programs */}
                {candidate.programs && candidate.programs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Campaign Programs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {candidate.programs.map((program, index) => (
                          <motion.div
                            key={`program-${program.title}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <h3 className="font-medium">{program.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Votes */}
                {candidate.recentVotes && candidate.recentVotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Vote className="h-5 w-5" />
                        Recent Votes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {candidate.recentVotes.map((vote, index) => (
                          <motion.div
                            key={`vote-${vote.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>V</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">Vote #{vote.id.slice(-6)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(vote.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">Verified</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Back Button */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={() => router.push('/voter/candidates')}
            variant="outline"
            className="w-full md:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </motion.div>
          <Footer/>
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
        @keyframes pulse-slow {
          0% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
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
};

export default CandidatePage;
