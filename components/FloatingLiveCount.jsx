"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useSWR from "swr";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FloatingLiveCount() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragConstraints, setDragConstraints] = useState(null);
  const [activeElectionId, setActiveElectionId] = useState(null);

  // Fetch all elections
  const { data: electionsData, error: electionsError } = useSWR(
    "/api/election/getAllElections",
    fetcher
  );

  // Fetch all candidates
  const { data: candidatesData, error: candidatesError } = useSWR(
    "/api/candidate/getAllCandidates",
    fetcher
  );

  // Normalize data to always be arrays
  const electionsRaw = Array.isArray(electionsData)
    ? electionsData
    : electionsData?.elections || [];
  const candidates = Array.isArray(candidatesData)
    ? candidatesData
    : candidatesData?.candidates || [];

  // Filter only ongoing elections
  const elections = electionsRaw.filter((e) => e.status === "ongoing");

  // Set drag constraints on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({ x: window.innerWidth - 200, y: window.innerHeight - 80 });
      setDragConstraints({
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      });
    }
  }, []); // Empty dependency array - hanya dijalankan sekali saat mount

  // Set default active election - separate useEffect
  useEffect(() => {
    if (elections?.length && !activeElectionId) {
      setActiveElectionId(elections[0]?.id);
    }
  }, [elections]);

  // Handle drag position
  const handleDrag = (e, info) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  // Get active election data
  const activeElection = elections?.find?.(
    (election) => election.id === activeElectionId
  );

  // Pie chart colors - matching the Hero emerald/teal color scheme
  const COLORS = ["#10b981", "#14b8a6", "#0d9488", "#047857", "#059669"];

  return (
    <>
      {/* Floating Button with gradient background */}
      <motion.div
        className="fixed z-50 cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={dragConstraints}
        dragElastic={0.2}
        dragMomentum={false}
        onDrag={handleDrag}
        style={{
          top: position.y,
          left: position.x,
          transform: "translate(-50%, -50%)",
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Button
          className="rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white flex items-center gap-3 
            transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 cursor-pointer select-none touch-none
            active:scale-95 px-6 py-5 text-base font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <BarChart className="h-5 w-5" />
          Live Count
        </Button>
      </motion.div>

      {/* Live Count Modal with Hero styling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/90 dark:to-slate-950 rounded-2xl shadow-2xl max-w-3xl w-full p-8 border border-gray-100 dark:border-slate-700/30
                max-h-[85vh] overflow-y-auto relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                {/* Top-right blob */}
                <motion.div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-400/40 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-600/15 blur-3xl"
                  initial={{ opacity: 0 }}
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

                {/* Bottom-left blob */}
                <motion.div
                  className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-l from-teal-400/30 to-emerald-500/30 dark:from-teal-600/20 dark:to-emerald-600/20 blur-3xl"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 0.8,
                    scale: [0.9, 1.05, 0.9],
                    x: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 0.4,
                    x: { repeat: Infinity, duration: 12, ease: "easeInOut" },
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
              </div>

              <div className="relative z-10">
                {/* Header with gradient text */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    Live Count Results
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Error Handling */}
                {(electionsError || candidatesError) && (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <X className="h-8 w-8 text-red-500 dark:text-red-400" />
                    </div>
                    <p className="text-red-500 dark:text-red-400 font-medium">
                      Failed to load data. Please try again later.
                    </p>
                  </div>
                )}

                {/* Loading State - enhanced with animation */}
                {(!electionsData || !candidatesData) &&
                  !electionsError &&
                  !candidatesError && (
                    <div className="flex flex-col justify-center items-center h-80">
                      <div className="relative w-16 h-16 mb-4">
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-emerald-500/30 dark:border-emerald-500/20"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-t-emerald-600 dark:border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        Loading data...
                      </span>
                    </div>
                  )}

                {/* Election Selector - styled to match Hero */}
                {elections?.length > 0 && (
                  <>
                    <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/30 mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Election:
                      </label>
                      <Select
                        onValueChange={(value) => setActiveElectionId(value)}
                        defaultValue={elections[0]?.id}
                      >
                        <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-slate-700/50 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring focus:ring-emerald-200 dark:focus:ring-emerald-900/50 focus:ring-opacity-50 bg-white dark:bg-slate-900">
                          <SelectValue placeholder="Select an election" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border-gray-200 dark:border-slate-700/50">
                          {elections.map((election) => (
                            <SelectItem
                              key={election.id}
                              value={election.id}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
                            >
                              {election.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Election Content */}
                    {activeElection && (
                      <motion.div
                        className="mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-600/10 dark:to-teal-600/10 p-3 rounded-lg mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {activeElection.title}
                          </h3>
                          {activeElection.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {activeElection.description}
                            </p>
                          )}
                        </div>

                        {/* Candidate List with styled items */}
                        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700/30 mb-6">
                          <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            Candidate Results
                          </h4>
                          <div className="space-y-3">
                            {candidates
                              ?.filter(
                                (candidate) =>
                                  candidate.election?.id === activeElection.id
                              )
                              .map((candidate, index, filteredCandidates) => {
                                const totalVotes = filteredCandidates.reduce(
                                  (total, candidate) =>
                                    total + candidate.voteCount,
                                  0
                                );
                                const percentage =
                                  totalVotes > 0
                                    ? (
                                        (candidate.voteCount / totalVotes) *
                                        100
                                      ).toFixed(1)
                                    : 0;

                                return (
                                  <motion.div
                                    key={candidate.id}
                                    className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <div className="flex items-center gap-3">
                                      {/* Color Indicator */}
                                      <div
                                        className="h-4 w-4 rounded-full"
                                        style={{
                                          backgroundColor:
                                            COLORS[index % COLORS.length],
                                        }}
                                      ></div>
                                      {/* Candidate Photo */}
                                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                                        <img
                                          src={
                                            candidate.photo?.startsWith("http")
                                              ? candidate.photo
                                              : `${process.env.NEXT_PUBLIC_API_BASE_URL}${candidate.photo}`
                                          }
                                          alt={candidate.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      {/* Candidate Name */}
                                      <span className="font-medium text-gray-800 dark:text-gray-100">
                                        {candidate.name}
                                      </span>
                                    </div>

                                    {/* Vote Percentage with progress bar */}
                                    <div className="flex items-center gap-3">
                                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                        <motion.div
                                          className="h-2.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              COLORS[index % COLORS.length],
                                            width: `${percentage}%`,
                                          }}
                                          initial={{ width: 0 }}
                                          animate={{ width: `${percentage}%` }}
                                          transition={{
                                            duration: 1,
                                            ease: "easeOut",
                                          }}
                                        ></motion.div>
                                      </div>
                                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                                        {percentage}%
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })}
                          </div>
                        </div>

                        {/* Enhanced Pie Chart */}
                        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/30 p-6 mb-6">
                          <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 text-center">
                            Vote Distribution
                          </h4>
                          <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={candidates
                                    ?.filter(
                                      (candidate) =>
                                        candidate.election?.id ===
                                        activeElection.id
                                    )
                                    .map((candidate) => ({
                                      name: candidate.name,
                                      value: candidate.voteCount,
                                    }))}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={70}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, value, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                  }
                                  labelLine={false}
                                >
                                  {candidates
                                    ?.filter(
                                      (candidate) =>
                                        candidate.election?.id ===
                                        activeElection.id
                                    )
                                    .map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                      />
                                    ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor:
                                      "var(--tooltip-bg, #ffffff)",
                                    border:
                                      "1px solid var(--tooltip-border, #f3f4f6)",
                                    borderRadius: "0.5rem",
                                    boxShadow:
                                      "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    padding: "0.75rem",
                                  }}
                                  itemStyle={{
                                    color: "var(--tooltip-text, #4b5563)",
                                    fontWeight: 500,
                                  }}
                                  formatter={(value, name) => [
                                    `${value} votes`,
                                    name,
                                  ]}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Total Votes with styled badge */}
                        <div className="text-center mt-6">
                          <div className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-600/10 dark:to-teal-600/10 rounded-full">
                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                              Total Votes:{" "}
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {candidates
                                  ?.filter(
                                    (candidate) =>
                                      candidate.election?.id ===
                                      activeElection.id
                                  )
                                  .reduce(
                                    (total, candidate) =>
                                      total + candidate.voteCount,
                                    0
                                  )
                                  .toLocaleString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* No elections case */}
                {elections?.length === 0 && electionsData && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <BarChart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No Elections Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                      There are currently no elections to display. Please check
                      back later.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
