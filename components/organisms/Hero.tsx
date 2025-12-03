"use client";

import { motion, useMotionValue, useTransform, animate, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const animation = animate(count, value, { duration: 2, ease: "easeOut" });
        const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
        return () => {
            animation.stop();
            unsubscribe();
        };
    }, [count, rounded, value]);

    return <span>{displayValue}{suffix}</span>;
}

// Floating particle component
function FloatingParticle({ delay, duration, x, y, size }: { delay: number; duration: number; x: string; y: string; size: number }) {
    return (
        <motion.div
            className="absolute rounded-full bg-primary/30"
            style={{ left: x, top: y, width: size, height: size }}
            animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

export default function Hero() {
    const { t, direction } = useLanguage();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const floatingVariants: Variants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
            },
        },
    };

    return (
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-background min-h-[90vh] flex items-center justify-center" dir={direction}>
            {/* Animated Background Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/20 rounded-full blur-[100px] md:blur-[120px]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-[-30%] left-[-15%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        x: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-[10%] right-[-15%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                <FloatingParticle delay={0} duration={4} x="10%" y="20%" size={8} />
                <FloatingParticle delay={0.5} duration={5} x="85%" y="15%" size={6} />
                <FloatingParticle delay={1} duration={4.5} x="20%" y="70%" size={10} />
                <FloatingParticle delay={1.5} duration={3.5} x="75%" y="60%" size={8} />
                <FloatingParticle delay={2} duration={5} x="50%" y="80%" size={6} />
                <FloatingParticle delay={0.8} duration={4} x="90%" y="40%" size={4} />
                <FloatingParticle delay={1.2} duration={4.5} x="5%" y="50%" size={6} />
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="space-y-6 md:space-y-8">
                        {/* Badge */}
                        <motion.div variants={itemVariants} className="flex justify-center">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-foreground backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                {t("hero.badge")}
                                <motion.span
                                    className="w-2 h-2 rounded-full bg-primary"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {t("hero.title")}
                            </motion.span>
                            <motion.span
                                className="block mt-2 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <span className="text-primary relative inline-block">
                                    {t("hero.titleHighlight")}
                                    <motion.span
                                        className="absolute -bottom-2 left-0 w-full h-1 bg-primary/50 rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: 1 }}
                                    />
                                </span>
                            </motion.span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
                        >
                            {t("hero.subtitle")}
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-6 md:gap-12 py-4 md:py-6"
                        >
                            {[
                                { value: 500, suffix: "+", label: "Clients" },
                                { value: 98, suffix: "%", label: "Satisfaction" },
                                { value: 10, suffix: "+", label: "Years" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    variants={floatingVariants}
                                    animate="animate"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="text-2xl md:text-4xl font-bold text-primary">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4 justify-center items-center px-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/get-started"
                                    className="btn-primary text-center text-base md:text-lg px-8 py-3 md:px-10 md:py-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 w-full sm:w-auto min-w-[200px] group inline-flex items-center justify-center gap-2 relative overflow-hidden"
                                >
                                    <span className="relative z-10">{t("hero.cta")}</span>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "0%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="#services"
                                    className="btn-outline text-center text-base md:text-lg px-8 py-3 md:px-10 md:py-4 bg-background/50 backdrop-blur-sm hover:bg-background/80 w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center border-foreground/20 hover:border-primary/50 transition-colors"
                                >
                                    {t("hero.secondaryCta")}
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            className="pt-8 md:pt-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <motion.div
                                className="w-6 h-10 border-2 border-foreground/20 rounded-full mx-auto flex items-start justify-center p-1"
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.div
                                    className="w-1.5 h-2.5 bg-primary rounded-full"
                                    animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
