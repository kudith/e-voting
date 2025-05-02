"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import StatsCounter from "./stats-counter";
import useSWR from "swr";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Predefined positions for decorative particles to prevent hydration errors
const particlePositions = [
  { top: 25, left: 15 },
  { top: 45, left: 25 },
  { top: 65, left: 10 },
  { top: 35, left: 80 },
  { top: 75, left: 50 },
  { top: 20, left: 70 },
  { top: 60, left: 90 },
  { top: 50, left: 40 },
];

export default function HeroSection() {
  const [currentElectionIndex, setCurrentElectionIndex] = useState(0);
  const [ongoingElections, setOngoingElections] = useState([]);
  const heroRef = useRef(null);
  const statsControls = useAnimation();

  // Fetch all elections
  const { data: elections, error } = useSWR(
    "/api/election/getAllElections",
    fetcher
  );

  // Filter ongoing elections
  useEffect(() => {
    if (elections) {
      const now = new Date();
      const filteredElections = elections.filter(
        (election) =>
          new Date(election.startDate) <= now &&
          new Date(election.endDate) >= now &&
          election.status === "ongoing"
      );
      setOngoingElections(filteredElections);
    }
  }, [elections]);

  const handleNext = () => {
    if (
      ongoingElections &&
      currentElectionIndex < ongoingElections.length - 1
    ) {
      setCurrentElectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (ongoingElections && currentElectionIndex > 0) {
      setCurrentElectionIndex((prev) => prev - 1);
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 min-h-screen overflow-hidden"
    >
      {/* Decorative background elements */}
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

        {/* Small decorative particles - Using predefined positions to prevent hydration errors */}
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
                y: [0, -30],
              }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column: Text Content */}
          <div className="max-w-xl pt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-3 inline-block rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 font-medium"
            >
              Masa Depan Demokrasi Digital
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight text-gray-900 dark:text-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">Era Baru</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                Pemilihan yang Aman
              </span>
              <span className="block">& Transparan</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Rasakan pengalaman platform e-voting paling canggih dengan
              keamanan terbaik, verifikasi blockchain, dan pemantauan hasil
              secara langsung. SiPilih menghadirkan demokrasi digital dengan
              integritas tanpa kompromi.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="rounded-full px-8 gap-2 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 hover:dark:from-emerald-600 hover:dark:to-teal-600 text-white hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 hover:scale-105 transition-all"
              >
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-600 hover:scale-105 transition-all"
                onClick={() => {
                  const howItWorksSection =
                    document.querySelector("#howitworks");
                  if (howItWorksSection) {
                    howItWorksSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Bagaimana Cara Kerjanya? <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Stats Counter - with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800"
            >
              <StatsCounter
                targetStats={{ votes: 12489632, voters: 3254891 }}
                statsControls={statsControls}
              />
            </motion.div>
          </div>

          {/* Right column: Election Card - Positioned slightly higher */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white dark:bg-slate-900/90 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700/30 relative mt-[-20px]"
          >
            {/* Decorative accent in corner */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-600/20 dark:from-emerald-500/10 dark:to-teal-600/10 blur-xl"></div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
            >
              Pemilihan Sedang Berlangsung
            </motion.h2>

            {error && (
              <div className="p-6 text-center">
                <p className="text-red-500 dark:text-red-400">
                  Gagal memuat data pemilihan.
                </p>
              </div>
            )}

            {!elections && (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-3 w-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            )}

            {elections && ongoingElections.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tidak Ada Pemilihan Aktif
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Saat ini tidak ada pemilihan yang sedang berlangsung.
                </p>
              </div>
            )}

            {ongoingElections.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {ongoingElections[currentElectionIndex].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  {ongoingElections[currentElectionIndex].description}
                </p>

                {/* Chart with enhanced styling */}
                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl mb-6 border border-transparent dark:border-slate-700/30">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ongoingElections[
                            currentElectionIndex
                          ].candidates.map((candidate) => ({
                            name: candidate.name,
                            value: candidate.voteCount,
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                          isAnimationActive={true}
                        >
                          {ongoingElections[
                            currentElectionIndex
                          ].candidates.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#10b981", // emerald-500
                                  "#14b8a6", // teal-500
                                  "#0d9488", // teal-600
                                  "#047857", // emerald-700
                                  "#059669", // emerald-600
                                ][index % 5]
                              }
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--tooltip-bg, #ffffff)",
                            border: "1px solid var(--tooltip-border, #f3f4f6)",
                            borderRadius: "0.5rem",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            padding: "0.75rem",
                          }}
                          itemStyle={{
                            color: "var(--tooltip-text, #4b5563)",
                            fontWeight: 500,
                          }}
                          formatter={(value, name) => [`${value} suara`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentElectionIndex === 0}
                    className="rounded-full border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={
                      currentElectionIndex === ongoingElections.length - 1
                    }
                    className="rounded-full border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
                  >
                    Selanjutnya <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center items-center gap-1.5 mt-6">
                  {ongoingElections.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentElectionIndex
                          ? "w-6 bg-emerald-600 dark:bg-emerald-500"
                          : "w-1.5 bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
