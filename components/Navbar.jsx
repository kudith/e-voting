"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import NavLink from "./nav-link";
import { useRouter } from "next/navigation";
import { LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({
  scrolled,
  navbarOpacity,
  navbarBlur,
  navbarY,
}) {
  const router = useRouter();
  const { user, isAuthenticated, getAccessToken } = useKindeBrowserClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessToken();
        
        const hasAdminRole = accessToken?.roles?.some(role => role.key === "admin");
        const hasAdminPermission = accessToken?.permissions?.includes("access:admin");
        
        setIsAdmin(hasAdminRole && hasAdminPermission);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, getAccessToken]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const getUserInitials = () => {
    if (user?.given_name) {
      return user.given_name[0].toUpperCase();
    }
    if (user?.family_name) {
      return user.family_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <motion.header
      className="fixed max-w-7xl mx-auto top-0 left-0 right-0 z-30"
      style={{
        opacity: navbarOpacity,
        y: navbarY,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
    >
      {/* Decorative background elements for navbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glowing dot top-left */}
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-600/10 blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: scrolled ? 0.7 : 0,
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glowing dot top-right */}
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-l from-teal-500/20 to-emerald-600/10 blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: scrolled ? 0.7 : 0,
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 5,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small particles */}
        {scrolled && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-emerald-400/60"
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                  y: [0, -10, -20],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}
      </div>

      <div
        className={`my-4 px-6 py-4 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-white/90 via-white/80 to-white/90 dark:from-slate-900/90 dark:via-slate-950/80 dark:to-slate-900/90 shadow-lg border border-white/30 dark:border-slate-700/30"
            : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo - Enhanced with HowToVote styling */}
          <motion.div
            className="flex items-center gap-2 text-xl font-bold cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleLogoClick}
          >
            <motion.span
              className="text-3xl relative bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              SiPilih
            </motion.span>
            <Badge
              variant="outline"
              className="px-2 text-xs cursor-auto bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300"
            >
              BETA
            </Badge>
          </motion.div>

          {/* Desktop Navigation - Styled to match HowToVote */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#hero" label="Beranda" delay={0.1} />
            <NavLink href="#about" label="Tentang Kami" delay={0.2} />
            <NavLink href="#howitworks" label="Cara Kerja" delay={0.3} />
            <NavLink href="#tech" label="Teknologi" delay={0.4} />
            <NavLink href="#howtovote" label="Cara Memilih" delay={0.4} />
            {isAuthenticated && (
              <NavLink
                href={isAdmin ? "/admin/dashboard" : "/voter/dashboard"}
                label="Dasboard"
                delay={0.5}
              />
            )}

            {/* Theme toggle button */}
            <ModeToggle />

            {/* Authenticated user menu */}
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full group cursor-pointer overflow-hidden"
                    >
                      {/* Animated hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <Avatar className="h-10 w-10 relative z-10">
                        <AvatarImage
                          src={user?.picture}
                          alt={user?.given_name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 text-gray-800 dark:text-indigo-300">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/30 dark:border-slate-700/30 rounded-xl shadow-xl"
                    align="end"
                    forceMount
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.given_name} {user?.family_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-md transition-colors">
                        <User className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Profil</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                    <LogoutLink>
                      <DropdownMenuItem className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-md transition-colors">
                        <LogOut className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Keluar</span>
                      </DropdownMenuItem>
                    </LogoutLink>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
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
                    className="rounded-full px-8 py-2 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none relative overflow-hidden group"
                  >
                    {/* Animated highlight overlay */}
                    <motion.span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                    <span className="relative z-10">Login</span>
                  </Button>
                </LoginLink>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button - styled to match */}
          <motion.button
            className="block md:hidden rounded-lg p-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <motion.span
                className="block h-0.5 w-6 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-6 py-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 rounded-b-2xl shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <NavLink
                href="#hero"
                label="Beranda"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="#about"
                label="Tentang Kami"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="#howitworks"
                label="Cara Kerja"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="#tech"
                label="Teknologi"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="#howtovote"
                label="Cara Memilih"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {isAuthenticated && (
                <NavLink
                  href={isAdmin ? "/admin/dashboard" : "/voter/dashboard"}
                  label="Dasbor"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <ModeToggle />

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture} alt={user?.given_name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500/30 to-teal-600/30 text-emerald-700 dark:text-emerald-300">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <LogoutLink>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-emerald-700 dark:text-emerald-300"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Keluar
                      </Button>
                    </LogoutLink>
                  </div>
                ) : (
                  <LoginLink>
                    <Button
                      size="sm"
                      className="rounded-full px-6 shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      Login
                    </Button>
                  </LoginLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}