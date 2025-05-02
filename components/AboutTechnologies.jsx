"use client";

import { motion } from "framer-motion";
import { Hash, Lock, Code, ShieldCheck } from "lucide-react";

// Predefined positions for decorative particles to prevent hydration errors
const particlePositions = [
  { top: 62.99, left: 83.80 },
  { top: 30.86, left: 72.62 },
  { top: 31.01, left: 64.04 },
  { top: 33.58, left: 79.63 },
  { top: 26.57, left: 22.37 },
  { top: 45.04, left: 34.98 }
];

export default function AboutTechnologies() {
  const technologies = [
    {
      icon: <Hash className="h-12 w-12 mb-4" />,
      title: "Merkle Tree & SHA-256",
      description:
        "Setiap suara di-hash menggunakan SHA-256 dan dimasukkan ke dalam struktur Merkle Tree untuk transparansi dan auditabilitas.",
      color: "bg-emerald-100/80 dark:bg-emerald-900/30",
      accentColor: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Lock className="h-12 w-12 mb-4" />,
      title: "Autentikasi Modern",
      description:
        "Menggunakan Kinde (OAuth) untuk autentikasi aman dengan ID unik dan OTP.",
      color: "bg-teal-100/80 dark:bg-teal-900/30",
      accentColor: "from-teal-500 to-emerald-600",
    },
    {
      icon: <Code className="h-12 w-12 mb-4" />,
      title: "Next.js & ShadCN/UI",
      description:
        "Dibangun dengan Next.js untuk performa tinggi dan ShadCN/UI untuk antarmuka responsif.",
      color: "bg-green-100/80 dark:bg-green-900/30",
      accentColor: "from-green-500 to-emerald-500",
    },
    {
      icon: <ShieldCheck className="h-12 w-12 mb-4" />,
      title: "Keamanan Terjamin",
      description:
        "Sistem ini dirancang untuk mengatasi risiko manipulasi suara dan menjaga privasi pemilih dengan teknologi keamanan modern.",
      color: "bg-emerald-100/80 dark:bg-emerald-900/30",
      accentColor: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section id="tech" className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 py-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left splash */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/40 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-700/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.6,
            scale: [0.8, 1.1, 0.9],
            y: [0, -8, 0, 8, 0],
          }}
          transition={{
            duration: 3,
            y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
          }}
        />

        {/* Bottom-right splash */}
        <motion.div
          className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-teal-400/30 to-emerald-400/30 dark:from-teal-600/20 dark:to-emerald-700/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            scale: [0.9, 1, 0.9],
            y: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 0.6,
            y: { repeat: Infinity, duration: 11, ease: "easeInOut" },
          }}
        />

        {/* Center splash */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-200/20 to-green-300/10 dark:from-emerald-600/10 dark:to-green-700/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0.2, 0.4, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small particles with fixed positions */}
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-600/40 dark:bg-emerald-400/60"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
              Teknologi yang Digunakan
            </span>
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Platform ini didukung oleh teknologi modern dan praktik keamanan
            terbaik
          </motion.p>
        </motion.div>

        {/* Technology grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className={`rounded-2xl ${tech.color} p-6 backdrop-blur-sm border border-gray-100/50 dark:border-white/10 relative overflow-hidden shadow-lg`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Background gradient for each card */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-20 z-0"></div>

              {/* Glowing dot in corner */}
              <div
                className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r ${tech.accentColor} blur-xl opacity-20`}
              ></div>

              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tech.accentColor} text-white mb-4`}
                >
                  {tech.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {tech.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {tech.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`w-full h-1 rounded-full bg-gradient-to-r ${tech.accentColor} mt-6 opacity-60`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional animated element - connecting lines */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-10 opacity-20 hidden lg:block"
          viewBox="0 0 1200 10"
        >
          <motion.path
            d="M0,5 C300,15 600,-5 900,5 C1050,10 1150,5 1200,5"
            stroke="url(#techGradient)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
