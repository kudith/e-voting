"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Calendar, BarChart as BarChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ElectionVotingChart({ data = [] }) {
  const [chartType, setChartType] = useState("area");
  
  // If there's no data, show a placeholder
  if (!data || data.length === 0) {
    const placeholderData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      votes: Math.floor(Math.random() * 50)
    }));
    
    data = placeholderData;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Menampilkan {data.length} hari terakhir</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={chartType === "area" ? "default" : "outline"}
            className="h-8"
            onClick={() => setChartType("area")}
          >
            Area
          </Button>
          <Button
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            className="h-8"
            onClick={() => setChartType("bar")}
          >
            <BarChartIcon className="mr-2 h-4 w-4" />
            Bar
          </Button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                width={40}
                tickFormatter={(value) => value}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="border shadow-md">
                        <CardContent className="p-2">
                          <div className="text-xs font-medium">
                            {new Date(label).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-sm font-bold">{payload[0].value} suara</div>
                        </CardContent>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="votes"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#colorVotes)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                width={40}
                tickFormatter={(value) => value}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="border shadow-md">
                        <CardContent className="p-2">
                          <div className="text-xs font-medium">
                            {new Date(label).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-sm font-bold">{payload[0].value} suara</div>
                        </CardContent>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="votes"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
} 