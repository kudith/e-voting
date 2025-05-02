"use client";

import { useEffect, useState } from "react";
import { CheckCheck, ExternalLink, HourglassIcon, History, Vote } from "lucide-react";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestVotesActivity({ isLoading = true, activities = [] }) {
  // If no activities provided, we'll use placeholder data
  const hasActivities = activities && activities.length > 0;
  
  // Format relative time
  function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} hari yang lalu`;
    } else if (diffHour > 0) {
      return `${diffHour} jam yang lalu`;
    } else if (diffMin > 0) {
      return `${diffMin} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  }
  
  // Get activity icon
  function getActivityIcon(status) {
    if (status === 'COMPLETED') {
      return <CheckCheck className="h-4 w-4" />;
    } else if (status === 'ACTIVE') {
      return <HourglassIcon className="h-4 w-4" />;
    } else {
      return <Vote className="h-4 w-4" />;
    }
  }
  
  // Get activity badge color
  function getActivityBadgeClass(status) {
    if (status === 'COMPLETED') {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (status === 'ACTIVE') {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    } else {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Aktivitas Terbaru
            </div>
          </CardTitle>
          <CardDescription>
            Aktivitas pemilihan terbaru dalam sistem
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <a href="/admin/logs">
            <span className="sr-md:inline">Lihat Log</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : hasActivities ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.title)}&background=random`} />
                    <AvatarFallback>
                      {activity.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate max-w-[180px] md:max-w-[220px]" title={activity.title}>
                      {activity.title}
                    </h4>
                    <Badge className={getActivityBadgeClass(activity.status)}>
                      <span className="flex items-center gap-1">
                        {getActivityIcon(activity.status)}
                        {activity.status === 'COMPLETED' ? 'Selesai' : 'Aktif'}
                      </span>
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      {formatRelativeTime(activity.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Vote className="h-3 w-3" />
                      {activity.votes} suara
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <History className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-medium">Belum ada aktivitas</h3>
            <p className="text-muted-foreground max-w-sm mt-1 text-sm">
              Aktivitas pemilihan akan muncul di sini saat pemilu berlangsung.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 