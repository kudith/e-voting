"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label, delay = 0, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href && !href.startsWith("#");

  // Check if this is a section link (starts with #)
  const isSectionLink = href.startsWith("#");

  const handleClick = (e) => {
    if (isSectionLink) {
      e.preventDefault();

      // Extract the section ID without the #
      const sectionId = href.substring(1);
      const element = document.getElementById(sectionId);

      if (element) {
        // Scroll to the element smoothly
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    // Call any additional onClick handler if provided
    if (onClick) onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <Link href={href} className="relative inline-block" onClick={handleClick}>
        <span className="text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 relative z-10">
          {label}
        </span>
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/80 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.span
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        />
        <motion.div className="absolute inset-0 bg-primary/5 rounded-md scale-0 group-hover:scale-100 origin-center transition-transform duration-300" />
      </Link>
    </motion.div>
  );
}
