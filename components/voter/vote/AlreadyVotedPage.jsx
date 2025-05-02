import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Simple particle component using framer motion
const Particle = ({ index }) => {
  const randomX = Math.random() * 100 - 50;
  const randomY = Math.random() * 100 - 50;
  const size = Math.random() * 4 + 1;
  const duration = Math.random() * 10 + 15;
  const delay = Math.random() * 5;
  const opacity = Math.random() * 0.5 + 0.1;
  const colors = ["#22c55e", "#6366f1", "#8b5cf6", "#06b6d4"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      initial={{
        opacity: 0,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: [0, opacity, 0],
        x: [0, randomX],
        y: [0, randomY],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
};

// Particle field component
const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, index) => (
        <Particle key={index} index={index} />
      ))}
    </div>
  );
};

// Success Confetti effect
const SuccessConfetti = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#22c55e', '#6366f1', '#8b5cf6', '#06b6d4'];
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 1,
        rotationSpeed: (Math.random() - 0.5) * 2,
        lifetime: Math.random() * 100 + 100
      });
    }
    
    // Animation loop
    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiPieces.forEach((piece, index) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
        
        piece.y += piece.speed;
        piece.rotation += piece.rotationSpeed;
        piece.lifetime -= 1;
        
        if (piece.lifetime <= 0 && confettiPieces.length > 0) {
          confettiPieces.splice(index, 1);
        }
      });
      
      if (confettiPieces.length > 0) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
  );
};

export const AlreadyVotedPage = ({ voteHash, electionTitle }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    if (voteHash) {
      navigator.clipboard.writeText(voteHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative bg-gradient-to-b from-background/80 to-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <ParticleField />
      <SuccessConfetti />
      
      {/* Gradient background blur effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl w-full z-10"
      >
        <Card className="p-8 md:p-12 shadow-xl border border-border/40 rounded-xl backdrop-blur-sm bg-card/80">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.7,
                type: "spring",
                stiffness: 200
              }}
              className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 mb-8 shadow-lg shadow-green-500/10 dark:shadow-green-900/30"
            >
              <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-4"
            >
              Anda Telah Memberikan Suara
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Terima kasih telah berpartisipasi dalam pemilu <span className="font-bold text-primary">{electionTitle}</span>. Suara Anda telah tercatat dalam sistem.
            </motion.p>
            
            {voteHash && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="mb-10 bg-muted/50 dark:bg-muted/10 p-6 rounded-xl border border-border/50 shadow-inner relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Kode Verifikasi Suara Anda:
                </p>
                
                <div className="flex items-center justify-center space-x-3">
                  <code className="px-5 py-3 bg-background/80 dark:bg-background/30 rounded-md text-sm font-mono break-all border border-border/50 shadow-sm max-w-full overflow-x-auto">
                    {voteHash}
                  </code>
                  
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    className={cn(
                      "h-10 w-10 rounded-md transition-all duration-300 hover:bg-muted",
                      copied && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    )}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3">
                  Simpan kode ini untuk memverifikasi suara Anda nanti
                </p>
                
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
                <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-l from-primary/40 via-primary/10 to-transparent" />
              </motion.div>
            )}
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                onClick={() => router.push("/voter/dashboard")}
                variant="default"
                className="cursor-pointer px-6 py-6 text-base font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                Kembali ke Dashboard
              </Button>
              
              <Button 
                onClick={() => router.push("/voter/verify")}
                variant="outline"
                className="flex items-center gap-2 cursor-pointer px-6 py-6 text-base font-medium shadow-lg hover:shadow-md transition-all duration-300 group"
              >
                Verifikasi Suara
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                  className="group-hover:text-primary"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground backdrop-blur-sm p-2 rounded-lg">
            Jika Anda memiliki pertanyaan, silakan hubungi panitia pemilu.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};