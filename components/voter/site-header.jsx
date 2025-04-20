"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

export function SiteHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <div className="flex items-center">
            <motion.div
              className="text-3xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-blue-400 dark:to-blue-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              SiPilih
            </motion.div>
            <Badge
              variant="outline"
              className="ml-3 px-2 py-0 text-xs border border-gray-300 text-gray-600"
            >
              BETA
            </Badge>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            >
              Help
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
    )
  }

  return (
    <motion.header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex items-center">
          <motion.div
            className="text-3xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-blue-400 dark:to-blue-300"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            SiPilih
          </motion.div>
            <Badge
              variant="outline"
              className="ml-3 px-2 py-0 text-xs"
            >
              BETA
            </Badge>
        </div>

        <div className="flex-1" />

        <motion.div
          className="flex items-center gap-4"
        >
          <Link
            href="/voter/help"
            className="flex items-center text-sm font-medium transition-all duration-300 pr-4"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Bantuan
          </Link>

          <ModeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
}
