"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ElectionDetailHeader from "@/components/admin/monitoring/ElectionDetailHeader";
import ResultCharts from "@/components/admin/monitoring/ResultCharts";
import { useParams } from "next/navigation";

export default function ElectionDetailPage() {
  // Use the useParams hook to get the electionId
  const params = useParams();
  const electionId = params.electionId;
  
  const [election, setElection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch election detail data
  useEffect(() => {
    const fetchElectionDetail = async () => {
      if (!electionId) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching election details for ID: ${electionId}`);
        const response = await fetch(`/api/election/results/${electionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch election details');
        }
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch election details');
        }
        
        console.log("Election details:", result.data);
        
        // Process the data to ensure consistent status formatting
        const processedData = {
          ...result.data,
          // Ensure the status is correctly formatted for the UI
          status: result.data.status === "ongoing" ? "ACTIVE" :
                  result.data.status === "completed" ? "COMPLETED" :
                  result.data.status === "upcoming" ? "UPCOMING" :
                  result.data.status
        };
        
        setElection(processedData);
      } catch (error) {
        console.error('Error fetching election details:', error);
        toast.error('Gagal memuat detail pemilu', {
          description: error.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionDetail();
  }, [electionId]);

  // Handle refresh
  const handleRefresh = async () => {
    if (!electionId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/election/results/${electionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch election details');
      }
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch election details');
      }
      
      // Process the data to ensure consistent status formatting
      const processedData = {
        ...result.data,
        // Ensure the status is correctly formatted for the UI
        status: result.data.status === "ongoing" ? "ACTIVE" :
                result.data.status === "completed" ? "COMPLETED" :
                result.data.status === "upcoming" ? "UPCOMING" :
                result.data.status
      };
      
      setElection(processedData);
      toast.success('Data berhasil diperbarui');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Gagal memperbarui data', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-primary/50" />
          <p className="text-muted-foreground">Memuat data pemilu...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <Link href="/admin/dashboard/monitoring">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Pemilu tidak ditemukan atau telah dihapus.</p>
          <Link href="/admin/dashboard/monitoring" className="mt-4">
            <Button variant="outline">Kembali ke Monitoring</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {/* Back Button and Refresh Button */}
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard/monitoring">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </Link>
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

            {/* Election Detail Header */}
            <ElectionDetailHeader election={election} />

            {/* Results Charts */}
            <Card className="shadow-md border-muted-foreground/10">
              <CardContent className="p-4 sm:p-6">
                <ResultCharts election={election} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 