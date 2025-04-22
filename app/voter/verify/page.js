"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Copy,
  CheckCheck,
  Loader2,
  Info,
  RefreshCw,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Interactive waveform animation for the verification process
const WaveformAnimation = ({ animating }) => {
  return (
    <div className="my-4 flex items-center justify-center gap-1">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="h-8 w-1 bg-primary rounded-full"
          initial={{ height: 12 }}
          animate={{
            height: animating ? [12, 24, 12] : 12,
            opacity: animating ? 1 : 0.4,
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            repeat: animating ? Infinity : 0,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Vote verification result component
const VerificationResult = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Disalin ke clipboard", {
      description: "Informasi kode verifikasi telah disalin",
      duration: 3000,
    });
  };

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card
        className={cn(
          "border-2 shadow-lg overflow-hidden",
          result.verified
            ? "border-green-200 max-w-2xl mx-auto dark:border-green-900 bg-green-50/30 dark:bg-green-900/10"
            : "border-red-200 max-w-2xl mx-auto dark:border-red-900 bg-red-50/30 dark:bg-red-900/10"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge
              variant={result.verified ? "success" : "destructive"}
              className="mb-2"
            >
              {result.verified ? "Terverifikasi" : "Tidak Ditemukan"}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </Button>
          </div>

          <CardTitle className="text-xl flex items-center gap-2">
            {result.verified ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            {result.verified ? "Suara Anda Valid" : "Suara Tidak Ditemukan"}
          </CardTitle>

          <CardDescription>
            {result.verified
              ? "Suara Anda telah tercatat dalam sistem."
              : "Kode verifikasi tidak ditemukan dalam sistem."}
          </CardDescription>
        </CardHeader>

        {result.verified && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3 relative">
                <div className="text-xs text-muted-foreground mb-1">
                  Kode Verifikasi:
                </div>
                <div className="flex items-center gap-2 group">
                  <code className="text-xs sm:text-sm font-mono break-all bg-background/80 p-2 rounded border border-border/50 flex-1">
                    {result.voteHash}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(result.voteHash)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Pemilihan:
                  </div>
                  <div className="text-sm font-medium">
                    {result.electionTitle}
                  </div>
                </div>

                <div className="rounded-md bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Waktu Vote:
                  </div>
                  <div className="text-sm font-medium">{result.timestamp}</div>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Kandidat Pilihan:
                </div>
                <div className="text-sm font-medium">{result.candidate}</div>
              </div>

              {/* Verification Details Section */}
              {result.verificationDetails && (
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Detail Verifikasi:
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Metode Enkripsi:
                        </span>
                        <div className="text-sm font-medium">
                          {result.verificationDetails.method}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Algoritma Hash:
                        </span>
                        <div className="text-sm font-medium">
                          {result.verificationDetails.hashAlgorithm}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Waktu Verifikasi:
                      </span>
                      <div className="text-sm font-medium">
                        {result.verificationDetails.verificationTime}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Kerahasiaan Suara Terjamin</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Sistem ini hanya menampilkan bahwa suara Anda tercatat, tanpa
                mengungkapkan identitas Anda.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter
          className={cn(
            "flex flex-col sm:flex-row gap-2 pt-2 pb-4 px-6",
            !result.verified && "justify-center"
          )}
        >
          {result.verified ? (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 border-primary/20 hover:border-primary/40"
              >
                <Share2 className="h-4 w-4" /> Bagikan Hasil
              </Button>
              <Button variant="default" className="w-full sm:w-auto gap-2">
                Lihat Status Pemilihan
              </Button>
            </>
          ) : (
            <Button variant="secondary" className="gap-2" onClick={onReset}>
              Coba Lagi
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const VerifyVotePage = () => {
  const router = useRouter();
  const [voteHash, setVoteHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState("");

  // Function to format ISO timestamp to a more readable format
  const formatTimestamp = (isoTimestamp) => {
    try {
      const date = new Date(isoTimestamp);
      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return isoTimestamp; // Return original if parsing fails
    }
  };

  // Verify vote using the API
  const verifyVote = async () => {
    setError("");
    setVerifying(true);

    try {
      const response = await fetch("/api/vote/verifyVoteByHash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteHash }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to verify vote");
        setVerificationResult({
          verified: false,
        });
      } else {
        setVerificationResult({
          verified: true,
          voteHash: voteHash,
          electionId: result.data.electionId,
          electionTitle: result.data.electionTitle,
          timestamp: formatTimestamp(result.data.timestamp),
          candidate: result.data.candidate
            ? result.data.candidate.name
            : "Unknown",
          verificationDetails: {
            method: result.data.verificationDetails.method,
            hashAlgorithm: result.data.verificationDetails.hashAlgorithm,
            verificationTime: formatTimestamp(
              result.data.verificationDetails.verificationTime
            ),
          },
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred while verifying your vote");
      setVerificationResult({
        verified: false,
      });
    } finally {
      setVerifying(false);
    }
  };

  const resetForm = () => {
    setVoteHash("");
    setVerificationResult(null);
    setError("");
  };

  // Track animation state
  const isAnimating = verifying;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative bg-gradient-to-b from-background to-background/80">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-primary/20 to-transparent" />
      <div className="absolute top-1/3 -left-32 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-7xl z-10"
      >
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

          <Badge
            variant="outline"
            className="px-3 py-1 border-primary/20 text-xs"
          >
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Verifikasi Suara Anda
          </motion.h1>

          <motion.p
            className="text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Lihat dan pastikan suara Anda telah masuk ke kandidat yang benar dan
            dihitung secara sah dalam sistem pemilu digital kami. Transparan,
            aman, dan dapat dibuktikan.
          </motion.p>
        </motion.div>

        {!verificationResult ? (
          <Card className="backdrop-blur-sm max-w-2xl mx-auto bg-card/80 shadow-xl border border-border/40">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Masukkan Hash Verifikasi
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hash ini diberikan setelah Anda berhasil melakukan voting
                    sebagai bukti bahwa suara Anda telah tercatat.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Masukkan kode verifikasi suara Anda"
                        value={voteHash}
                        onChange={(e) => setVoteHash(e.target.value)}
                        className="font-mono bg-background/60 border border-muted-foreground/20 focus:border-primary/50 placeholder:text-muted-foreground/50"
                        disabled={verifying}
                      />
                      {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>

                    <div className="flex justify-center">
                      {isAnimating ? (
                        <WaveformAnimation animating={isAnimating} />
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={verifyVote}
                                disabled={!voteHash || verifying}
                                className="w-full py-6 relative overflow-hidden group"
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                                  initial={{ x: "-100%" }}
                                  animate={{ x: ["100%", "-100%"] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "linear",
                                    repeatDelay: 0.5,
                                  }}
                                />
                                <span className="flex items-center gap-2 z-10 relative">
                                  <Search className="h-5 w-5" />
                                  Verifikasi
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cek keabsahan suara Anda</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {verifying && (
                <div className="text-center mt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi suara...
                  </motion.div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col pb-6">
              <Separator className="mb-4" />
              <div className="text-xs text-muted-foreground text-center">
                Diperlukan bantuan?{" "}
                <a
                  href="#"
                  className="text-primary underline underline-offset-2"
                >
                  Hubungi dukungan teknis
                </a>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <VerificationResult result={verificationResult} onReset={resetForm} />
        )}

        <div className="mt-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-block rounded-full bg-muted/30 backdrop-blur-sm py-1 px-3 text-xs text-muted-foreground"
          >
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyVotePage;

