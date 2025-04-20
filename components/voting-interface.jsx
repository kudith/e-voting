"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Vote, Shield } from "lucide-react"
import { Card } from "./ui/card"

export default function VotingInterface({ mousePosition }) {
  return (
    <motion.div
      className="relative hidden md:block"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`,
      }}
    >
      <div className="relative">
        {/* Glow Effects */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Main Card */}
        <Card className="relative p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Vote className="h-6 w-6 text-primary" />
              <span className="font-semibold">Secure Ballot Interface</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Verified & Encrypted</span>
            </div>
          </div>

          {/* Futuristic Interface */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">Presidential Election 2025</div>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-4 cursor-pointer border border-transparent hover:border-primary/50 transition-colors"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    y: -2,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1 + item * 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-medium">
                      {item}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">Candidate {item}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Party {item}</div>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary/70 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${30 + item * 10}%` }}
                          transition={{ duration: 1, delay: 1.5 + item * 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Verification */}
            <Card className="p-8 py-4 rounded-2xl shadow-xl gap-0.5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">Blockchain Verification</div>
                <motion.div
                  className="h-2 w-2 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <div className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                0x7a69c2d5c0b7e3f5e5c8c6d7e8f9a0b1c2d3e4f5...
              </div>
            </Card>

            {/* Action Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full rounded-xl shadow-lg shadow-primary/20 dark:shadow-primary/10">
                Cast Your Vote
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-16 -left-10 h-40 w-40 bg-blue-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </motion.div>
  )
}

