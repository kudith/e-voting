"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Vote, Moon, Sun } from "lucide-react";
import NavLink from "./nav-link";
import { useRouter } from "next/navigation";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

export default function Navbar({
  scrolled,
  darkMode,
  setDarkMode,
  navbarOpacity,
  navbarBlur,
  navbarY,
}) {
  const router = useRouter();
  const handleLogoClick = () => {
    router.push("/");
  };
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        opacity: navbarOpacity,
        y: navbarY,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
    >
      <div
        className={`mx-4 my-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/70 dark:bg-slate-900/70 shadow-lg dark:shadow-slate-700/10 border border-slate-200/50 dark:border-slate-700/50"
            : "bg-white/50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-700/30"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                rotate: scrolled ? [0, 10, 0] : 0,
                scale: scrolled ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Vote className="h-7 w-7 text-primary" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-blue-400">
              VoteChain
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" label="Home" delay={0.1} />
            <NavLink href="/features" label="Features" delay={0.2} />
            <NavLink href="/how-it-works" label="How It Works" delay={0.3} />
            <NavLink href="/security" label="Security" delay={0.4} />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 ml-2"
            >
              <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LoginLink>
                <Button
                  variant="default"
                  className="rounded-full px-6 shadow-md cursor-pointer shadow-primary/20 dark:shadow-primary/10"
                >
                  Login
                </Button>
              </LoginLink>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="block md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-slate-800 dark:bg-white"></span>
              <span className="block h-0.5 w-6 bg-slate-800 dark:bg-white"></span>
              <span className="block h-0.5 w-6 bg-slate-800 dark:bg-white"></span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
