"use client"

import { useState, useEffect } from "react"
import { useScroll, useTransform } from "framer-motion"
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
export default function EVotingPlatform() {
  const [scrolled, setScrolled] = useState(false)
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


  return (
    <div
      className={`min-h-screen transition-colors duration-300`}
    >
      <div className="min-h-screen transition-colors duration-300">
        <Navbar
          scrolled={scrolled}
          navbarOpacity={navbarOpacity}
          navbarBlur={navbarBlur}
          navbarY={navbarY}
        />
        <HeroSection />
      </div>
    </div>
  )
}

