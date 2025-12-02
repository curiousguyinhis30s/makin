"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Download, Mail, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

function SuccessContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "Professional";
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ["#B9FF66", "#191A23", "#ffffff"],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ["#B9FF66", "#191A23", "#ffffff"],
            });
        }, 250);

        setTimeout(() => setShowContent(true), 500);

        return () => clearInterval(interval);
    }, []);

    const nextSteps = [
        {
            icon: Mail,
            title: "Check Your Email",
            description: "We've sent your account details and welcome guide to your email.",
        },
        {
            icon: Calendar,
            title: "Schedule Onboarding",
            description: "Book a 30-minute call with your dedicated account manager.",
        },
        {
            icon: Download,
            title: "Access Dashboard",
            description: "Start managing your business operations right away.",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30"
                    >
                        <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Payment Successful
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Welcome to Makin!
                        </h1>

                        <p className="text-xl text-muted-foreground mb-2">
                            Your {plan} plan is now active.
                        </p>
                        <p className="text-muted-foreground">
                            Order #MKN-{Date.now().toString().slice(-8)}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-3xl p-8 mb-8"
                >
                    <h2 className="text-lg font-bold text-foreground mb-6">What's Next?</h2>
                    <div className="space-y-6">
                        {nextSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <step.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/dashboard"
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/"
                        className="btn-outline inline-flex items-center justify-center"
                    >
                        Back to Home
                    </Link>
                </motion.div>

                {/* Support Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContent ? 1 : 0 }}
                    transition={{ delay: 1 }}
                    className="text-center text-sm text-muted-foreground mt-8"
                >
                    Need help? Contact us at{" "}
                    <a href="mailto:support@makin.sa" className="text-primary hover:underline">
                        support@makin.sa
                    </a>
                </motion.p>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
