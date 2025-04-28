"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Plus, 
  Search,
  Users
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingElectionsWidget() {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredElections, setFilteredElections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingElections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/election/results/getAllResults');
        
        if (!response.ok) {
          throw new Error('Failed to fetch election results');
        }
        
        const result = await response.json();
        
        if (result.success) {
          const { data } = result;
          
          // Get upcoming and active elections
          const elections = data
            .filter(election => election.status === "UPCOMING" || election.status === "ACTIVE")
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map(election => ({
              id: election.id,
              title: election.title,
              startDate: new Date(election.startDate),
              endDate: new Date(election.endDate),
              status: election.status,
              totalVoters: election.participation?.totalVoters || 0,
              description: election.description || ""
            }));
            
          setUpcomingElections(elections);
          setFilteredElections(elections);
        }
      } catch (error) {
        console.error('Error fetching upcoming elections:', error);
        setError(error.message);
        
        // Fallback to placeholder data
        const placeholderData = [
          {
            id: "placeholder-1",
            title: "Pemilihan Ketua BEM 2025",
            description: "Pemilihan ketua dan wakil ketua BEM periode 2025-2026",
            startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            status: "UPCOMING",
            totalVoters: 1500
          },
          {
            id: "placeholder-2",
            title: "Pemilihan Ketua Himpunan Teknik",
            description: "Pemilihan ketua himpunan fakultas teknik",
            startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: "ACTIVE",
            totalVoters: 600
          },
          {
            id: "placeholder-3",
            title: "Pemilihan Ketua Divisi Kesenian",
            description: "Pemilihan ketua divisi kesenian mahasiswa",
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
            status: "UPCOMING",
            totalVoters: 210
          },
          {
            id: "placeholder-4",
            title: "Pemilihan Perwakilan Fakultas",
            description: "Pemilihan perwakilan fakultas untuk rapat senat",
            startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
            status: "UPCOMING",
            totalVoters: 550
          }
        ];
        
        setUpcomingElections(placeholderData);
        setFilteredElections(placeholderData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingElections();
  }, []);

  // Filter elections based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredElections(upcomingElections);
    } else {
      const filtered = upcomingElections.filter(
        election => 
          election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredElections(filtered);
    }
  }, [searchQuery, upcomingElections]);

  // Format date for display
  function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // Calculate time remaining or elapsed
  function getTimeStatus(startDate, endDate) {
    const now = new Date();
    
    if (now < startDate) {
      const days = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      return `Dimulai dalam ${days} hari`;
    } else if (now >= startDate && now <= endDate) {
      const days = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return `Berlangsung (${days} hari lagi)`;
    } else {
      return "Telah berakhir";
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Pemilu Mendatang</CardTitle>
            <CardDescription>
              Jadwal pemilihan yang akan datang dan sedang berlangsung
            </CardDescription>
          </div>
          <Button className="gap-2" asChild>
            <a href="/admin/dashboard/elections/create">
              <Plus className="h-4 w-4" />
              Buat Pemilu Baru
            </a>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari pemilu..."
              className="w-full rounded-lg border bg-background pl-8 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              <span>Aktif: {upcomingElections.filter(e => e.status === "ACTIVE").length}</span>
            </Badge>
            <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <Calendar className="h-3 w-3" />
              <span>Mendatang: {upcomingElections.filter(e => e.status === "UPCOMING").length}</span>
            </Badge>
          </div>
        </div>
        
        {isLoading ? (
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Nama Pemilu</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Pemilih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-[80px] ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : filteredElections.length > 0 ? (
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Nama Pemilu</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Pemilih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElections.map((election) => (
                  <TableRow key={election.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium overflow-hidden">
                      <div className="truncate max-w-[300px]" title={election.title}>
                        {election.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[300px]" title={election.description}>
                        {election.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(election.startDate)}</div>
                      <div className="text-xs text-muted-foreground">s/d {formatDate(election.endDate)}</div>
                    </TableCell>
                    <TableCell>
                      {election.status === "ACTIVE" ? (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {getTimeStatus(election.startDate, election.endDate)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          {getTimeStatus(election.startDate, election.endDate)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{election.totalVoters}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-medium text-lg">Tidak ada pemilu mendatang</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Belum ada pemilu yang dijadwalkan atau sesuai dengan pencarian Anda
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            Menampilkan {filteredElections.length} dari {upcomingElections.length} pemilu
          </span>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <a href="/admin/dashboard/elections">
              <span>Kelola Semua Pemilu</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 