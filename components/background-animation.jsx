"use client"

import { motion } from "framer-motion"

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/80 to-blue-500/80 blur-3xl"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

