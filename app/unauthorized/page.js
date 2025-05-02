"use client"

import { motion } from "framer-motion"
import { ShieldAlert, Lock, KeyRound, AlertTriangle, Shield, UserX, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs"

export default function UnauthorizedPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const iconContainerVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.1,
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
  }

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  }

  const rotateVariants = {
    rotate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  const backgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        ease: "linear",
      },
    },
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate="animate"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
        variants={backgroundVariants}
      />
      <motion.div className="max-w-md w-full z-10" initial="hidden" animate="visible" variants={containerVariants}>
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-red-600">Akses Tidak Sah</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-lg">Anda tidak memiliki izin untuk mengakses halaman ini</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <motion.div className="relative h-48 w-48 mb-6" variants={iconContainerVariants}>
              {/* Main center icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={iconVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <ShieldAlert className="h-32 w-32 text-red-500" />
              </motion.div>

              {/* Orbiting icons */}
              <motion.div
                className="absolute"
                style={{ top: "10%", left: "10%" }}
                variants={iconVariants}
                animate="float"
                custom={1}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div variants={floatVariants} animate="float">
                  <Lock className="h-8 w-8 text-amber-600" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute"
                style={{ top: "15%", right: "15%" }}
                variants={iconVariants}
                animate="float"
                custom={2}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div variants={floatVariants} animate="float" transition={{ delay: 0.5 }}>
                  <KeyRound className="h-8 w-8 text-blue-600" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute"
                style={{ bottom: "15%", left: "15%" }}
                variants={iconVariants}
                animate="float"
                custom={3}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div variants={floatVariants} animate="float" transition={{ delay: 1 }}>
                  <UserX className="h-8 w-8 text-purple-600" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute"
                style={{ bottom: "10%", right: "10%" }}
                variants={iconVariants}
                animate="float"
                custom={4}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div variants={floatVariants} animate="float" transition={{ delay: 1.5 }}>
                  <AlertCircle className="h-8 w-8 text-green-600" />
                </motion.div>
              </motion.div>

              {/* Background decorative elements */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-dashed border-red-200"
                variants={rotateVariants}
                animate="rotate"
              />

              <motion.div
                className="absolute inset-4 rounded-full border-2 border-dotted border-amber-300"
                variants={rotateVariants}
                animate="rotate"
                style={{ animationDirection: "reverse" }}
              />

              <motion.div
                className="absolute inset-8 rounded-full border border-blue-200"
                variants={pulseVariants}
                animate="pulse"
              />
            </motion.div>

            <motion.div className="space-y-4 text-center" variants={itemVariants}>
              <p className="text-gray-700 font-medium">
                Sepertinya Anda mencoba mengakses area yang dibatasi. Silakan periksa izin Anda atau hubungi
                administrator.
              </p>

              <motion.div
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-800"
                variants={pulseVariants}
                animate="pulse"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Peringatan Keamanan</span>
              </motion.div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <motion.div
              className="w-full"
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="w-full bg-red-500">
                <Link href="/" className="w-full flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="w-full cursor-pointer"
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
            >
            <LoginLink>
              <Button variant="outline" className="w-full border-amber-200 cursor-pointer">
                  <KeyRound className="h-4 w-4" />
                  <span>Login dengan Akun Lain</span>
              </Button>
            </LoginLink>
            </motion.div>
          </CardFooter>
        </Card>

        <motion.div className="mt-6 text-center text-sm text-gray-600" variants={itemVariants}>
          <p>
            Jika Anda percaya ini adalah kesalahan, silakan hubungi{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium text-amber-600 hover:text-amber-800 underline underline-offset-2"
            >
              support@example.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
