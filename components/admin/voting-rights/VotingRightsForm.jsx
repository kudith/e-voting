"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { LoadingModal } from "@/components/ui/loading-modal";
import { Users2, Vote, CheckCircle2, XCircle, Save, Plus, User, Calendar, AlertCircle, Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Validation schema using Zod
const voterElectionSchema = z.object({
  voterId: z.string().min(1, "Pemilih wajib dipilih"),
  electionId: z.string().min(1, "Pemilu wajib dipilih"),
  isEligible: z.boolean(),
});

export default function VotingRightsForm({ isOpen, onClose, onSave, voterElection }) {
  const [formData, setFormData] = useState({
    voterId: "",
    electionId: "",
    isEligible: true,
  });

  // Batch assignment state
  const [batchData, setBatchData] = useState({
    electionId: "",
    isEligible: true,
    filterType: "major", // major, faculty, year
    selectedMajor: "",
    selectedFaculty: "",
    selectedYear: "",
    selectedVoters: [],
  });

  const [voters, setVoters] = useState([]);
  const [elections, setElections] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [years, setYears] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  // Fetch voters and elections data when form is opened
  useEffect(() => {
    if (isOpen) {
      fetchVoters();
      fetchElections();
      fetchFaculties();
      if (voterElection) {
        setFormData({
          voterId: voterElection.voter.id,
          electionId: voterElection.election.id,
          isEligible: voterElection.isEligible,
        });
        setActiveTab("single");
      } else {
        setFormData({
          voterId: "",
          electionId: "",
          isEligible: true,
        });
        setBatchData({
          electionId: "",
          isEligible: true,
          filterType: "major",
          selectedMajor: "",
          selectedFaculty: "",
          selectedYear: "",
          selectedVoters: [],
        });
      }
      setErrors({});
    }
  }, [isOpen, voterElection]);

  // Fetch voters data
  const fetchVoters = async () => {
    try {
      const response = await fetch("/api/voter/getAllVoters");
      if (!response.ok) {
        throw new Error("Gagal mengambil data pemilih");
      }
      const data = await response.json();
      setVoters(data);
      
      // Extract unique years
      const uniqueYears = [...new Set(data.map(voter => voter.year))].filter(Boolean).sort();
      setYears(uniqueYears);
    } catch (error) {
      console.error("Error fetching voters:", error);
      toast.error("Kesalahan", {
        description: "Gagal memuat data pemilih.",
      });
    }
  };

  // Fetch elections data
  const fetchElections = async () => {
    try {
      const response = await fetch("/api/election/getAllElections");
      if (!response.ok) {
        throw new Error("Gagal mengambil data pemilu");
      }
      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error("Error fetching elections:", error);
      toast.error("Kesalahan", {
        description: "Gagal memuat data pemilu.",
      });
    }
  };

  // Fetch faculties data
  const fetchFaculties = async () => {
    try {
      const response = await fetch("/api/faculty/getAllFaculties");
      if (!response.ok) {
        throw new Error("Gagal mengambil data fakultas");
      }
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Kesalahan", {
        description: "Gagal memuat data fakultas.",
      });
    }
  };

  // Fetch majors data
  const fetchMajors = async (facultyId) => {
    if (!facultyId) return;
    
    try {
      const response = await fetch(`/api/major/getMajorsByFaculty?facultyId=${facultyId}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data jurusan");
      }
      const data = await response.json();
      setMajors(data);
    } catch (error) {
      console.error("Error fetching majors:", error);
      toast.error("Kesalahan", {
        description: "Gagal memuat data jurusan.",
      });
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Handle batch field changes
  const handleBatchFieldChange = (field, value) => {
    setBatchData((prev) => ({ ...prev, [field]: value }));
    
    // If faculty is changed, fetch majors for that faculty
    if (field === "selectedFaculty") {
      fetchMajors(value);
    }
    
    // Apply filters when relevant fields change
    if (["filterType", "selectedMajor", "selectedFaculty", "selectedYear"].includes(field)) {
      applyFilters({
        ...batchData,
        [field]: value
      });
    }
  };

  // Apply filters to voters based on batch criteria
  const applyFilters = (data) => {
    let filtered = [...voters];
    
    if (data.filterType === "major" && data.selectedMajor) {
      filtered = filtered.filter(voter => voter.majorId === data.selectedMajor);
    } else if (data.filterType === "faculty" && data.selectedFaculty) {
      filtered = filtered.filter(voter => voter.facultyId === data.selectedFaculty);
    } else if (data.filterType === "year" && data.selectedYear) {
      filtered = filtered.filter(voter => voter.year === data.selectedYear);
    }
    
    setFilteredVoters(filtered);
    setBatchData(prev => ({
      ...prev,
      selectedVoters: filtered.map(voter => voter.id)
    }));
  };

  // Toggle voter selection in batch mode
  const toggleVoterSelection = (voterId) => {
    setBatchData(prev => {
      const isSelected = prev.selectedVoters.includes(voterId);
      const newSelectedVoters = isSelected
        ? prev.selectedVoters.filter(id => id !== voterId)
        : [...prev.selectedVoters, voterId];
      
      return {
        ...prev,
        selectedVoters: newSelectedVoters
      };
    });
  };

  // Select all filtered voters
  const selectAllVoters = (checked) => {
    setBatchData(prev => ({
      ...prev,
      selectedVoters: checked ? filteredVoters.map(voter => voter.id) : []
    }));
  };

  // Validate a single field
  const validateField = (field, value) => {
    try {
      const fieldSchema = voterElectionSchema.pick({ [field]: true });
      fieldSchema.parse({ [field]: value });
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0]?.message,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      voterElectionSchema.parse(formData);
      setErrors({});

      setIsSubmitting(true);

      // Prepare payload
      const payload = {
        voterId: formData.voterId,
        electionId: formData.electionId,
        isEligible: formData.isEligible,
        hasVoted: voterElection ? voterElection.hasVoted : false, // Keep existing hasVoted status when editing
      };

      // Determine endpoint and method
      const endpoint = voterElection
        ? `/api/voterElection/updateVoterElection?id=${voterElection.id}`
        : `/api/voterElection/createVoterElection`;
      const method = voterElection ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      // Parse response data
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          if (data.error) {
            // Translate common error messages to Indonesian
            let errorMessage = data.error;
            if (data.error === "VoterElection already exists for this voter and election") {
              errorMessage = "Hak pilih sudah ada untuk pemilih dan pemilu ini";
            } else if (data.error === "Invalid voterId, no matching voter found") {
              errorMessage = "ID pemilih tidak valid, pemilih tidak ditemukan";
            } else if (data.error === "Invalid electionId, no matching election found") {
              errorMessage = "ID pemilu tidak valid, pemilu tidak ditemukan";
            } else if (data.error === "Election has not started yet") {
              errorMessage = "Pemilu belum dimulai";
            } else if (data.error === "Election has already ended") {
              errorMessage = "Pemilu sudah berakhir";
            }
            
            toast.info("Informasi Hak Pilih", {
              description: errorMessage,
            });
          } else if (data.errors && data.errors.length > 0) {
            // Translate validation errors to Indonesian
            const translatedErrors = data.errors.map(error => {
              if (error.includes("VoterElection already exists")) {
                return "Hak pilih sudah ada untuk pemilih dan pemilu ini";
              }
              return error;
            });
            
            toast.info("Informasi Validasi", {
              description: (
                <div className="mt-2 text-sm">
                  <ul className="list-disc pl-5">
                    {translatedErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              ),
              duration: 5000,
            });
          } else {
            toast.info("Informasi", {
              description: "Data yang dimasukkan tidak valid. Silakan periksa kembali.",
            });
          }
        } else {
          toast.error("Kesalahan", {
            description: data.error || "Gagal menyimpan hak pilih. Silakan coba lagi.",
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Reset form and close modal
      resetForm();
      onSave(data);
      onClose();
      
      // Show success toast
      toast.success("Berhasil", {
        description: voterElection 
          ? "Hak pilih berhasil diperbarui." 
          : "Hak pilih berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Error saving voting right:", error);
      
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const formattedErrors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        
        toast.error("Kesalahan Validasi", {
          description: "Silakan periksa kembali data yang dimasukkan.",
        });
      } else {
        toast.error("Kesalahan", {
          description: error.message || "Gagal menyimpan hak pilih. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle batch submission
  const handleBatchSubmit = async () => {
    try {
      // Validate batch data
      if (!batchData.electionId) {
        setErrors({ electionId: "Pemilu wajib dipilih" });
        return;
      }
      
      if (batchData.selectedVoters.length === 0) {
        toast.error("Kesalahan", {
          description: "Pilih minimal satu pemilih.",
        });
        return;
      }
      
      setIsSubmitting(true);
      
      // Create voting rights for each selected voter
      const promises = batchData.selectedVoters.map(voterId => {
        const payload = {
          voterId,
          electionId: batchData.electionId,
          isEligible: batchData.isEligible,
          hasVoted: false,
        };
        
        return fetch("/api/voterElection/createVoterElection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).then(async (response) => {
          // Return both the response and the parsed error data if available
          const data = await response.json().catch(() => ({}));
          return { response, data };
        });
      });
      
      const results = await Promise.all(promises);
      
      // Check if any requests failed
      const failedRequests = results.filter(result => !result.response.ok);
      
      if (failedRequests.length > 0) {
        // Get detailed error messages if available
        const errorMessages = failedRequests.map(result => {
          if (result.data && result.data.error) {
            // Translate common error messages to Indonesian
            if (result.data.error === "VoterElection already exists for this voter and election") {
              return "Hak pilih sudah ada untuk pemilih dan pemilu ini";
            } else if (result.data.error === "Invalid voterId, no matching voter found") {
              return "ID pemilih tidak valid, pemilih tidak ditemukan";
            } else if (result.data.error === "Invalid electionId, no matching election found") {
              return "ID pemilu tidak valid, pemilu tidak ditemukan";
            } else if (result.data.error === "Election has not started yet") {
              return "Pemilu belum dimulai";
            } else if (result.data.error === "Election has already ended") {
              return "Pemilu sudah berakhir";
            }
            return result.data.error;
          } else if (result.data && result.data.errors && result.data.errors.length > 0) {
            return result.data.errors.join(', ');
          } else {
            return `Error ${result.response.status}: ${result.response.statusText}`;
          }
        });
        
        // Show a more detailed error message using info toast for 400 errors
        const has400Error = failedRequests.some(result => result.response.status === 400);
        
        if (has400Error) {
          toast.info("Informasi Hak Pilih", {
            description: (
              <div className="mt-2 text-sm">
                <p>Gagal menambahkan {failedRequests.length} hak pilih:</p>
                <ul className="list-disc pl-5 mt-1">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            ),
            duration: 5000,
          });
        } else {
          toast.error("Gagal Menambahkan Hak Pilih", {
            description: (
              <div className="mt-2 text-sm">
                <p>Gagal menambahkan {failedRequests.length} hak pilih:</p>
                <ul className="list-disc pl-5 mt-1">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            ),
            duration: 5000,
          });
        }
        
        // Don't throw an error, just return early
        setIsSubmitting(false);
        return;
      }
      
      // Reset form and close modal
      resetForm();
      onSave({ success: true, count: batchData.selectedVoters.length });
      onClose();
      
      // Show success toast
      toast.success("Berhasil", {
        description: `${batchData.selectedVoters.length} hak pilih berhasil ditambahkan.`,
      });
    } catch (error) {
      console.error("Error saving batch voting rights:", error);
      toast.error("Kesalahan", {
        description: error.message || "Gagal menyimpan hak pilih. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      voterId: "",
      electionId: "",
      isEligible: true,
    });
    setBatchData({
      electionId: "",
      isEligible: true,
      filterType: "major",
      selectedMajor: "",
      selectedFaculty: "",
      selectedYear: "",
      selectedVoters: [],
    });
    setErrors({});
  };

  // Get selected voter details
  const getSelectedVoter = () => {
    return voters.find(voter => voter.id === formData.voterId);
  };

  // Get selected election details
  const getSelectedElection = () => {
    return elections.find(election => election.id === formData.electionId);
  };

  // Get selected batch election details
  const getSelectedBatchElection = () => {
    return elections.find(election => election.id === batchData.electionId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-lg">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-background px-6 py-5 border-b">
                  <DialogHeader className="mb-0">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                      {voterElection ? (
                        <>
                          <Vote className="h-5 w-5 text-primary" />
                          Edit Hak Pilih
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-primary" />
                          Tambah Hak Pilih Baru
                        </>
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {voterElection
                        ? "Perbarui informasi hak pilih di bawah ini."
                        : "Isi informasi hak pilih baru di bawah ini."}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Form content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {!voterElection && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Tambah Tunggal
                        </TabsTrigger>
                        <TabsTrigger value="bulk" className="flex items-center gap-2">
                          <Users2 className="h-4 w-4" />
                          Tambah Massal
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="single" className="mt-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          Tambahkan hak pilih untuk satu pemilih pada satu pemilu.
                        </div>
                      </TabsContent>
                      <TabsContent value="bulk" className="mt-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          Tambahkan hak pilih untuk banyak pemilih sekaligus pada satu pemilu berdasarkan kriteria tertentu.
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {activeTab === "single" && (
                    <div className="space-y-6">
                      {/* Pemilih */}
                      <div className="space-y-2">
                        <Label htmlFor="voterId" className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Pemilih <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Select
                            value={formData.voterId}
                            onValueChange={(value) => handleFieldChange("voterId", value)}
                            disabled={!!voterElection}
                          >
                            <SelectTrigger 
                              id="voterId"
                              className={cn(
                                "transition-colors",
                                errors.voterId && "border-destructive focus-visible:ring-destructive"
                              )}
                            >
                              <SelectValue placeholder="Pilih pemilih" />
                            </SelectTrigger>
                            <SelectContent>
                              {voters.map((voter) => (
                                <SelectItem key={voter.id} value={voter.id}>
                                  {voter.name} - {voter.voterCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.voterId && (
                          <p className="text-destructive text-xs flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.voterId}
                          </p>
                        )}
                        
                        {formData.voterId && getSelectedVoter() && (
                          <div className="mt-2 p-3 bg-muted/30 rounded-md border border-muted-foreground/20">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{getSelectedVoter().name}</h4>
                                <p className="text-sm text-muted-foreground">{getSelectedVoter().email}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="font-mono text-[13px] bg-muted/30 border-muted-foreground/20 px-2 py-0.5">
                                    {getSelectedVoter().voterCode}
                                  </Badge>
                                  {getSelectedVoter().faculty && (
                                    <Badge variant="outline" className="text-xs">
                                      {getSelectedVoter().faculty.name}
                                    </Badge>
                                  )}
                                  {getSelectedVoter().major && (
                                    <Badge variant="outline" className="text-xs">
                                      {getSelectedVoter().major.name}
                                    </Badge>
                                  )}
                                  {getSelectedVoter().year && (
                                    <Badge variant="outline" className="text-xs">
                                      Angkatan {getSelectedVoter().year}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pemilu */}
                      <div className="space-y-2">
                        <Label htmlFor="electionId" className="flex items-center gap-1.5">
                          <Vote className="h-4 w-4 text-muted-foreground" />
                          Pemilu <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Select
                            value={formData.electionId}
                            onValueChange={(value) => handleFieldChange("electionId", value)}
                          >
                            <SelectTrigger 
                              id="electionId"
                              className={cn(
                                "transition-colors",
                                errors.electionId && "border-destructive focus-visible:ring-destructive"
                              )}
                            >
                              <SelectValue placeholder="Pilih pemilu" />
                            </SelectTrigger>
                            <SelectContent>
                              {elections.map((election) => (
                                <SelectItem key={election.id} value={election.id}>
                                  {election.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.electionId && (
                          <p className="text-destructive text-xs flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.electionId}
                          </p>
                        )}
                        
                        {formData.electionId && getSelectedElection() && (
                          <div className="mt-2 p-3 bg-muted/30 rounded-md border border-muted-foreground/20">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Vote className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{getSelectedElection().title}</h4>
                                <p className="text-sm text-muted-foreground">{getSelectedElection().description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(getSelectedElection().startDate).toLocaleDateString('id-ID')} - {new Date(getSelectedElection().endDate).toLocaleDateString('id-ID')}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs",
                                      getSelectedElection().status === "active" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
                                      getSelectedElection().status === "upcoming" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                                      getSelectedElection().status === "ended" && "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                                    )}
                                  >
                                    {getSelectedElection().status === "active" ? "Aktif" : 
                                     getSelectedElection().status === "upcoming" ? "Akan Datang" : 
                                     getSelectedElection().status === "ended" ? "Selesai" : getSelectedElection().status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Kelayakan */}
                      <div className="space-y-2">
                        <Label htmlFor="isEligible" className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          Status Kelayakan <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Select
                            value={formData.isEligible.toString()}
                            onValueChange={(value) => handleFieldChange("isEligible", value === "true")}
                          >
                            <SelectTrigger 
                              id="isEligible"
                              className={cn(
                                "transition-colors",
                                errors.isEligible && "border-destructive focus-visible:ring-destructive"
                              )}
                            >
                              <SelectValue placeholder="Pilih status kelayakan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Memenuhi Syarat</SelectItem>
                              <SelectItem value="false">Tidak Memenuhi Syarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.isEligible && (
                          <p className="text-destructive text-xs flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.isEligible}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "bulk" && (
                    <div className="space-y-6">
                      {/* Pemilu */}
                      <div className="space-y-2">
                        <Label htmlFor="batchElectionId" className="flex items-center gap-1.5">
                          <Vote className="h-4 w-4 text-muted-foreground" />
                          Pemilu <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Select
                            value={batchData.electionId}
                            onValueChange={(value) => handleBatchFieldChange("electionId", value)}
                          >
                            <SelectTrigger 
                              id="batchElectionId"
                              className={cn(
                                "transition-colors",
                                errors.electionId && "border-destructive focus-visible:ring-destructive"
                              )}
                            >
                              <SelectValue placeholder="Pilih pemilu" />
                            </SelectTrigger>
                            <SelectContent>
                              {elections.map((election) => (
                                <SelectItem key={election.id} value={election.id}>
                                  {election.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.electionId && (
                          <p className="text-destructive text-xs flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.electionId}
                          </p>
                        )}
                        
                        {batchData.electionId && getSelectedBatchElection() && (
                          <div className="mt-2 p-3 bg-muted/30 rounded-md border border-muted-foreground/20">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Vote className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{getSelectedBatchElection().title}</h4>
                                <p className="text-sm text-muted-foreground">{getSelectedBatchElection().description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(getSelectedBatchElection().startDate).toLocaleDateString('id-ID')} - {new Date(getSelectedBatchElection().endDate).toLocaleDateString('id-ID')}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs",
                                      getSelectedBatchElection().status === "active" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
                                      getSelectedBatchElection().status === "upcoming" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                                      getSelectedBatchElection().status === "ended" && "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                                    )}
                                  >
                                    {getSelectedBatchElection().status === "active" ? "Aktif" : 
                                     getSelectedBatchElection().status === "upcoming" ? "Akan Datang" : 
                                     getSelectedBatchElection().status === "ended" ? "Selesai" : getSelectedBatchElection().status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Filter Type */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          Filter Berdasarkan
                        </Label>
                        <RadioGroup 
                          value={batchData.filterType} 
                          onValueChange={(value) => handleBatchFieldChange("filterType", value)}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="major" id="major" />
                            <Label htmlFor="major" className="cursor-pointer">Jurusan</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="faculty" id="faculty" />
                            <Label htmlFor="faculty" className="cursor-pointer">Fakultas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="year" id="year" />
                            <Label htmlFor="year" className="cursor-pointer">Angkatan</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Filter Options */}
                      {batchData.filterType === "major" && (
                        <div className="space-y-2">
                          <Label htmlFor="selectedFaculty" className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Fakultas
                          </Label>
                          <Select
                            value={batchData.selectedFaculty}
                            onValueChange={(value) => handleBatchFieldChange("selectedFaculty", value)}
                          >
                            <SelectTrigger id="selectedFaculty">
                              <SelectValue placeholder="Pilih fakultas" />
                            </SelectTrigger>
                            <SelectContent>
                              {faculties.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id}>
                                  {faculty.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {batchData.selectedFaculty && (
                            <div className="mt-2 space-y-2">
                              <Label htmlFor="selectedMajor" className="flex items-center gap-1.5">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Jurusan
                              </Label>
                              <Select
                                value={batchData.selectedMajor}
                                onValueChange={(value) => handleBatchFieldChange("selectedMajor", value)}
                              >
                                <SelectTrigger id="selectedMajor">
                                  <SelectValue placeholder="Pilih jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {majors.map((major) => (
                                    <SelectItem key={major.id} value={major.id}>
                                      {major.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}

                      {batchData.filterType === "faculty" && (
                        <div className="space-y-2">
                          <Label htmlFor="selectedFaculty" className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Fakultas
                          </Label>
                          <Select
                            value={batchData.selectedFaculty}
                            onValueChange={(value) => handleBatchFieldChange("selectedFaculty", value)}
                          >
                            <SelectTrigger id="selectedFaculty">
                              <SelectValue placeholder="Pilih fakultas" />
                            </SelectTrigger>
                            <SelectContent>
                              {faculties.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id}>
                                  {faculty.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {batchData.filterType === "year" && (
                        <div className="space-y-2">
                          <Label htmlFor="selectedYear" className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Angkatan
                          </Label>
                          <Select
                            value={batchData.selectedYear}
                            onValueChange={(value) => handleBatchFieldChange("selectedYear", value)}
                          >
                            <SelectTrigger id="selectedYear">
                              <SelectValue placeholder="Pilih angkatan" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Status Kelayakan */}
                      <div className="space-y-2">
                        <Label htmlFor="batchIsEligible" className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          Status Kelayakan
                        </Label>
                        <div className="relative">
                          <Select
                            value={batchData.isEligible.toString()}
                            onValueChange={(value) => handleBatchFieldChange("isEligible", value === "true")}
                          >
                            <SelectTrigger id="batchIsEligible">
                              <SelectValue placeholder="Pilih status kelayakan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Memenuhi Syarat</SelectItem>
                              <SelectItem value="false">Tidak Memenuhi Syarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Filtered Voters List */}
                      {filteredVoters.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-1.5">
                              <Users2 className="h-4 w-4 text-muted-foreground" />
                              Daftar Pemilih ({filteredVoters.length})
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="selectAll" 
                                checked={batchData.selectedVoters.length === filteredVoters.length}
                                onCheckedChange={selectAllVoters}
                              />
                              <Label htmlFor="selectAll" className="text-sm cursor-pointer">
                                Pilih Semua
                              </Label>
                            </div>
                          </div>
                          
                          <div className="border rounded-md max-h-[200px] overflow-y-auto">
                            <div className="divide-y">
                              {filteredVoters.map((voter) => (
                                <div 
                                  key={voter.id} 
                                  className="flex items-center p-2 hover:bg-muted/50"
                                >
                                  <Checkbox 
                                    id={`voter-${voter.id}`} 
                                    checked={batchData.selectedVoters.includes(voter.id)}
                                    onCheckedChange={() => toggleVoterSelection(voter.id)}
                                    className="mr-2"
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`voter-${voter.id}`} className="font-medium cursor-pointer">
                                      {voter.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{voter.email}</p>
                                  </div>
                                  <Badge variant="outline" className="font-mono text-[13px] bg-muted/30 border-muted-foreground/20 px-2 py-0.5">
                                    {voter.voterCode}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="px-6 py-4 gap-4 bg-muted/50 border-t">
                  <Button 
                    variant="outline" 
                    onClick={onClose} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={activeTab === "single" ? handleSubmit : handleBatchSubmit} 
                    disabled={isSubmitting || (activeTab === "bulk" && batchData.selectedVoters.length === 0)}
                    className="w-full sm:w-auto cursor-pointer transition-all duration-200 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {voterElection ? "Simpan" : activeTab === "single" ? "Tambah" : `Tambah ${batchData.selectedVoters.length} Pemilih`}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Loading Modal */}
      <LoadingModal 
        isOpen={isSubmitting} 
        message={voterElection 
          ? "Memperbarui hak pilih..." 
          : activeTab === "single"
            ? "Menambahkan hak pilih baru..." 
            : `Menambahkan hak pilih untuk ${batchData.selectedVoters.length} pemilih...`} 
      />
    </>
  );
} 