"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingModal({ isOpen, message = "Memproses permintaan..." }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-xl"
      >
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          
          {/* Spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-gray-800 border-r-gray-800 border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center icon */}
          <div className="flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-8 w-8 text-gray-800" />
          </div>
        </div>
        
        <motion.p 
          className="mt-6 text-center text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
        
        <motion.div 
          className="mt-4 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gray-400"
              animate={{ 
                y: ["0%", "-50%", "0%"],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut" 
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 