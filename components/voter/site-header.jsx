"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  HelpCircle, 
  LayoutDashboard, 
  Users, 
  Vote as VoteIcon, 
  CheckCircle, 
  BarChart 
} from "lucide-react"

export function SiteHeader() {
  const [mounted, setMounted] = useState(false)
  const { state } = useSidebar()
  const isCollapsed = mounted && state === "collapsed"
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()
  // Navigation items to show in header when sidebar is collapsed
  const navItems = [
    { title: "Dashboard", url: "/voter/dashboard", icon: LayoutDashboard },
    { title: "Kandidat", url: "/voter/candidates", icon: Users },
    { title: "Vote", url: "/voter/vote", icon: VoteIcon },
    { title: "Verifikasi", url: "/voter/verify", icon: CheckCircle },
    { title: "Hasil", url: "/voter/result", icon: BarChart },
  ]

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      if (currentScrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Shared header content - Logo and Brand
  const LogoAndBrand = (
    <div className="flex items-center">
      {mounted ? (
        <motion.div
          className="text-3xl cursor-pointer font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-blue-400 dark:to-blue-300"
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
          onClick={() => {
            router.push("/")
          }}
        >
          SiPilih
        </motion.div>
      ) : (
        <div
          className="text-3xl cursor-pointer font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-blue-400 dark:to-blue-300"
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          SiPilih
        </div>
      )}
      <Badge
        variant="outline"
        className="ml-3 px-2 py-0 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800"
      >
        BETA
      </Badge>
    </div>
  )

  // Shared header content - User Actions
  const UserActions = (
    <div className="flex items-center gap-4">
      <Link
        href="/voter/help"
        className="flex items-center text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-md hover:bg-primary/10 hover:text-primary"
      >
        <HelpCircle className="w-4 h-4 mr-1.5" />
        Bantuan
      </Link>
      <ModeToggle />
    </div>
  )

  // Navigation component
  const Navigation = (
    <AnimatePresence mode="wait">
      {isCollapsed && (
        <motion.div 
          key="nav-links"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.19, 1.0, 0.22, 1.0],
          }}
          className={`flex items-center space-x-1 md:space-x-3 ${scrolled ? "bg-background/80" : "bg-background/60"} backdrop-blur-sm rounded-full shadow-sm px-1 border border-border/50 transition-all duration-300`}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.19, 1.0, 0.22, 1.0], 
                delay: index * 0.07
              }}
            >
              <Link
                href={item.url}
                className="flex items-center text-sm font-medium px-3 py-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 whitespace-nowrap"
              >
                {item.icon && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.07 + 0.2
                    }}
                    className="mr-1.5 md:mr-2"
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                )}
                <span className="hidden sm:inline-block">{item.title}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-gradient-to-r from-background to-background/90 backdrop-blur transition-all duration-300 ease-in-out">
        <div className="flex w-full items-center gap-2 px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            {LogoAndBrand}
          </div>
          
          <div className="flex-1" />
          
          {UserActions}
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0.6, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          height: scrolled ? "3.5rem" : "var(--header-height)",
        }}
        className={`flex shrink-0 items-center gap-2 border-b bg-gradient-to-r from-background to-background/90 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300 ease-in-out ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="flex w-full items-center gap-2 px-4 lg:px-6">
          {/* Left side: Sidebar trigger and logo */}
          <motion.div 
            className="flex items-center gap-2"
            animate={{ 
              opacity: scrolled ? 0 : 1,
              scale: scrolled ? 0.9 : 1,
              x: scrolled ? -20 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <SidebarTrigger className="-ml-1 hover:bg-primary/10 transition-colors duration-300" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            {LogoAndBrand}
          </motion.div>
          
          {/* Center: Navigation when sidebar is collapsed */}
          <div className={`flex justify-center transition-all duration-500 ease-in-out ${scrolled ? "flex-1" : "flex-1"}`}>
            {Navigation}
          </div>
          
          {/* Right side: User actions */}
          <motion.div 
            className="flex shrink-0"
            animate={{ 
              opacity: scrolled ? 0 : 1,
              scale: scrolled ? 0.9 : 1,
              x: scrolled ? 20 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {UserActions}
          </motion.div>
        </div>
      </motion.header>

      {/* Floating Navigation for scrolled state */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ 
            opacity: scrolled ? 1 : 0,
            y: scrolled ? 16 : -100,
            pointerEvents: scrolled ? "auto" : "none"
          }}
          transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-auto"
        >
          <div className="bg-background/80 backdrop-blur-lg shadow-lg rounded-full border border-border/50 py-1 px-2">
            {navItems.map((item, index) => (
              <motion.span
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="inline-block"
              >
                <Link
                  href={item.url}
                  className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 mx-1"
                >
                  <item.icon className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline-block">{item.title}</span>
                </Link>
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
