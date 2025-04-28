"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Eye,
  Target,
  Info,
  Gavel,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
  BarChart,
  Calendar,
  Link,
  FileText,
  ExternalLink,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Building,
  Clock,
  Edit,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CandidateDetailView({
  isOpen,
  onClose,
  candidate,
  onEdit,
}) {
  if (!candidate) return null;

  const hasSocialMedia = candidate.socialMedia && (
    candidate.socialMedia.twitter ||
    candidate.socialMedia.facebook ||
    candidate.socialMedia.instagram ||
    candidate.socialMedia.linkedin ||
    candidate.socialMedia.website
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header with Candidate Basic Info */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-5 border-b">
            <DialogHeader className="mb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <img 
                    src={candidate.photo} 
                    alt={candidate.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    {candidate.name}
                  </DialogTitle>
                  <DialogDescription>
                    {candidate.shortBio}
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(candidate);
                }}
                className="flex-shrink-0 gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit Kandidat
              </Button>
            </DialogHeader>
          </div>

          {/* Main Content with Tabs */}
          <Tabs defaultValue="profile" className="flex-1 overflow-hidden">
            <div className="bg-background border-b px-6">
              <TabsList className="py-2 w-full justify-start bg-transparent h-auto">
                <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-muted">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="education" className="rounded-md data-[state=active]:bg-muted">
                  Pendidikan & Pengalaman
                </TabsTrigger>
                <TabsTrigger value="programs" className="rounded-md data-[state=active]:bg-muted">
                  Prestasi & Program
                </TabsTrigger>
                <TabsTrigger value="stats" className="rounded-md data-[state=active]:bg-muted">
                  Statistik
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Visi
                    </div>
                    <div className="text-base bg-muted/30 p-3 rounded-md">
                      {candidate.vision}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      Misi
                    </div>
                    <div className="text-base bg-muted/30 p-3 rounded-md">
                      {candidate.mission}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Biografi Lengkap
                  </div>
                  <div className="text-base bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                    {candidate.details || "Tidak ada biografi lengkap"}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Gavel className="h-4 w-4" />
                    Partisipasi Pemilihan
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    {candidate.election ? (
                      <div className="space-y-2">
                        <div className="font-medium">{candidate.election.title}</div>
                        <div className="text-sm text-muted-foreground">{candidate.election.description}</div>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <Badge variant="outline" className="bg-primary/5 text-primary flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(candidate.election.startDate).toLocaleDateString()} - {new Date(candidate.election.endDate).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className={cn(
                            "flex items-center gap-1",
                            candidate.election.status === "ongoing" ? "bg-green-500/10 text-green-500" :
                            candidate.election.status === "completed" ? "bg-blue-500/10 text-blue-500" :
                            "bg-amber-500/10 text-amber-500"
                          )}>
                            <Clock className="h-3 w-3" />
                            {candidate.election.status === "ongoing" ? "Sedang Berlangsung" :
                             candidate.election.status === "completed" ? "Selesai" : "Akan Datang"}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Tidak terdaftar dalam pemilihan</div>
                    )}
                  </div>
                </div>
                
                {hasSocialMedia && (
                  <>
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        Media Sosial
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {candidate.socialMedia?.twitter && (
                          <a 
                            href={candidate.socialMedia.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                          >
                            <Twitter className="h-4 w-4" />
                            Twitter
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {candidate.socialMedia?.facebook && (
                          <a 
                            href={candidate.socialMedia.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                          >
                            <Facebook className="h-4 w-4" />
                            Facebook
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {candidate.socialMedia?.instagram && (
                          <a 
                            href={candidate.socialMedia.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-md transition-colors"
                          >
                            <Instagram className="h-4 w-4" />
                            Instagram
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {candidate.socialMedia?.linkedin && (
                          <a 
                            href={candidate.socialMedia.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {candidate.socialMedia?.website && (
                          <a 
                            href={candidate.socialMedia.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Education & Experience Tab */}
              <TabsContent value="education" className="mt-0 space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium">Riwayat Pendidikan</h3>
                  </div>
                  
                  {candidate.education && candidate.education.length > 0 ? (
                    <div className="grid gap-4">
                      {candidate.education.map((edu, index) => (
                        <div key={edu.id || index} className="bg-muted/30 p-4 rounded-lg border border-muted">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-primary">{edu.degree}</h4>
                              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Building className="h-3.5 w-3.5" />
                                {edu.institution}
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 self-start md:self-center">
                              {edu.year}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md text-muted-foreground">
                      Tidak ada data pendidikan
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-medium">Pengalaman Kerja</h3>
                  </div>
                  
                  {candidate.experience && candidate.experience.length > 0 ? (
                    <div className="grid gap-4">
                      {candidate.experience.map((exp, index) => (
                        <div key={exp.id || index} className="bg-muted/30 p-4 rounded-lg border border-muted">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-primary">{exp.position}</h4>
                              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Building className="h-3.5 w-3.5" />
                                {exp.organization}
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 self-start md:self-center">
                              {exp.period}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md text-muted-foreground">
                      Tidak ada data pengalaman kerja
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Programs & Achievements Tab */}
              <TabsContent value="programs" className="mt-0 space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-medium">Prestasi & Penghargaan</h3>
                  </div>
                  
                  {candidate.achievements && candidate.achievements.length > 0 ? (
                    <div className="grid gap-4">
                      {candidate.achievements.map((achievement, index) => (
                        <div key={achievement.id || index} className="bg-muted/30 p-4 rounded-lg border border-muted">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="font-medium text-primary flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-600" />
                                {achievement.title}
                              </h4>
                              {achievement.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {achievement.description}
                                </p>
                              )}
                            </div>
                            {achievement.year && (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 self-start">
                                {achievement.year}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md text-muted-foreground">
                      Tidak ada data prestasi
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Program Kampanye</h3>
                  </div>
                  
                  {candidate.programs && candidate.programs.length > 0 ? (
                    <div className="grid gap-4">
                      {candidate.programs.map((program, index) => (
                        <div key={program.id || index} className="bg-muted/30 p-4 rounded-lg border border-muted">
                          <div className="space-y-2">
                            <h4 className="font-medium text-primary flex items-center gap-2">
                              <ChevronRight className="h-4 w-4 text-blue-600" />
                              {program.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {program.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md text-muted-foreground">
                      Tidak ada data program kampanye
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="mt-0 space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Statistik Performa</h3>
                  </div>
                  
                  {candidate.stats ? (
                    <div className="grid gap-8 p-4 bg-muted/20 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Pengalaman</span>
                          <span>{candidate.stats.experience}/100</span>
                        </div>
                        <Progress value={candidate.stats.experience} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Kepemimpinan</span>
                          <span>{candidate.stats.leadership}/100</span>
                        </div>
                        <Progress value={candidate.stats.leadership} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Inovasi</span>
                          <span>{candidate.stats.innovation}/100</span>
                        </div>
                        <Progress value={candidate.stats.innovation} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Dukungan Publik</span>
                          <span>{candidate.stats.publicSupport}/100</span>
                        </div>
                        <Progress value={candidate.stats.publicSupport} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md text-muted-foreground">
                      Tidak ada data statistik performa
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Informasi Voting</h3>
                  </div>
                  
                  <div className="grid gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Jumlah Suara</div>
                          <div className="text-2xl font-bold text-primary">{candidate.voteCount || 0}</div>
                        </div>
                        
                        <div className="bg-primary/5 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Persentase</div>
                          <div className="text-2xl font-bold text-primary">{candidate.votePercentage || 0}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="px-6 py-4 bg-muted/50 border-t flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 