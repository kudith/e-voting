import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users2,
  CheckCircle2,
  XCircle,
  Users,
  Vote,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function VotingRightsStats({ 
  voterElections, 
  totalVoterElections,
  filteredVoterElections,
  eligibleVoters,
  ineligibleVoters,
  votedVoters,
  notVotedVoters,
  eligiblePercentage,
  ineligiblePercentage,
  votedPercentage,
  notVotedPercentage 
}) {
  // Group elections by title and calculate stats
  const electionStats = voterElections.reduce((acc, ve) => {
    const electionTitle = ve.election?.title || 'Unknown';
    if (!acc[electionTitle]) {
      acc[electionTitle] = {
        title: electionTitle,
        total: 0,
        eligible: 0,
        voted: 0,
        startDate: ve.election?.startDate,
        endDate: ve.election?.endDate,
        status: ve.election?.status
      };
    }
    acc[electionTitle].total++;
    if (ve.isEligible) acc[electionTitle].eligible++;
    if (ve.hasVoted) acc[electionTitle].voted++;
    return acc;
  }, {});

  const electionStatsArray = Object.values(electionStats);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-primary/5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                  <Users2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Hak Pilih</p>
                  <h3 className="text-xl sm:text-2xl font-bold">{totalVoterElections}</h3>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {filteredVoterElections !== totalVoterElections 
                      ? `${filteredVoterElections} ditampilkan setelah filter` 
                      : 'Semua data ditampilkan'}
                  </p>
                </div>
              </div>
              <Progress 
                value={100} 
                className="h-1 mt-4 bg-primary/10" 
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-green-500/5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-green-500/10 p-2 sm:p-3 rounded-full group-hover:bg-green-500/20 transition-colors duration-300">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Eligible</p>
                  <h3 className="text-xl sm:text-2xl font-bold">{eligibleVoters}</h3>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {eligiblePercentage}% dari total
                  </p>
                </div>
              </div>
              <Progress 
                value={eligiblePercentage} 
                className="h-1 mt-4 bg-green-100 dark:bg-green-900/30 [&>div]:bg-green-500"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-red-500/5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-red-500/10 p-2 sm:p-3 rounded-full group-hover:bg-red-500/20 transition-colors duration-300">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tidak Eligible</p>
                  <h3 className="text-xl sm:text-2xl font-bold">{ineligibleVoters}</h3>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {ineligiblePercentage}% dari total
                  </p>
                </div>
              </div>
              <Progress 
                value={ineligiblePercentage} 
                className="h-1 mt-4 bg-red-100 dark:bg-red-900/30 [&>div]:bg-red-500"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-blue-500/5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-blue-500/10 p-2 sm:p-3 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Sudah Memilih</p>
                  <h3 className="text-xl sm:text-2xl font-bold">{votedVoters}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {votedPercentage}% dari total
                  </p>
                </div>
              </div>
              <Progress 
                value={votedPercentage} 
                className="h-1 mt-4 bg-blue-100 dark:bg-blue-900/30 [&>div]:bg-blue-500"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Statistik Detail
            </CardTitle>
            <CardDescription>
              Informasi detail tentang statistik hak pilih per pemilu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="elections" className="flex items-center gap-2">
                  <Vote className="h-4 w-4" />
                  Per Pemilu
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Pemilih */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Vote className="h-4 w-4 text-primary" />
                        Status Pemilih
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Memenuhi Syarat</span>
                          <span className="text-sm font-medium">{eligibleVoters} ({eligiblePercentage}%)</span>
                        </div>
                        <Progress 
                          value={eligiblePercentage} 
                          className="h-2 [&>div]:bg-green-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Tidak Memenuhi Syarat</span>
                          <span className="text-sm font-medium">{ineligibleVoters} ({ineligiblePercentage}%)</span>
                        </div>
                        <Progress 
                          value={ineligiblePercentage} 
                          className="h-2 [&>div]:bg-red-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Memilih */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Status Memilih
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Sudah Memilih</span>
                          <span className="text-sm font-medium">{votedVoters} ({votedPercentage}%)</span>
                        </div>
                        <Progress 
                          value={votedPercentage} 
                          className="h-2 [&>div]:bg-blue-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Belum Memilih</span>
                          <span className="text-sm font-medium">{notVotedVoters} ({notVotedPercentage}%)</span>
                        </div>
                        <Progress 
                          value={notVotedPercentage} 
                          className="h-2 [&>div]:bg-yellow-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="elections" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {electionStatsArray.map((stat, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Vote className="h-4 w-4 text-primary" />
                              {stat.title}
                            </span>
                            <span className="text-sm font-normal text-muted-foreground">
                              {stat.status === "active" ? "Aktif" : 
                               stat.status === "upcoming" ? "Akan Datang" : 
                               stat.status === "ended" ? "Selesai" : stat.status}
                            </span>
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(stat.startDate)} - {formatDate(stat.endDate)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Memenuhi Syarat</span>
                              <span className="text-sm font-medium">
                                {stat.eligible} ({Math.round((stat.eligible / stat.total) * 100)}%)
                              </span>
                            </div>
                            <Progress 
                              value={(stat.eligible / stat.total) * 100} 
                              className="h-2 [&>div]:bg-green-500"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Sudah Memilih</span>
                              <span className="text-sm font-medium">
                                {stat.voted} ({Math.round((stat.voted / stat.total) * 100)}%)
                              </span>
                            </div>
                            <Progress 
                              value={(stat.voted / stat.total) * 100} 
                              className="h-2 [&>div]:bg-blue-500"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 