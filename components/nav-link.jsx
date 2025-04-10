"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function NavLink({ href, label, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Link href={href} className="relative group">
        <span className="text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary transition-colors">
          {label}
        </span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  )
}

