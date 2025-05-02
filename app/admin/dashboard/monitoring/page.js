"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, FileSearch, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ElectionsGrid from "@/components/admin/monitoring/ElectionsGrid";
import DashboardStats from "@/components/admin/monitoring/DashboardStats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MonitoringPage() {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredElections, setFilteredElections] = useState([]);
  const [error, setError] = useState(null);

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalElections: 0,
    activeElections: 0,
    completedElections: 0,
    totalVotes: 0,
    totalCandidates: 0,
    totalVoters: 0,
    participationRate: 0,
  });

  // Fetch election results from the API
  useEffect(() => {
    const fetchElectionResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/election/results/getAllResults');
        if (!response.ok) {
          throw new Error('Failed to fetch election results');
        }
        const result = await response.json();
        console.log("API Response:", result);
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error fetching data');
        }
        
        const { data } = result;
        
        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setElections([]);
          return;
        }
        
        console.log(`Retrieved ${data.length} elections`);
        
        // Make sure we map the database status to UI status if needed
        const processedData = data.map(election => {
          // Ensure the status is correctly formatted for the UI
          // The API might return lowercase 'ongoing', 'completed', 'upcoming'
          // but our UI expects uppercase 'ACTIVE', 'COMPLETED', 'UPCOMING'
          let status = election.status;
          if (status === "ongoing") status = "ACTIVE";
          if (status === "completed") status = "COMPLETED";
          if (status === "upcoming") status = "UPCOMING";
          
          return {
            ...election,
            status
          };
        });
        
        setElections(processedData);
        
        // Calculate dashboard stats
        const totalElections = data.length;
        const activeElections = data.filter(election => 
          election.status === "ACTIVE" || election.status === "ongoing").length;
        const completedElections = data.filter(election => 
          election.status === "COMPLETED" || election.status === "completed").length;
        
        // Calculate overall statistics
        const totalVotes = data.reduce((sum, election) => sum + (election.totalVotes || 0), 0);
        const totalCandidates = data.reduce((sum, election) => sum + (election.candidates?.length || 0), 0);
        
        // Calculate total voters and participation
        let totalVoters = 0;
        let votedVoters = 0;
        
        data.forEach(election => {
          if (election.participation) {
            totalVoters += election.participation.totalVoters || 0;
            votedVoters += election.participation.voted || 0;
          }
        });
        
        const participationRate = totalVoters > 0 
          ? Math.round((votedVoters / totalVoters) * 100) 
          : 0;
        
        setDashboardStats({
          totalElections,
          activeElections,
          completedElections,
          totalVotes,
          totalCandidates,
          totalVoters,
          participationRate,
        });
      } catch (error) {
        console.error('Error fetching election results:', error);
        setError(error.message);
        toast.error('Gagal memuat data pemilu', {
          description: error.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.',
        });
        setElections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionResults();
  }, []);

  // Filter elections based on search query and status filter
  useEffect(() => {
    if (!Array.isArray(elections)) {
      console.error("Elections is not an array:", elections);
      setFilteredElections([]);
      return;
    }
    
    const filteredResults = elections.filter(election => {
      const matchesSearch = searchQuery.trim() === '' ||
        election.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (election.description && election.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || election.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredElections(filteredResults);
  }, [elections, searchQuery, statusFilter]);

  // Handle refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/election/results/getAllResults');
        if (!response.ok) {
        throw new Error('Failed to fetch election results');
      }
        const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Unknown error fetching data');
      }
      
      const { data } = result;
      setElections(Array.isArray(data) ? data : []);
      toast.success('Data berhasil diperbarui');
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error.message);
      toast.error('Gagal memperbarui data', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestData = async () => {
    try {
      // Just a temporary function to help create some test data
      toast.info('Membuat data tes...');
      // Implementation would go here in a real scenario
    } catch (error) {
      console.error('Error creating test data:', error);
      toast.error('Gagal membuat data tes');
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 px-4 sm:px-6 md:px-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Monitoring Hasil Pemilihan</h1>
                <p className="text-muted-foreground mt-1">Lihat dan monitor hasil pemilihan secara real-time</p>
                </div>
              <div className="flex gap-2">
                  <Button
                  onClick={handleRefresh} 
                  variant="outline" 
                  className="gap-2"
                  disabled={isLoading}
                  >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh Data
                  </Button>
                </div>
                    </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Dashboard Stats */}
            <DashboardStats stats={dashboardStats} />

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FileSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pemilihan..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 sm:w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                    <SelectItem value="UPCOMING">Akan Datang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

            {/* Filters indicator */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter aktif:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="outline" className="bg-primary/5">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="outline" className="bg-primary/5">
                      Status: {statusFilter === 'ACTIVE' ? 'Aktif' : 
                               statusFilter === 'COMPLETED' ? 'Selesai' : 
                               statusFilter === 'UPCOMING' ? 'Akan Datang' : statusFilter}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="link" 
                  className="text-xs p-0 h-auto"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Reset
                </Button>
              </div>
            )}

            {/* List of Elections */}
            <Card className="shadow-md border-muted-foreground/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Hasil Pemilihan
                </CardTitle>
                <CardDescription>
                  {filteredElections.length} pemilihan ditemukan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ElectionsGrid 
                  elections={filteredElections} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
