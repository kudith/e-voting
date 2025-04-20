"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Data Pemilih",
      url: "/admin/dashboard/voters",
      icon: IconUsers,
    },
    {
      title: "Data Kandidat",
      url: "/admin/dashboard/candidates",
      icon: IconListDetails,
    },
    {
      title: "Pemilu", // Menu baru
      url: "/admin/dashboard/elections",
      icon: IconDatabase,
    },
    {
      title: "Hak Pilih", // Menu baru
      url: "/admin/dashboard/voting-rights",
      icon: IconFolder,
    },
    {
      title: "Pengaturan Voting",
      url: "/admin/dashboard/voting-settings",
      icon: IconSettings,
    },
    {
      title: "Monitoring Hasil",
      url: "/admin/monitoring",
      icon: IconChartBar,
    },
    {
      title: "Verifikasi Suara",
      url: "/admin/verifikasi-suara",
      icon: IconFileAi,
    },
    {
      title: "Log Aktivitas",
      url: "/admin/logs",
      icon: IconReport,
    },
    {
      title: "Dokumen Voting",
      url: "/admin/documents",
      icon: IconFileDescription,
    },
  ],  
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SiPilih</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
