"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import BackgroundAnimation from "./background-animation"
import StatsCounter from "./stats-counter"
import VotingInterface from "./voting-interface"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const statsControls = useAnimation()

  // Target stats for the counter
  const targetStats = { votes: 12489632, voters: 3254891 }

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animate stats counters
  useEffect(() => {
    statsControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 1.2 },
    })
  }, [statsControls])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      <BackgroundAnimation />

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-3 inline-block rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1 text-sm text-primary dark:text-primary-foreground font-medium"
          >
            The Future of Democracy
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="block">A New Era of</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
              Secure & Transparent
            </span>
            <span className="block">Voting</span>
          </motion.h1>

          <motion.p
            className="text-lg text-slate-600 dark:text-slate-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the most advanced e-voting platform with unparalleled security, blockchain verification, and
            real-time monitoring. Democracy reimagined for the digital age with zero compromise on integrity.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0px 0px 0px rgba(0,0,0,0)",
                  "0px 0px 15px rgba(var(--primary-rgb), 0.5)",
                  "0px 0px 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Button size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20 dark:shadow-primary/10">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="lg" className="rounded-full px-8 border-slate-300 dark:border-slate-700">
                How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Counter */}
          <StatsCounter targetStats={targetStats} statsControls={statsControls} />
        </div>

        {/* 3D Illustration */}
        <VotingInterface mousePosition={mousePosition} />
      </div>
    </section>
  )
}

