"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";

export default function Hero() {
    const { t, direction } = useLanguage();

    return (
        <section className="relative pt-40 pb-32 overflow-hidden bg-background min-h-[90vh] flex items-center justify-center" dir={direction}>
            {/* Nano Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-secondary/5 border border-border/50 text-xs md:text-sm font-medium text-muted-foreground mx-auto backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(185,255,102,0.5)]" />
                            Premier Business Solutions in KSA
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
                            {t("hero.title")}
                            <span className="block text-primary nano-gradient-text mt-2">
                                {t("hero.titleHighlight")}
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                            {t("hero.subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-8 justify-center items-center px-4">
                            <Link
                                href="/register"
                                className="btn-primary text-center text-base md:text-lg px-8 py-3 md:px-10 md:py-4 shadow-xl shadow-primary/10 hover:shadow-primary/30 w-full sm:w-auto min-w-[200px] group"
                            >
                                {t("hero.cta")}
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#services"
                                className="btn-outline text-center text-base md:text-lg px-8 py-3 md:px-10 md:py-4 bg-background/50 backdrop-blur-sm hover:bg-background w-full sm:w-auto min-w-[200px]"
                            >
                                {t("hero.secondaryCta")}
                            </Link>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section >
    );
}
