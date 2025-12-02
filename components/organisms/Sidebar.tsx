"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    HelpCircle,
    User,
    Bot,
    FileEdit,
    MessageSquare,
    CreditCard,
    Bell,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Requests",
        href: "/dashboard/requests",
        icon: FileText,
    },
    {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
    },
];

const aiTools = [
    {
        title: "AI Chat",
        href: "/dashboard/ai/chat",
        icon: MessageSquare,
    },
    {
        title: "Resume Builder",
        href: "/dashboard/ai/resume",
        icon: FileEdit,
    },
    {
        title: "Documents",
        href: "/dashboard/ai/documents",
        icon: Bot,
    },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();

    return (
        <>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                            {item.title}
                        </Link>
                    );
                })}

                {/* AI Tools Section */}
                <div className="pt-4 mt-4 border-t border-border/50">
                    <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        AI Tools
                    </p>
                    {aiTools.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onItemClick}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>

                {/* Settings */}
                <div className="pt-4 mt-4 border-t border-border/50">
                    <Link
                        href="/dashboard/settings"
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            pathname === "/dashboard/settings"
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <Settings className={cn("w-5 h-5", pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground")} />
                        Settings
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-border/50 space-y-1">
                <Link
                    href="/dashboard/support"
                    onClick={onItemClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                >
                    <HelpCircle className="w-5 h-5" />
                    Support
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </>
    );
}

export default function Sidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                            <span>M</span>
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">Makin</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-foreground" />
                        ) : (
                            <Menu className="w-6 h-6 text-foreground" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            style={{ top: "60px" }}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="md:hidden fixed left-0 top-[60px] bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col"
                        >
                            <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card/50 backdrop-blur-xl">
                <div className="p-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:rotate-3 transition-transform shadow-lg shadow-primary/20">
                            <span>M</span>
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">Makin</span>
                    </Link>
                </div>

                <SidebarContent />
            </aside>
        </>
    );
}
