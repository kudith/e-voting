"use client";

import { motion } from "framer-motion";
import { Copy, Search, Home, CheckCircle, AlertTriangle, ArrowLeft, VerifiedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SuccessPage({ voteHash }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(voteHash);
    toast.success("Hash berhasil disalin ke clipboard");
    setCopied(true);

    // Reset copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifyVote = () => {
    router.push("/voter/verify");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation Bar at Top */}
      <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/voter/dashboard")}
            className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>

          <Button
          size="sm"
          onClick={handleBackToHome}
          className="gap-2 transition-colors cursor-pointer"
          >
            <VerifiedIcon className="h-4 w-4" />
            <span>Verifikasi Suara</span>
          </Button>
        </div>
      <div className="max-w-2xl mx-auto mb-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-primary/30">
            <CardHeader className="pb-0 pt-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-400">
                Suara Berhasil Tercatat
              </h1>
              <p className="text-muted-foreground">
                Terima kasih telah berpartisipasi dalam pemilihan ini
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 pb-6">
              <Alert
                variant="destructive"
                className="mb-6 border border-destructive/30 bg-destructive/10"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Penting!</AlertTitle>
                <AlertDescription className="text-sm">
                  Mohon salin dan simpan hash verifikasi suara anda. Hash ini bersifat unik dan tidak dapat diakses kembali setelah meninggalkan halaman ini. 
                  Tanpa hash ini, anda tidak bisa memverifikasi suara anda.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Hash Verifikasi Suara:</h3>
                  <Button
                    variant={copied ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleCopyHash}
                    className="flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Disalin!" : "Salin Hash"}
                  </Button>
                </div>

                <div className="bg-muted rounded-lg p-4 relative">
                  <code className="text-sm break-all text-muted-foreground block">
                    {voteHash}
                  </code>
                </div>
                <Separator className="my-4" />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleVerifyVote}
                  className="w-full flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Verifikasi Suara
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
