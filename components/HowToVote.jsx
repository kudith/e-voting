"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ClipboardCheck, CheckCircle, Eye, BarChart } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// Predefined positions for decorative particles to prevent hydration errors
const particlePositions = [
  { top: 76.77, left: 21.17 },
  { top: 57.05, left: 77.55 },
  { top: 49.75, left: 92.49 },
  { top: 54.27, left: 94.66 },
  { top: 80.85, left: 66.31 },
  { top: 33.37, left: 89.94 },
  { top: 38.45, left: 55.52 },
  { top: 49.44, left: 43.69 }
];

export default function HowToVotePage() {
  const { user, isAuthenticated } = useKindeBrowserClient();
  const router = useRouter();

  const handleVotingButtonClick = () => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on user type
      router.push(user?.isAdmin ? "/admin/dashboard" : "/voter/dashboard");
    }
    // If not authenticated, LoginLink will handle the redirect
  };
  const steps = [
    {
      icon: (
        <Lock className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Login & Verifikasi Identitas",
      description:
        "Pemilih login menggunakan ID unik melalui layanan autentikasi OAuth (Kinde). OTP dikirim ke email resmi untuk verifikasi identitas.",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <ClipboardCheck className="h-16 w-16 text-teal-600 dark:text-teal-400" />
      ),
      title: "Akses Dashboard Pemilih",
      description:
        "Setelah login, pemilih diarahkan ke dashboard untuk melihat status hak pilih dan memulai proses pemungutan suara.",
      color: "bg-teal-100 dark:bg-teal-950/40",
      accentColor: "from-teal-500 to-emerald-600",
    },
    {
      icon: (
        <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
      ),
      title: "Melakukan Pemungutan Suara",
      description:
        "Pemilih memilih kandidat berdasarkan preferensi mereka. Sistem menampilkan daftar kandidat beserta foto, nama, dan visi-misi.",
      color: "bg-green-100 dark:bg-green-950/40",
      accentColor: "from-green-500 to-teal-500",
    },
    {
      icon: (
        <Lock className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Pencatatan & Enkripsi Suara",
      description:
        "Suara diproses menggunakan hashing SHA-256 dan dimasukkan ke dalam Merkle Tree untuk menjaga integritas dan menghindari manipulasi.",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-600 to-teal-500",
    },
    {
      icon: <Eye className="h-16 w-16 text-teal-600 dark:text-teal-400" />,
      title: "Verifikasi Manual oleh Pemilih",
      description:
        "Pemilih dapat mengecek hash suara mereka untuk memastikan suara telah tercatat tanpa mengungkap isi suara atau identitas.",
      color: "bg-teal-100 dark:bg-teal-950/40",
      accentColor: "from-teal-500 to-emerald-500",
    },
    {
      icon: (
        <BarChart className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Melihat Hasil Voting",
      description:
        "Hasil pemungutan suara ditampilkan secara real-time, dengan grafik dan statistik untuk transparansi. Pemilih dapat melihat hasil suara mereka dan total suara yang diterima oleh setiap kandidat.",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section
      id="howtovote"
      className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 min-h-screen overflow-hidden"
    >
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left splash */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/40 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-600/15 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: [0.8, 1.1, 1],
            y: [0, -8, 0, 8, 0],
          }}
          transition={{
            duration: 3,
            y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
          }}
        />

        {/* Top-right splash */}
        <motion.div
          className="absolute top-10 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-green-300/30 to-teal-400/30 dark:from-green-500/20 dark:to-teal-600/20 blur-3xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 0.8,
            scale: [0.9, 1.05, 0.9],
            x: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 0.4,
            x: { repeat: Infinity, duration: 12, ease: "easeInOut" },
          }}
        />

        {/* Middle-left splash */}
        <motion.div
          className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-300/30 dark:from-teal-600/20 dark:to-emerald-500/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.7,
            rotate: [0, 5, 0, -5, 0],
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 1.5,
            delay: 0.8,
            rotate: { repeat: Infinity, duration: 15, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
          }}
        />

        {/* Bottom-right splash */}
        <motion.div
          className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-400/30 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-600/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.8,
            y: [0, -15, 0, 15, 0],
          }}
          transition={{
            duration: 2,
            delay: 1.2,
            y: { repeat: Infinity, duration: 13, ease: "easeInOut" },
          }}
        />

        {/* Center splash */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-tr from-teal-200/20 to-green-300/10 dark:from-teal-500/10 dark:to-green-500/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.6, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom-left splash */}
        <motion.div
          className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-teal-300/20 to-emerald-400/20 dark:from-teal-600/10 dark:to-emerald-600/10 blur-3xl hidden md:block"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            x: [0, -10, 0, 10, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            delay: 1.6,
            x: { repeat: Infinity, duration: 14, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 9, ease: "easeInOut" },
          }}
        />

        {/* Middle-right splash */}
        <motion.div
          className="absolute top-1/3 right-20 w-60 h-60 rounded-full bg-gradient-to-bl from-green-300/20 to-emerald-400/20 dark:from-green-600/10 dark:to-emerald-600/10 blur-3xl hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.6,
            y: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 2,
            delay: 1.8,
            y: { repeat: Infinity, duration: 11, ease: "easeInOut" },
          }}
        />

        {/* Small decorative particles - Using predefined positions */}
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-600/40 dark:bg-emerald-400/40"
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
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            Langkah-Langkah Voting
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-300 mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Proses pemungutan suara elektronik yang aman, transparan, dan mudah
          digunakan
        </motion.p>

        <div className="relative">
          {/* SVG PATH */}
          <svg
            viewBox="0 0 400 1800"
            className="absolute left-1/2 -translate-x-1/2 h-full z-0"
          >
            <motion.path
              d="M200 0 
                 C200 100, 100 200, 200 300
                 C300 400, 300 500, 200 600
                 C100 700, 100 800, 200 900
                 C300 1000, 300 1100, 200 1200
                 C100 1300, 100 1400, 200 1500
                 C300 1600, 300 1700, 200 1800"
              fill="none"
              stroke="url(#gradientPath)"
              strokeWidth="4"
              strokeDasharray="12 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="opacity-80 dark:opacity-50"
            />
            <defs>
              <linearGradient
                id="gradientPath"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                <stop offset="50%" stopColor="#14b8a6" /> {/* teal-500 */}
                <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
              </linearGradient>
            </defs>
          </svg>

          {/* STEPS */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row items-center mb-32 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Step number circle */}
              <motion.div
                className={`absolute left-1/2 -translate-x-1/2 -top-20 
                  ${
                    index % 2 === 0
                      ? " md:right-auto md:-left-20 md:translate-x-0"
                      : "md:left-auto  md:-right-20 md:translate-x-0"
                  } 
                  w-40 h-40 rounded-full ${
                    step.color
                  } flex items-center justify-center z-10 shadow-lg`}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-gray-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    LANGKAH
                  </span>
                </div>
              </motion.div>

              {/* Content - alternating left/right on desktop */}
              <div
                className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                } flex flex-col items-center md:items-start bg-white dark:bg-slate-900/90 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/10 border border-gray-100 dark:border-slate-700/30`}
              >
                <div className="mb-6">
                  <div
                    className={`p-4 rounded-2xl ${step.color} mb-4 inline-flex`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                <div
                  className="w-full h-1 mt-6 rounded-full bg-gradient-to-r opacity-75 dark:opacity-50 block"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${step.accentColor
                      .replace("from-", "")
                      .replace("to-", "")})`,
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {isAuthenticated ? (
            <button
              onClick={handleVotingButtonClick}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 hover:dark:from-emerald-600 hover:dark:to-teal-600 text-white font-medium rounded-full hover:shadow-lg dark:hover:shadow-emerald-900/20 transform hover:scale-105 transition-all"
            >
              Mulai Voting
            </button>
          ) : (
            <LoginLink>
              <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 hover:dark:from-emerald-600 hover:dark:to-teal-600 text-white font-medium rounded-full hover:shadow-lg dark:hover:shadow-emerald-900/20 transform hover:scale-105 transition-all">
                Mulai Voting
              </button>
            </LoginLink>
          )}
        </motion.div>
      </div>
    </section>
  );
}
