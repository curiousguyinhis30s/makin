"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sun, Moon, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import LanguageSwitcher from "@/components/molecules/LanguageSwitcher";
import { useDemo } from "@/lib/demo-context";

export default function Navbar() {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const { scrollY } = useScroll();
    const { theme, setTheme } = useTheme();
    const { isDemoMode, demoUser, disableDemoMode } = useDemo();

    // Check if user is authenticated via session or demo mode
    const isAuthenticated = session || isDemoMode;

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setIsScrolled(latest > 10);
    });

    const navLinks = [
        { name: t("nav.services"), href: "/#services" },
        { name: t("nav.about"), href: "/about" },
        { name: t("nav.pricing"), href: "/#pricing" },
        { name: t("nav.contact"), href: "/#contact" },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                ${isScrolled
                    ? "md:top-4 md:w-fit md:mx-auto md:rounded-full md:border md:border-border/40 md:bg-background/90 md:backdrop-blur-xl md:shadow-lg bg-background/95 backdrop-blur-md border-b border-border md:px-8"
                    : "md:top-4 md:w-fit md:mx-auto md:px-8 bg-background/60 backdrop-blur-md md:rounded-full md:border md:border-white/10"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-0">
                <div className="flex items-center justify-between h-14 md:h-16 gap-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                            <span className="text-lg font-bold text-primary-foreground">M</span>
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">Makin</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4 text-foreground" />
                            ) : (
                                <Moon className="w-4 h-4 text-foreground" />
                            )}
                        </button>
                        <LanguageSwitcher />

                        {isDemoMode && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-medium text-primary">Demo</span>
                            </div>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={isDemoMode && demoUser?.role === "ADMIN" ? "/admin" : "/dashboard"}
                                    className="btn-primary text-sm px-5 py-2.5 shadow-md hover:shadow-primary/20"
                                >
                                    {t("nav.dashboard")}
                                </Link>
                                <button
                                    onClick={() => {
                                        if (isDemoMode) {
                                            disableDemoMode();
                                        } else {
                                            signOut({ callbackUrl: "/" });
                                        }
                                    }}
                                    className="p-2.5 rounded-xl border border-border/50 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200"
                                    aria-label="Sign out"
                                    title={isDemoMode ? "Exit Demo Mode" : "Sign Out"}
                                >
                                    <LogOut className="w-4 h-4 text-foreground" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/register"
                                className="btn-primary text-sm px-5 py-2.5 shadow-md hover:shadow-primary/20"
                            >
                                {t("nav.getStarted")}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden bg-background border-b border-border"
                >
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 text-base font-medium text-foreground rounded-md hover:bg-accent"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="px-3 py-2 flex items-center gap-2">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2.5 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-4 h-4 text-foreground" />
                                ) : (
                                    <Moon className="w-4 h-4 text-foreground" />
                                )}
                            </button>
                            <LanguageSwitcher />
                        </div>
                        {isDemoMode && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg mt-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Demo Mode Active</span>
                            </div>
                        )}
                        {isAuthenticated ? (
                            <div className="space-y-2 mt-4">
                                <Link
                                    href={isDemoMode && demoUser?.role === "ADMIN" ? "/admin" : "/dashboard"}
                                    className="block w-full text-center px-4 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t("nav.dashboard")}
                                </Link>
                                <button
                                    onClick={() => {
                                        if (isDemoMode) {
                                            disableDemoMode();
                                        } else {
                                            signOut({ callbackUrl: "/" });
                                        }
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-center px-4 py-3 text-base font-semibold text-foreground bg-secondary rounded-lg hover:bg-secondary/80"
                                >
                                    {isDemoMode ? "Exit Demo Mode" : "Sign Out"}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/register"
                                className="block w-full text-center px-4 py-3 mt-4 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t("nav.getStarted")}
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
