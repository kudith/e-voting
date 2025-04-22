"use client";

import { motion } from "framer-motion";
import { Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SuccessPage({ voteHash }) {
  const router = useRouter();

  const handleCopyHash = () => {
    navigator.clipboard.writeText(voteHash);
    toast.success("Hash berhasil disalin ke clipboard");
  };

  const handleVerifyVote = () => {
    router.push("/voter/verify");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-10 h-10 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Terima kasih! Suara Anda telah dikirim.
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Berikut adalah hash unik untuk verifikasi suara Anda:
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
              {voteHash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyHash}
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleVerifyVote}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Verifikasi Suara Saya
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 