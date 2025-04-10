"use client"

import { useState, useEffect } from "react"
import { useScroll, useTransform } from "framer-motion"
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
export default function EVotingPlatform() {
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { scrollYProgress } = useScroll()
  const navbarOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const navbarBlur = useTransform(scrollYProgress, [0, 0.1], [5, 10])
  const navbarY = useTransform(scrollYProgress, [0, 0.1], [0, 8])

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 dark:text-white min-h-screen transition-colors duration-300">
        <Navbar
          scrolled={scrolled}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          navbarOpacity={navbarOpacity}
          navbarBlur={navbarBlur}
          navbarY={navbarY}
        />
        <HeroSection />
      </div>
    </div>
  )
}

