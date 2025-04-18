"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme-provider"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  // Toggle theme
  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    (<header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex items-center">
          <div
            className={cn(
              "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
              isDarkMode ? "from-blue-400 to-emerald-400" : "from-blue-600 to-emerald-600",
            )}
          >
            SiPilih
          </div>
          <Badge
            variant="outline"
            className={cn(
              "ml-3 px-2 py-0 text-xs border",
              isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-600",
            )}
          >
            BETA
          </Badge>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-sm font-medium",
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
            )}
          >
            Help
          </Button>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "rounded-full transition-all duration-300",
                isDarkMode
                  ? "bg-gray-800/80 text-gray-100 border-gray-700 hover:bg-gray-700/80"
                  : "bg-white/80 text-gray-900 border-gray-200 hover:bg-gray-100/80",
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDarkMode ? "dark" : "light"}
                  initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>)
  );
}
