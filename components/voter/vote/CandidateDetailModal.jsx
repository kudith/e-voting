"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Award, Briefcase, BookOpen, LayoutGrid, Target, ExternalLink, Star, Trophy, Vote, GraduationCap } from "lucide-react";
import Image from "next/image";

export function CandidateDetailModal({ isOpen, onClose, candidate }) {
  if (!candidate) return null;
  
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="flex flex-col items-center text-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24">
                    {candidate.photo ? (
                      <AvatarImage src={candidate.photo} alt={candidate.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">{getInitials(candidate.name)}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <DialogTitle className="text-2xl font-bold">{candidate.name}</DialogTitle>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {candidate.voteCount || 0} Suara
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="campaign">Campaign</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <LayoutGrid className="w-4 h-4 mr-2 text-primary" />
                        About
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {candidate.shortBio || "No short bio available."}
                      </p>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-primary" />
                        Detailed Biography
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.details || "No detailed bio available."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vision & Mission Tab */}
                <TabsContent value="vision" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-primary" />
                        Vision
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {candidate.vision || "No vision statement available."}
                      </p>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-primary" />
                        Mission
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.mission || "No mission statement available."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Background Tab */}
                <TabsContent value="background" className="space-y-4">
                  {/* Education */}
                  {candidate.education && candidate.education.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                          Education
                        </h3>
                        <div className="space-y-4">
                          {candidate.education.map((edu, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-semibold">{edu.degree}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {edu.year}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                              {edu.description && (
                                <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {/* Experience */}
                  {candidate.experience && candidate.experience.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-primary" />
                          Experience
                        </h3>
                        <div className="space-y-4">
                          {candidate.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-semibold">{exp.position}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {exp.period}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{exp.organization}</p>
                              {exp.description && (
                                <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {/* Achievements */}
                  {candidate.achievements && candidate.achievements.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-primary" />
                          Achievements
                        </h3>
                        <div className="space-y-4">
                          {candidate.achievements.map((achievement, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-semibold">{achievement.title}</h4>
                                {achievement.year && (
                                  <Badge variant="outline" className="text-xs">{achievement.year}</Badge>
                                )}
                              </div>
                              {achievement.description && (
                                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Campaign Tab */}
                <TabsContent value="campaign" className="space-y-4">
                  {/* Programs */}
                  {candidate.programs && candidate.programs.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-primary" />
                          Campaign Programs
                        </h3>
                        <div className="space-y-4">
                          {candidate.programs.map((program, index) => (
                            <div key={index} className="rounded-lg bg-muted p-4">
                              <h4 className="text-sm font-semibold mb-1">{program.title}</h4>
                              <p className="text-xs text-muted-foreground">{program.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {/* Recent Votes */}
                  {candidate.recentVotes && candidate.recentVotes.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Vote className="w-4 h-4 mr-2 text-primary" />
                          Recent Votes
                        </h3>
                        <div className="space-y-4">
                          {candidate.recentVotes.map((vote, index) => (
                            <div key={index} className="flex justify-between items-center">
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
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 