"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Vote,
  FileSpreadsheet,
  BarChart3,
  FileText,
} from "lucide-react";

export default function HowItWorks() {
  const processes = [
    {
      icon: (
        <UserPlus className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Input Data Pemilih",
      description:
        "Admin sistem menginput daftar pemilih berdasarkan NIM/NIP/NIK yang valid. Pemilih tidak perlu melakukan registrasi manual. Setiap pemilih diberikan akses login melalui OAuth dan ID unik.",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <ShieldCheck className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Autentikasi & Verifikasi Pemilih",
      description:
        "Sistem menggunakan layanan autentikasi OAuth (Kinde) dan mengirimkan OTP ke email untuk memverifikasi identitas pemilih. Pemilih hanya bisa login satu kali untuk melakukan pemilihan.",
      color: "bg-teal-100 dark:bg-teal-950/40",
      accentColor: "from-teal-500 to-green-600",
    },
    {
      icon: (
        <Vote className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Pemungutan Suara Digital",
      description:
        "Setelah login, pemilih diarahkan ke halaman voting dengan daftar kandidat dan profil mereka. Setelah memilih, suara di-hash menggunakan SHA-256 dan dimasukkan ke dalam struktur Merkle Tree.",
      color: "bg-green-100 dark:bg-green-950/40",
      accentColor: "from-green-500 to-emerald-600",
    },
    {
      icon: (
        <FileSpreadsheet className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Pencatatan & Audit",
      description:
        "Setiap suara yang masuk dicatat sebagai hash unik dan dapat diverifikasi oleh publik melalui halaman verifikasi. Sistem menyediakan halaman transparansi hasil yang menampilkan agregasi suara tanpa mengungkap identitas individu.",
      color: "bg-emerald-100 dark:bg-emerald-950/40",
      accentColor: "from-emerald-600 to-teal-500",
    },
    {
      icon: (
        <BarChart3 className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Pengumuman Hasil & Verifikasi",
      description:
        "Hasil akhir diumumkan secara real-time dan dapat diverifikasi melalui Merkle Root publik yang tersedia. Pemilih juga dapat memverifikasi suara mereka sendiri melalui halaman verifikasi suara.",
      color: "bg-teal-100 dark:bg-teal-950/40",
      accentColor: "from-teal-600 to-emerald-500",
    },
    {
      icon: (
        <FileText className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Dokumentasi & Audit Trail",
      description:
        "Setiap proses tercatat secara sistematis dalam sistem, memungkinkan pelaksanaan audit secara menyeluruh kapan pun diperlukan oleh pihak independen atau publik.",
      color: "bg-green-100 dark:bg-green-950/40",
      accentColor: "from-green-600 to-teal-500",
    },
  ];

  return (
    <section id="howitworks" className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 min-h-screen overflow-hidden">
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
          className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-400/30 to-green-300/30 dark:from-teal-600/20 dark:to-green-500/20 blur-3xl"
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
          className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-400/30 to-green-500/30 dark:from-emerald-600/20 dark:to-green-600/20 blur-3xl"
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

        {/* Small decorative particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-600/40 dark:bg-emerald-400/40"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [0, -30],
              }}
              transition={{
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            Cara Kerja Sistem E-Voting
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-300 mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Sistem informasi e-voting berbasis web yang mengotomatisasi dan
          mengefisienkan seluruh proses pemilihan dengan tingkat keamanan dan
          transparansi yang lebih tinggi
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {processes.map((process, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-900/90 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/10 border border-gray-100 dark:border-slate-700/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Process number badge */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/20 dark:from-emerald-500/20 dark:to-teal-500/30 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`p-4 rounded-2xl ${process.color} self-start`}>
                  {process.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {process.description}
                  </p>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="w-full h-1 mt-6 rounded-full bg-gradient-to-r opacity-75 dark:opacity-50"
                style={{
                  backgroundImage: `linear-gradient(to right, ${process.accentColor
                    .replace("from-", "")
                    .replace("to-", "")})`,
                }}
              ></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
