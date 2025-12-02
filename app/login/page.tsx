"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, User, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const { t, direction } = useLanguage();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(t("login.error"));
                setLoading(false);
            } else {
                // Get session to check user role for proper redirect
                const session = await getSession();
                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push(callbackUrl);
                }
            }
        } catch (err) {
            setError(t("login.errorGeneric"));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={direction}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" />
                        {t("login.backToHome")}
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        {t("login.title")}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("login.subtitle")}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                {t("login.email")}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                {t("login.password")}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEmail("demo@makin.sa");
                                setPassword("Demo@123!");
                            }}
                            className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                        >
                            <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t("login.demoUser")}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEmail("admin@makin.sa");
                                setPassword("Admin@123!");
                            }}
                            className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                        >
                            <Shield className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t("login.demoAdmin")}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            t("login.signIn")
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    {t("login.noAccount")}{" "}
                    <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        {t("login.signUp")}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
