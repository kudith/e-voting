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

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/voter/nav-main"
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
  useSidebar
} from "@/components/ui/sidebar"
import { VoteIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/voter/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Kandidat",
      url: "/voter/candidates",
      icon: IconUsers,
    },
    {
      title: "Vote",
      url: "/voter/vote",
      icon: VoteIcon,
    },
    {
      title: "Verifikasi Suara",
      url: "/voter/verify",
      icon: VoteIcon,
    },
    {
      title: "Hasil",
      url: "/voter/result",
      icon: IconChartBar,
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
  const { state } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const isCollapsed = mounted && state === "collapsed"

  // Only enable animations after component has mounted on the client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
        {mounted ? (
          <>
            {!isCollapsed && (
              <NavMain items={data.navMain} />
            )}
          </>
        ) : (
          // Static rendering for server-side
          <NavMain items={data.navMain} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
