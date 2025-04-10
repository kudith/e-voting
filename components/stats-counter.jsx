"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, Users } from "lucide-react"

export default function StatsCounter({ targetStats, statsControls }) {
  const [stats, setStats] = useState({ votes: 0, voters: 0 })

  // Animate the counters
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        votes: Math.min(prev.votes + Math.floor(targetStats.votes / 100), targetStats.votes),
        voters: Math.min(prev.voters + Math.floor(targetStats.voters / 100), targetStats.voters),
      }))
    }, 30)

    return () => clearInterval(interval)
  }, [targetStats])

  return (
    <motion.div className="grid grid-cols-2 gap-4 mt-12" initial={{ opacity: 0, y: 20 }} animate={statsControls}>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Total Votes Cast
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.votes.toLocaleString()}</div>
      </div>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Active Voters
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.voters.toLocaleString()}</div>
      </div>
    </motion.div>
  )
}

