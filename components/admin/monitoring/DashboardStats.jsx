import { 
  Award, 
  Vote, 
  Gauge, 
  Calendar, 
  CheckCircle, 
  UserCheck, 
  BarChart, 
  CircleCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStats({ stats }) {
  const {
    totalElections,
    activeElections,
    completedElections,
    totalVotes,
    totalCandidates,
    totalVoters,
    participationRate
  } = stats;

  const statItems = [
    {
      title: "Total Pemilu",
      value: totalElections,
      icon: Calendar,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Pemilu Aktif",
      value: activeElections,
      icon: Gauge,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Pemilu Selesai",
      value: completedElections,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Total Suara",
      value: totalVotes,
      icon: Vote,
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Total Kandidat",
      value: totalCandidates,
      icon: Award,
      color: "bg-pink-100 text-pink-800",
    },
    {
      title: "Total Pemilih",
      value: totalVoters,
      icon: UserCheck,
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Tingkat Partisipasi",
      value: `${participationRate}%`,
      icon: BarChart,
      color: "bg-teal-100 text-teal-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="border-none shadow-md">
          <CardContent className="p-4 flex flex-col gap-3">
            <div className={`p-2 rounded-full w-fit ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 