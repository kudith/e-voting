"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Vote, Moon, Sun, User, LogOut } from "lucide-react";
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

export default function Navbar({
  scrolled,
  darkMode,
  setDarkMode,
  navbarOpacity,
  navbarBlur,
  navbarY,
}) {
  const router = useRouter();
  const { user, isAuthenticated, getAccessToken } = useKindeBrowserClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessToken();
        console.log('Access Token:', accessToken);
        
        const hasAdminRole = accessToken?.roles?.some(role => role.key === "admin");
        const hasAdminPermission = accessToken?.permissions?.includes("access:admin");
        
        console.log('Has Admin Role:', hasAdminRole);
        console.log('Has Admin Permission:', hasAdminPermission);
        
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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        opacity: navbarOpacity,
        y: navbarY,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
    >
      <div
        className={`mx-4 my-4 px-6 py-4 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-white/90 to-white/80 dark:from-zinc-950 dark:to-zinc-900/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/30 dark:border-accent-foreground/30"
            : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 text-xl font-bold cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleLogoClick}
          >
            <motion.span 
              className="text-3xl relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-blue-400 dark:to-blue-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
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
              className="px-2 text-xs cursor-auto bg-primary/10 border-accent-foreground/50"
            >
              BETA
            </Badge>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" label="Home" delay={0.1} />
            <NavLink href="/features" label="Features" delay={0.2} />
            <NavLink href="/how-it-works" label="How It Works" delay={0.3} />
            <NavLink href="/security" label="Security" delay={0.4} />
            {isAuthenticated && (
              <NavLink 
                href={isAdmin ? "/admin/dashboard" : "/voter/dashboard"} 
                label="Dashboard" 
                delay={0.5} 
              />
            )}

            {/* <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 ml-2"
            >
              <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </motion.div> */}
            <ModeToggle/>

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
                      className="relative h-10 w-10 rounded-full group cursor-pointer"
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                      />
                      <Avatar className="h-10 w-10 relative z-10">
                        <AvatarImage src={user?.picture} alt={user?.given_name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/30 dark:border-zinc-700/30" 
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
                    <DropdownMenuSeparator className="bg-white/30 dark:bg-zinc-700/30" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer hover:bg-white/30 dark:hover:bg-zinc-800/30">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/30 dark:bg-zinc-700/30" />
                    <LogoutLink>
                      <DropdownMenuItem className="cursor-pointer hover:bg-white/30 dark:hover:bg-zinc-800/30">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
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
                    className="rounded-full px-6 shadow-md cursor-pointer shadow-primary/20 dark:shadow-primary/10 relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                    />
                    <span className="relative z-10">Login</span>
                  </Button>
                </LoginLink>
              </motion.div>
            )}
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
              <span className="block h-0.5 w-6 bg-zinc-800 dark:bg-white"></span>
              <span className="block h-0.5 w-6 bg-zinc-800 dark:bg-white"></span>
              <span className="block h-0.5 w-6 bg-zinc-800 dark:bg-white"></span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
