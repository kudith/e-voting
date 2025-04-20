import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Shield, HelpCircle, FileText, Heart } from "lucide-react";

export default function Footer() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <motion.footer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 pt-8 pb-6 border-t bg-gradient-to-b from-background to-background/50"
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Keamanan</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Suara Anda dilindungi oleh teknologi Merkle tree dan zero-knowledge proofs, memastikan transparansi dan keamanan yang lengkap selama proses pemilihan.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Privasi</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Kami berkomitmen untuk melindungi privasi Anda dan memastikan bahwa informasi pribadi Anda tetap aman dan rahasia.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                                <HelpCircle className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Dukungan</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Tim dukungan kami yang berdedikasi tersedia 24/7 untuk membantu Anda dengan pertanyaan atau kekhawatiran tentang proses pemungutan suara.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 border-t border-border"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10">
                            <Heart className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                            Made with love for democracy
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm h-auto p-0 transition-colors hover:text-primary"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Privacy Policy
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm h-auto p-0 transition-colors hover:text-primary"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Terms of Service
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm h-auto p-0 transition-colors hover:text-primary"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help Center
                        </Button>
                    </div>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-4 text-center"
                >
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} SiPilih. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
}