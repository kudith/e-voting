"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, UserCheck, ShieldCheck, Globe } from "lucide-react";

// Predefined positions for decorative particles to prevent hydration errors
const particlePositions = [
  { top: 41.17, left: 30.67 },
  { top: 36.32, left: 34.91 },
  { top: 21.88, left: 10.72 },
  { top: 16.12, left: 68.30 },
  { top: 69.92, left: 32.64 },
  { top: 69.06, left: 27.06 },
  { top: 57.19, left: 31.33 },
  { top: 36.18, left: 74.67 }
];

export default function AboutDetails() {
  const features = [
    {
      icon: (
        <CheckCircle className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Keamanan Terjamin",
      description:
        "Teknologi enkripsi modern untuk melindungi semua data suara",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <UserCheck className="h-14 w-14 text-teal-600 dark:text-teal-400" />
      ),
      title: "Verifikasi Pemilih",
      description:
        "Sistem autentikasi dua faktor untuk memastikan identitas pemilih",
      color: "bg-teal-100 dark:bg-teal-950/40",
      accentColor: "from-teal-500 to-emerald-600",
    },
    {
      icon: (
        <ShieldCheck className="h-14 w-14 text-green-600 dark:text-green-400" />
      ),
      title: "Privasi Data",
      description:
        "Perlindungan data pribadi sesuai standar keamanan tertinggi",
      color: "bg-green-100 dark:bg-green-950/40",
      accentColor: "from-green-500 to-emerald-500",
    },
    {
      icon: (
        <Globe className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Akses Global",
      description:
        "Pemungutan suara dapat dilakukan dari mana saja dengan koneksi internet",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section id="about"  className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left splash */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/40 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-600/15 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.7,
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
          className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-400/30 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-600/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.6,
            y: [0, -15, 0, 15, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 0.6,
            y: { repeat: Infinity, duration: 13, ease: "easeInOut" },
          }}
        />

        {/* Center splash */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-200/20 to-green-300/10 dark:from-teal-500/10 dark:to-green-500/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0.2, 0.5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small decorative particles */}
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-500/40 dark:bg-emerald-400/40"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30 px-4 py-2 mb-4 text-sm font-medium"
            >
              Tentang Kami
            </Badge>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
              Membangun Masa Depan Demokrasi Digital
            </span>
          </motion.h2>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Platform e-voting yang aman, transparan dan mudah diakses untuk
            proses pemilihan di lingkungan Universitas
          </motion.p>
        </motion.div>

        {/* About Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left side description */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600/30 dark:to-teal-600/30 opacity-20 blur-sm"></div>
              <div className="relative bg-white dark:bg-slate-900/90 p-6 rounded-lg shadow-sm dark:shadow-slate-900/10 border border-transparent dark:border-slate-700/30">
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  Proyek ini mengembangkan platform e-voting berbasis web untuk
                  mendukung proses pemilihan di lingkungan Universitas. Sistem
                  ini dirancang untuk mengatasi tantangan seperti kurangnya
                  transparansi, risiko manipulasi suara, dan rendahnya
                  kepercayaan terhadap hasil.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-600/30 dark:to-green-600/30 opacity-20 blur-sm"></div>
              <div className="relative bg-white dark:bg-slate-900/90 p-6 rounded-lg shadow-sm dark:shadow-slate-900/10 border border-transparent dark:border-slate-700/30">
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  Dengan teknologi modern seperti Next.js dan antarmuka
                  responsif dari ShadCN/UI, platform ini menyajikan pengalaman
                  pemungutan suara yang aman, mudah diakses, dan terstruktur
                  rapi antara peran admin dan pemilih.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`rounded-xl shadow-lg dark:shadow-slate-900/10 border border-gray-100 dark:border-slate-700/30 overflow-hidden bg-white dark:bg-slate-900/90`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className={`p-6 flex flex-col items-center text-center`}>
                  <div className={`${feature.color} p-4 rounded-full mb-4`}>
                    <div className={`text-gradient-${index}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                  <div
                    className="w-full h-1 mt-4 rounded-full bg-gradient-to-r opacity-75 dark:opacity-50"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${feature.accentColor
                        .replace("from-", "")
                        .replace("to-", "")})`,
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SVG path connector */}
        <div className="relative hidden lg:block">
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-24 opacity-30 dark:opacity-20"
            viewBox="0 0 1200 100"
          >
            <motion.path
              d="M0,50 C300,80 600,20 900,50 C1050,70 1150,40 1200,50"
              stroke="url(#aboutGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient
                id="aboutGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
