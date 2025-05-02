"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

// Predefined positions for decorative particles to prevent hydration errors
const particlePositions = [
  { top: 34.24, left: 65.48 },
  { top: 32.01, left: 45.88 },
  { top: 79.76, left: 12.14 },
  { top: 72.42, left: 46.31 },
  { top: 23.11, left: 28.61 }
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-800 to-slate-900 text-white py-16 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left splash */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-600/20 to-teal-600/15 blur-3xl"
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
          className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-600/20 to-teal-600/20 blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-500/10 to-green-500/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0.2, 0.3, 0],
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
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/60"
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
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-8">
          {/* Logo and Description - 5 columns on desktop */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                SiPilih
              </h2>
            </motion.div>

            <motion.p
              className="text-slate-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              SiPilih adalah platform e-voting modern yang mengutamakan
              keamanan, transparansi, dan kemudahan dalam proses pemilu digital.
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            ></motion.div>
          </motion.div>

          {/* Quick Links - 3 columns on desktop */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              {["Beranda", "Tentang Kami", "Cara Kerja", "Teknologi", "Cara Memilih"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={
                        item === "Beranda"
                          ? "/"
                          : `/${item.toLowerCase().replace(/ /g, "-")}`
                      }
                      className="text-slate-300 hover:text-white flex items-center gap-1.5 hover:translate-x-1 transition-all duration-200"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      {item}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact Information - 4 columns on desktop */}
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
              Kontak Kami
            </h3>
            <ul className="space-y-4">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-slate-700/50 rounded-full">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <a
                  href="mailto:support@sipilih.com"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  support@sipilih.com
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-slate-700/50 rounded-full">
                  <Phone className="h-4 w-4 text-emerald-400" />
                </div>
                <a
                  href="tel:+6281234567890"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  +62 xxx-xxxx-xxxx
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-slate-700/50 rounded-full">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">
                  Tasikmalaya, Jawa Barat, Indonesia
                </span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-white/10 pt-6 mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.p
            className="text-sm text-slate-400"
            whileInView={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            © {new Date().getFullYear()} SiPilih. Semua Hak Dilindungi.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
