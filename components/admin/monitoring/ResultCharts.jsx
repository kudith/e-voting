import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell,
  Pie,
  PieChart,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, TrendingUp, Users, UserCheck, Vote, RefreshCw, ChevronRight, GraduationCap, School } from "lucide-react";

// Modern color palette for light mode
const LIGHT_MODE_COLORS = [
  "#4f46e5", // Indigo
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f97316", // Orange
  "#10b981", // Emerald
  "#64748b", // Slate
  "#f59e0b", // Amber
  "#0ea5e9", // Light Blue
  "#6366f1"  // Indigo
];

// Modern color palette for dark mode
const DARK_MODE_COLORS = [
  "#818cf8", // Indigo
  "#22d3ee", // Cyan
  "#a78bfa", // Violet
  "#f472b6", // Pink
  "#fb923c", // Orange
  "#34d399", // Emerald
  "#94a3b8", // Slate
  "#fbbf24", // Amber
  "#38bdf8", // Light Blue
  "#a5b4fc"  // Indigo
];

// Generate a gradient color
const getGradientColor = (color, opacity = 0.2) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function ResultCharts({ election }) {
  const [activeTab, setActiveTab] = useState("candidates");
  const [chartHeight, setChartHeight] = useState(350);
  const [selectedDemographicType, setSelectedDemographicType] = useState("faculty");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const chartContainerRef = useRef(null);

  // Adjust chart heights based on container width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth;
        if (width < 600) {
          setChartHeight(300);
        } else {
          setChartHeight(400);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get colors based on current theme
  const getChartColors = () => {
    return isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
  };

  if (!election) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/30" />
          <p className="text-muted-foreground text-sm">Tidak ada data pemilu untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  const { candidates = [], timeline = [], participation = {} } = election;

  // Format candidates data for charts
  const candidateData = candidates.map((candidate, index) => ({
    name: candidate.name,
    votes: candidate.voteCount,
    percentage: parseFloat(candidate.percentage || 0),
    color: getChartColors()[index % getChartColors().length]
  }));

  // Sort candidate data by votes in descending order
  candidateData.sort((a, b) => b.votes - a.votes);

  // Format timeline data if it exists
  const timelineData = Array.isArray(timeline) 
    ? timeline.map(day => ({
        date: day.date,
        votes: day.count
      }))
    : [];

  // Fill missing days in timeline to show a continuous line
  if (timelineData.length > 1) {
    const sortedData = [...timelineData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const filledData = [];
    const startDate = new Date(sortedData[0].date);
    const endDate = new Date(sortedData[sortedData.length - 1].date);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const existingData = sortedData.find(item => item.date === dateStr);
      
      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({ date: dateStr, votes: 0 });
      }
    }
    
    timelineData.length = 0;
    timelineData.push(...filledData);
  }

  // Format participation data
  const participationData = [
    { name: "Sudah Memilih", value: participation?.voted || 0, color: "#10b981" },
    { name: "Belum Memilih", value: participation?.notVoted || 0, color: "#ef4444" }
  ];

  // Format faculty participation data if it exists
  const facultyData = election.participationByFaculty 
    ? Object.entries(election.participationByFaculty).map(([name, value], index) => ({
        name,
        value,
        fullMark: 100,
        color: getChartColors()[index % getChartColors().length]
      }))
    : [];

  // Format major participation data if it exists
  const majorData = election.participationByMajor 
    ? Object.entries(election.participationByMajor).map(([name, value], index) => ({
        name,
        value,
        fullMark: 100,
        color: getChartColors()[index % getChartColors().length]
      }))
    : [];

  // Add animated gradient defs for modern look
  const renderGradients = () => {
    return candidateData.map((entry, index) => (
      <defs key={`gradient-${index}`}>
        <linearGradient id={`colorVotes${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={entry.color} stopOpacity={0.1}/>
        </linearGradient>
        <linearGradient id={`colorPercentage${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={entry.color} stopOpacity={0.1}/>
        </linearGradient>
      </defs>
    ));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border p-3 rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color || entry.payload.color }}
                />
                <p className="text-xs text-foreground/80">
                  {entry.name}: <span className="font-semibold">{entry.value}</span>
                  {entry.name === "percentage" && "%"}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend renderer for better styling
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-foreground/80">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" ref={chartContainerRef}>
      <Tabs defaultValue="candidates" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 bg-muted/30 p-1 rounded-lg">
          <TabsTrigger 
            value="candidates" 
            className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
          >
            <Award className="h-4 w-4" />
            Kandidat
          </TabsTrigger>
          <TabsTrigger 
            value="participation" 
            className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
          >
            <Users className="h-4 w-4" />
            Partisipasi
          </TabsTrigger>
          {timelineData.length > 0 && (
            <TabsTrigger 
              value="timeline" 
              className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <TrendingUp className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          )}
          {(facultyData.length > 0 || majorData.length > 0) && (
            <TabsTrigger 
              value="demographics" 
              className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <GraduationCap className="h-4 w-4" />
              Demografi
            </TabsTrigger>
          )}
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="mt-0 space-y-6">
          {/* Winner highlight card */}
          {election.winner && (
            <Card className="overflow-hidden border-none bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-200 dark:bg-amber-900/50">
                    <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Pemenang Sementara</h3>
                    <p className="text-sm text-amber-800 dark:text-amber-300">{election.winner.name}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                        {election.winner.percentage}%
                      </Badge>
                      <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{election.winner.voteCount} suara</span>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">dari total {election.totalVotes} suara</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modern Bar Chart */}
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Vote className="h-5 w-5 text-primary" />
                  Perolehan Suara Kandidat
                </CardTitle>
                <CardDescription>
                  Total {election.totalVotes} suara telah dihitung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={candidateData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barSize={40}
                      barGap={8}
                    >
                      {renderGradients()}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: isDarkMode ? "#334155" : "#e2e8f0" }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.6)" }} />
                      <Bar 
                        dataKey="votes" 
                        name="Jumlah Suara"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      >
                        {candidateData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#colorVotes${index})`}
                            stroke={entry.color}
                            strokeWidth={1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Modern Pie Chart */}
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-primary" />
                  Persentase Perolehan Suara
                </CardTitle>
                <CardDescription>
                  Distribusi persentase suara antara kandidat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={candidateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="percentage"
                        nameKey="name"
                        label={({ name, percentage }) => `${percentage}%`}
                        labelLine={false}
                        animationDuration={1500}
                        animationBegin={200}
                      >
                        {candidateData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke={isDarkMode ? "#1e293b" : "#f8fafc"}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Participation Tab */}
        <TabsContent value="participation" className="mt-0 space-y-6">
          {/* Participation Overview Card */}
          <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-none shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Tingkat Partisipasi Pemilih</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {participation?.totalVoters || 0} pemilih terdaftar pada pemilihan ini
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm py-1.5 px-3">
                    {participation?.percentage || "0"}% Partisipasi
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modern Donut Chart */}
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Distribusi Partisipasi
                </CardTitle>
                <CardDescription>
                  {participation?.voted || 0} dari {participation?.totalVoters || 0} pemilih sudah memberikan suara
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={participationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        nameKey="name"
                        animationDuration={1500}
                      >
                        {participationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke={isDarkMode ? "#1e293b" : "#f8fafc"}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        iconType="circle" 
                        layout="horizontal" 
                        verticalAlign="bottom"
                        align="center"
                        fontSize={12}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Statistics under the chart */}
                <div className="flex flex-col gap-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100 dark:bg-green-950/30 dark:border-green-900/50">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sudah Memilih</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{participation?.voted || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50">
                      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
                        <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Belum Memilih</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">{participation?.notVoted || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modern Radial Bar Chart */}
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Vote className="h-5 w-5 text-primary" />
                  Progress Partisipasi
                </CardTitle>
                <CardDescription>
                  Persentase partisipasi pemilih dalam pemilihan ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="20%" 
                      outerRadius="90%" 
                      barSize={20} 
                      data={[
                        {
                          name: "Partisipasi",
                          value: parseFloat(participation?.percentage || 0),
                          fill: "#10b981"
                        }
                      ]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                        fill="#10b981"
                        animationDuration={1500}
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-bold text-2xl fill-current"
                      >
                        {participation?.percentage || "0"}%
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        {timelineData.length > 0 && (
          <TabsContent value="timeline" className="mt-0">
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Timeline Aktivitas Pemilihan
                </CardTitle>
                <CardDescription>
                  Grafik jumlah suara yang masuk per hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timelineData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <defs>
                        <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: isDarkMode ? "#334155" : "#e2e8f0" }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="votes" 
                        name="Jumlah Suara" 
                        stroke="#4f46e5"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVotes)"
                        activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Demographics Tab - Updated with Pie Charts for Faculty/Major data */}
        {(facultyData.length > 0 || majorData.length > 0) && (
          <TabsContent value="demographics" className="mt-0 space-y-6">
            {/* Demographics Overview Card */}
            <Card className="overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 border-none shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Distribusi Demografis Pemilih</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Analisis berdasarkan fakultas dan jurusan pemilih
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={selectedDemographicType === "faculty" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedDemographicType("faculty")}
                    >
                      <School className="h-3.5 w-3.5 mr-1" />
                      Fakultas
                    </Badge>
                    <Badge 
                      variant={selectedDemographicType === "major" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedDemographicType("major")}
                    >
                      <GraduationCap className="h-3.5 w-3.5 mr-1" />
                      Jurusan
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart for Faculty/Major Distribution */}
              <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedDemographicType === "faculty" ? (
                      <>
                        <School className="h-5 w-5 text-primary" />
                        Partisipasi Berdasarkan Fakultas
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Partisipasi Berdasarkan Jurusan
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Distribusi pemilih berdasarkan {selectedDemographicType === "faculty" ? "fakultas" : "jurusan"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedDemographicType === "faculty" ? facultyData : majorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          labelLine={true}
                          label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          animationDuration={1500}
                        >
                          {(selectedDemographicType === "faculty" ? facultyData : majorData).map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke={isDarkMode ? "#1e293b" : "#f8fafc"}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{ paddingLeft: "20px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Participating Entities Bar Chart */}
              <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {selectedDemographicType === "faculty" ? "Fakultas" : "Jurusan"} dengan Partisipasi Tertinggi
                  </CardTitle>
                  <CardDescription>
                    Perbandingan tingkat partisipasi antara {selectedDemographicType === "faculty" ? "fakultas" : "jurusan"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...(selectedDemographicType === "faculty" ? facultyData : majorData)]
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 5)}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        barSize={30}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                        <XAxis 
                          type="number"
                          tickLine={false}
                          axisLine={{ stroke: isDarkMode ? "#334155" : "#e2e8f0" }}
                          tick={{ fontSize: 12 }}
                          stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                        />
                        <YAxis 
                          type="category"
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          width={120}
                          tick={{ fontSize: 12 }}
                          stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          name={`Jumlah Pemilih yang Berpartisipasi`}
                          radius={[0, 4, 4, 0]}
                          animationDuration={1500}
                        >
                          {(selectedDemographicType === "faculty" ? facultyData : majorData)
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 5)
                            .map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                stroke={entry.color}
                                strokeWidth={1}
                              />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-primary" />
                  Ringkasan Statistik
                </CardTitle>
                <CardDescription>
                  Detail angka partisipasi pemilih berdasarkan demografi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(selectedDemographicType === "faculty" ? facultyData : majorData)
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6)
                    .map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <h4 className="font-semibold text-sm truncate" title={entry.name}>
                            {entry.name}
                          </h4>
                        </div>
                        <div className="mt-2">
                          <p className="text-2xl font-bold">{entry.value}</p>
                          <p className="text-xs text-muted-foreground">pemilih telah berpartisipasi</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 