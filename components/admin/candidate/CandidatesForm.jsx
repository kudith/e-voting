"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/validations/CandidateSchema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  XCircle, 
  User, 
  Image, 
  Eye, 
  Target, 
  Info, 
  Gavel, 
  Plus, 
  Trash,
  FileText,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
  BarChart,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CandidatesForm({
  isOpen,
  onClose,
  onSave,
  candidate,
  elections,
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      photo: "",
      vision: "",
      mission: "",
      shortBio: "",
      electionId: "",
      details: "",
      socialMedia: {
        twitter: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        website: "",
      },
      education: [],
      experience: [],
      achievements: [],
      programs: [],
      stats: {
        experience: 0,
        leadership: 0,
        innovation: 0,
        publicSupport: 0,
      },
    },
  });

  // Setup field arrays for repeatable sections
  const educationFields = useFieldArray({ control, name: "education" });
  const experienceFields = useFieldArray({ control, name: "experience" });
  const achievementFields = useFieldArray({ control, name: "achievements" });
  const programFields = useFieldArray({ control, name: "programs" });

  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        reset({
          name: candidate.name || "",
          photo: candidate.photo || "",
          vision: candidate.vision || "",
          mission: candidate.mission || "",
          shortBio: candidate.shortBio || "",
          electionId: candidate.election ? String(candidate.election.id) : "",
          details: candidate.details || "",
          socialMedia: candidate.socialMedia || {
            twitter: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            website: "",
          },
          education: candidate.education || [],
          experience: candidate.experience || [],
          achievements: candidate.achievements || [],
          programs: candidate.programs || [],
          stats: candidate.stats || {
            experience: 0,
            leadership: 0,
            innovation: 0,
            publicSupport: 0,
          },
        });
      } else {
        reset({
          name: "",
          photo: "",
          vision: "",
          mission: "",
          shortBio: "",
          electionId: "",
          details: "",
          socialMedia: {
            twitter: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            website: "",
          },
          education: [],
          experience: [],
          achievements: [],
          programs: [],
          stats: {
            experience: 0,
            leadership: 0,
            innovation: 0,
            publicSupport: 0,
          },
        });
      }
    }
  }, [isOpen, candidate, reset]);

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="bg-background px-6 py-5 border-b">
            <DialogHeader className="mb-0">
              <DialogTitle className="text-xl font-semibold">
                {candidate ? "Edit Kandidat" : "Tambah Kandidat"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {candidate
                  ? "Perbarui informasi kandidat di bawah ini."
                  : "Isi detail kandidat baru di bawah ini."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-6 mb-6">
                  <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                  <TabsTrigger value="details">Biografi Detail</TabsTrigger>
                  <TabsTrigger value="social">Media Sosial</TabsTrigger>
                  <TabsTrigger value="education">Pendidikan</TabsTrigger>
                  <TabsTrigger value="experience">Pengalaman</TabsTrigger>
                  <TabsTrigger value="other">Lainnya</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Nama <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Masukkan nama kandidat"
                        className={cn(
                          "transition-colors",
                          errors.name &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.name && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Photo Field */}
                    <div className="space-y-2">
                      <Label htmlFor="photo" className="flex items-center gap-1.5">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        URL Foto <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="photo"
                        {...register("photo")}
                        placeholder="Masukkan URL foto kandidat"
                        className={cn(
                          "transition-colors",
                          errors.photo &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.photo && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.photo.message}
                        </p>
                      )}
                    </div>

                    {/* Vision Field */}
                    <div className="space-y-2">
                      <Label htmlFor="vision" className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        Visi <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="vision"
                        {...register("vision")}
                        placeholder="Masukkan visi kandidat"
                        className={cn(
                          "transition-colors",
                          errors.vision &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.vision && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.vision.message}
                        </p>
                      )}
                    </div>

                    {/* Mission Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="mission"
                        className="flex items-center gap-1.5"
                      >
                        <Target className="h-4 w-4 text-muted-foreground" />
                        Misi <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="mission"
                        {...register("mission")}
                        placeholder="Masukkan misi kandidat"
                        className={cn(
                          "transition-colors",
                          errors.mission &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.mission && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.mission.message}
                        </p>
                      )}
                    </div>

                    {/* Short Bio Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="shortBio"
                        className="flex items-center gap-1.5"
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                        Bio Singkat <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shortBio"
                        {...register("shortBio")}
                        placeholder="Masukkan bio singkat kandidat"
                        className={cn(
                          "transition-colors",
                          errors.shortBio &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.shortBio && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.shortBio.message}
                        </p>
                      )}
                    </div>

                    {/* Election ID Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="electionId"
                        className="flex items-center gap-1.5"
                      >
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                        Pemilihan <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={watch("electionId")}
                        onValueChange={(value) =>
                          setValue("electionId", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger
                          id="electionId"
                          className={cn(
                            "w-full transition-colors",
                            errors.electionId &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        >
                          <SelectValue placeholder="Pilih pemilihan" />
                        </SelectTrigger>
                        <SelectContent>
                          {elections && elections.length > 0 ? (
                            elections.map((election) => (
                              <SelectItem key={election.id} value={election.id}>
                                {election.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>
                              Tidak ada pemilihan tersedia
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.electionId && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.electionId.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Detailed Biography Tab */}
                <TabsContent value="details" className="mt-0">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="details" 
                        className="flex items-center gap-1.5"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Biografi Lengkap
                      </Label>
                      <Textarea
                        id="details"
                        {...register("details")}
                        placeholder="Tuliskan biografi lengkap kandidat..."
                        className={cn(
                          "min-h-32 transition-colors",
                          errors.details &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.details && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.details.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Tuliskan biografi lengkap kandidat, termasuk latar belakang, karir, dan pencapaian penting.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="twitter" 
                        className="flex items-center gap-1.5"
                      >
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        Twitter
                      </Label>
                      <Input
                        id="twitter"
                        {...register("socialMedia.twitter")}
                        placeholder="URL akun Twitter"
                        className={cn(
                          "transition-colors",
                          errors.socialMedia?.twitter &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.socialMedia?.twitter && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.socialMedia.twitter.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="facebook" 
                        className="flex items-center gap-1.5"
                      >
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        {...register("socialMedia.facebook")}
                        placeholder="URL akun Facebook"
                        className={cn(
                          "transition-colors",
                          errors.socialMedia?.facebook &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.socialMedia?.facebook && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.socialMedia.facebook.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="instagram" 
                        className="flex items-center gap-1.5"
                      >
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        {...register("socialMedia.instagram")}
                        placeholder="URL akun Instagram"
                        className={cn(
                          "transition-colors",
                          errors.socialMedia?.instagram &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.socialMedia?.instagram && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.socialMedia.instagram.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="linkedin" 
                        className="flex items-center gap-1.5"
                      >
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        {...register("socialMedia.linkedin")}
                        placeholder="URL akun LinkedIn"
                        className={cn(
                          "transition-colors",
                          errors.socialMedia?.linkedin &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.socialMedia?.linkedin && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.socialMedia.linkedin.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="website" 
                        className="flex items-center gap-1.5"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        {...register("socialMedia.website")}
                        placeholder="URL website pribadi"
                        className={cn(
                          "transition-colors",
                          errors.socialMedia?.website &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.socialMedia?.website && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.socialMedia.website.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        Riwayat Pendidikan
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => educationFields.append({ 
                          degree: '', 
                          institution: '', 
                          year: '' 
                        })}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Pendidikan
                      </Button>
                    </div>
                    
                    {educationFields.fields.length === 0 ? (
                      <div className="text-center py-8 bg-muted/30 rounded-md">
                        <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Belum ada data pendidikan. Tambahkan pendidikan kandidat.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {educationFields.fields.map((field, index) => (
                          <div 
                            key={field.id} 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/10 relative"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => educationFields.remove(index)}
                              className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`education.${index}.degree`}>
                                Gelar/Tingkat
                              </Label>
                              <Input
                                id={`education.${index}.degree`}
                                {...register(`education.${index}.degree`)}
                                placeholder="Contoh: S1 Teknik Informatika"
                                className={cn(
                                  "transition-colors",
                                  errors.education?.[index]?.degree &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.education?.[index]?.degree && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.education[index].degree.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`education.${index}.institution`}>
                                Institusi
                              </Label>
                              <Input
                                id={`education.${index}.institution`}
                                {...register(`education.${index}.institution`)}
                                placeholder="Contoh: Universitas Indonesia"
                                className={cn(
                                  "transition-colors",
                                  errors.education?.[index]?.institution &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.education?.[index]?.institution && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.education[index].institution.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`education.${index}.year`}>
                                Tahun
                              </Label>
                              <Input
                                id={`education.${index}.year`}
                                {...register(`education.${index}.year`)}
                                placeholder="Contoh: 2010-2014"
                                className={cn(
                                  "transition-colors",
                                  errors.education?.[index]?.year &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.education?.[index]?.year && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.education[index].year.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        Pengalaman Kerja
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => experienceFields.append({ 
                          position: '', 
                          organization: '', 
                          period: '' 
                        })}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Pengalaman
                      </Button>
                    </div>
                    
                    {experienceFields.fields.length === 0 ? (
                      <div className="text-center py-8 bg-muted/30 rounded-md">
                        <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Belum ada data pengalaman. Tambahkan pengalaman kerja kandidat.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {experienceFields.fields.map((field, index) => (
                          <div 
                            key={field.id} 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/10 relative"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => experienceFields.remove(index)}
                              className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`experience.${index}.position`}>
                                Posisi/Jabatan
                              </Label>
                              <Input
                                id={`experience.${index}.position`}
                                {...register(`experience.${index}.position`)}
                                placeholder="Contoh: Ketua BEM"
                                className={cn(
                                  "transition-colors",
                                  errors.experience?.[index]?.position &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.experience?.[index]?.position && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.experience[index].position.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`experience.${index}.organization`}>
                                Organisasi/Instansi
                              </Label>
                              <Input
                                id={`experience.${index}.organization`}
                                {...register(`experience.${index}.organization`)}
                                placeholder="Contoh: Fakultas Teknik UI"
                                className={cn(
                                  "transition-colors",
                                  errors.experience?.[index]?.organization &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.experience?.[index]?.organization && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.experience[index].organization.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`experience.${index}.period`}>
                                Periode
                              </Label>
                              <Input
                                id={`experience.${index}.period`}
                                {...register(`experience.${index}.period`)}
                                placeholder="Contoh: 2018-2019"
                                className={cn(
                                  "transition-colors",
                                  errors.experience?.[index]?.period &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              {errors.experience?.[index]?.period && (
                                <p className="text-destructive text-xs flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {errors.experience[index].period.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Other Tab (Achievements, Programs, Stats) */}
                <TabsContent value="other" className="mt-0">
                  <div className="space-y-8">
                    {/* Achievements Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Award className="h-5 w-5 text-muted-foreground" />
                          Penghargaan & Prestasi
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => achievementFields.append({ 
                            title: '', 
                            description: '', 
                            year: '' 
                          })}
                          className="gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Tambah Prestasi
                        </Button>
                      </div>
                      
                      {achievementFields.fields.length === 0 ? (
                        <div className="text-center py-8 bg-muted/30 rounded-md">
                          <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Belum ada data prestasi. Tambahkan prestasi kandidat.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {achievementFields.fields.map((field, index) => (
                            <div 
                              key={field.id} 
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/10 relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => achievementFields.remove(index)}
                                className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`achievements.${index}.title`}>
                                  Judul Prestasi
                                </Label>
                                <Input
                                  id={`achievements.${index}.title`}
                                  {...register(`achievements.${index}.title`)}
                                  placeholder="Contoh: Penghargaan Aktivis Terbaik"
                                  className={cn(
                                    "transition-colors",
                                    errors.achievements?.[index]?.title &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                                {errors.achievements?.[index]?.title && (
                                  <p className="text-destructive text-xs flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.achievements[index].title.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`achievements.${index}.year`}>
                                  Tahun
                                </Label>
                                <Input
                                  id={`achievements.${index}.year`}
                                  {...register(`achievements.${index}.year`)}
                                  placeholder="Contoh: 2020"
                                  className={cn(
                                    "transition-colors",
                                    errors.achievements?.[index]?.year &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                                {errors.achievements?.[index]?.year && (
                                  <p className="text-destructive text-xs flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.achievements[index].year.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2 md:col-span-3">
                                <Label htmlFor={`achievements.${index}.description`}>
                                  Deskripsi (Opsional)
                                </Label>
                                <Textarea
                                  id={`achievements.${index}.description`}
                                  {...register(`achievements.${index}.description`)}
                                  placeholder="Deskripsi singkat tentang prestasi ini..."
                                  className={cn(
                                    "transition-colors min-h-20",
                                    errors.achievements?.[index]?.description &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                                {errors.achievements?.[index]?.description && (
                                  <p className="text-destructive text-xs flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.achievements[index].description.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />
                    
                    {/* Programs Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-muted-foreground" />
                          Program Kampanye
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => programFields.append({ 
                            title: '', 
                            description: '', 
                          })}
                          className="gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Tambah Program
                        </Button>
                      </div>
                      
                      {programFields.fields.length === 0 ? (
                        <div className="text-center py-8 bg-muted/30 rounded-md">
                          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Belum ada program kampanye. Tambahkan program kandidat.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {programFields.fields.map((field, index) => (
                            <div 
                              key={field.id} 
                              className="grid grid-cols-1 gap-4 p-4 border rounded-md bg-muted/10 relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => programFields.remove(index)}
                                className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`programs.${index}.title`}>
                                  Judul Program
                                </Label>
                                <Input
                                  id={`programs.${index}.title`}
                                  {...register(`programs.${index}.title`)}
                                  placeholder="Contoh: Transparansi Anggaran"
                                  className={cn(
                                    "transition-colors",
                                    errors.programs?.[index]?.title &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                                {errors.programs?.[index]?.title && (
                                  <p className="text-destructive text-xs flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.programs[index].title.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`programs.${index}.description`}>
                                  Deskripsi Program
                                </Label>
                                <Textarea
                                  id={`programs.${index}.description`}
                                  {...register(`programs.${index}.description`)}
                                  placeholder="Penjelasan detail tentang program ini..."
                                  className={cn(
                                    "transition-colors min-h-20",
                                    errors.programs?.[index]?.description &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                                {errors.programs?.[index]?.description && (
                                  <p className="text-destructive text-xs flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.programs[index].description.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />
                    
                    {/* Statistics Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                        Statistik Performa
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="stats.experience">
                              Pengalaman
                            </Label>
                            <span className="text-sm font-medium">
                              {watch("stats.experience") || 0}/100
                            </span>
                          </div>
                          <Slider
                            id="stats.experience"
                            value={[watch("stats.experience") || 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setValue("stats.experience", value[0])}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="stats.leadership">
                              Kepemimpinan
                            </Label>
                            <span className="text-sm font-medium">
                              {watch("stats.leadership") || 0}/100
                            </span>
                          </div>
                          <Slider
                            id="stats.leadership"
                            value={[watch("stats.leadership") || 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setValue("stats.leadership", value[0])}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="stats.innovation">
                              Inovasi
                            </Label>
                            <span className="text-sm font-medium">
                              {watch("stats.innovation") || 0}/100
                            </span>
                          </div>
                          <Slider
                            id="stats.innovation"
                            value={[watch("stats.innovation") || 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setValue("stats.innovation", value[0])}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="stats.publicSupport">
                              Dukungan Publik
                            </Label>
                            <span className="text-sm font-medium">
                              {watch("stats.publicSupport") || 0}/100
                            </span>
                          </div>
                          <Slider
                            id="stats.publicSupport"
                            value={[watch("stats.publicSupport") || 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setValue("stats.publicSupport", value[0])}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/50 border-t flex flex-col sm:flex-row gap-2 md:gap-2 sm:gap-0 sm:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Go to previous tab based on current tab
                    const tabs = ["basic", "details", "social", "education", "experience", "other"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={activeTab === "basic"}
                >
                  Sebelumnya
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Go to next tab based on current tab
                    const tabs = ["basic", "details", "social", "education", "experience", "other"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                  disabled={activeTab === "other"}
                >
                  Selanjutnya
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                  type="button"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {candidate ? "Perbarui Kandidat" : "Tambah Kandidat"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
