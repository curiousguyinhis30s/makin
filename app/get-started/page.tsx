"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Shield, Sparkles, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";

export default function GetStartedPage() {
    const router = useRouter();
    const { enableDemoMode } = useDemo();

    const handleDemoUser = async () => {
        await enableDemoMode("USER");
        router.push("/dashboard");
    };

    const handleDemoAdmin = async () => {
        await enableDemoMode("ADMIN");
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Get Started with Makin
                        </h1>
                        <p className="text-muted-foreground">
                            Choose how you'd like to explore our platform
                        </p>
                    </div>

                    {/* Demo Mode Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Try Demo (No Sign Up Required)
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleDemoUser}
                                className="group flex flex-col items-center gap-3 p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl hover:border-primary hover:bg-primary/10 transition-all"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <User className="w-7 h-7 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-foreground">Demo User</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Explore client dashboard
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={handleDemoAdmin}
                                className="group flex flex-col items-center gap-3 p-6 bg-secondary/50 border-2 border-border rounded-2xl hover:border-primary hover:bg-secondary transition-all"
                            >
                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Shield className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-foreground">Demo Admin</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Explore admin portal
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Or Create an Account
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/register"
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                <UserPlus className="w-5 h-5" />
                                Create New Account
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </Link>

                            <Link
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-secondary text-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors border border-border"
                            >
                                <Mail className="w-5 h-5" />
                                Sign In with Email
                                <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                            </Link>
                        </div>
                    </div>

                    {/* Info */}
                    <p className="text-xs text-center text-muted-foreground mt-6">
                        Demo mode lets you explore all features without creating an account.
                        Your data won't be saved after you close the browser.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
