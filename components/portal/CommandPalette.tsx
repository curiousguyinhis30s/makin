"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    FileText,
    Home,
    User,
    Bell,
    CreditCard,
    MessageSquare,
    Sparkles,
    Settings,
    HelpCircle,
    Plus,
    Command,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

interface CommandItem {
    id: string;
    label: string;
    icon: typeof Home;
    href?: string;
    action?: () => void;
    category: string;
    shortcut?: string;
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { t } = useLanguage();

    const commands: CommandItem[] = [
        // Navigation
        { id: "home", label: "Dashboard", icon: Home, href: "/dashboard", category: "Navigation", shortcut: "G D" },
        { id: "requests", label: "My Requests", icon: FileText, href: "/dashboard/requests", category: "Navigation", shortcut: "G R" },
        { id: "profile", label: "Profile & Settings", icon: User, href: "/dashboard/profile", category: "Navigation", shortcut: "G P" },
        { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/notifications", category: "Navigation", shortcut: "G N" },
        { id: "billing", label: "Billing & Invoices", icon: CreditCard, href: "/dashboard/billing", category: "Navigation", shortcut: "G B" },

        // AI Tools
        { id: "ai-chat", label: "AI Chat Assistant", icon: MessageSquare, href: "/dashboard/ai/chat", category: "AI Tools" },
        { id: "ai-resume", label: "Resume Builder", icon: Sparkles, href: "/dashboard/ai/resume", category: "AI Tools" },
        { id: "ai-docs", label: "Document Generator", icon: FileText, href: "/dashboard/ai/documents", category: "AI Tools" },

        // Quick Actions
        { id: "new-request", label: "Create New Request", icon: Plus, category: "Quick Actions", action: () => {
            router.push("/dashboard?action=new-request");
        }},
        { id: "help", label: "Help & Support", icon: HelpCircle, href: "/#contact", category: "Quick Actions" },
    ];

    const filteredCommands = query === ""
        ? commands
        : commands.filter((command) =>
            command.label.toLowerCase().includes(query.toLowerCase()) ||
            command.category.toLowerCase().includes(query.toLowerCase())
        );

    const groupedCommands = filteredCommands.reduce((acc, command) => {
        if (!acc[command.category]) {
            acc[command.category] = [];
        }
        acc[command.category].push(command);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const flatCommands = Object.values(groupedCommands).flat();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
            return;
        }

        if (!isOpen) return;

        switch (e.key) {
            case "Escape":
                setIsOpen(false);
                setQuery("");
                setSelectedIndex(0);
                break;
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
                break;
            case "Enter":
                e.preventDefault();
                const selected = flatCommands[selectedIndex];
                if (selected) {
                    executeCommand(selected);
                }
                break;
        }
    }, [isOpen, flatCommands, selectedIndex]);

    const executeCommand = (command: CommandItem) => {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);

        if (command.action) {
            command.action();
        } else if (command.href) {
            router.push(command.href);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <>
            {/* Trigger button for mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
                aria-label="Open command palette"
            >
                <Search className="w-4 h-4" />
                <span>Search...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-background border border-border rounded">
                    <Command className="w-3 h-3" />K
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                            aria-hidden="true"
                        />

                        {/* Command Palette */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.15 }}
                            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                            role="dialog"
                            aria-label="Command palette"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                <Search className="w-5 h-5 text-muted-foreground" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search commands..."
                                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                                />
                                <kbd className="px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto py-2">
                                {flatCommands.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-muted-foreground">
                                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No commands found</p>
                                    </div>
                                ) : (
                                    Object.entries(groupedCommands).map(([category, items]) => (
                                        <div key={category}>
                                            <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {category}
                                            </div>
                                            {items.map((command) => {
                                                const globalIndex = flatCommands.findIndex((c) => c.id === command.id);
                                                const isSelected = globalIndex === selectedIndex;

                                                return (
                                                    <button
                                                        key={command.id}
                                                        onClick={() => executeCommand(command)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                            isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                                                        }`}
                                                    >
                                                        <command.icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                                        <span className="flex-1">{command.label}</span>
                                                        {command.shortcut && (
                                                            <kbd className="px-1.5 py-0.5 text-xs font-mono text-muted-foreground bg-secondary rounded">
                                                                {command.shortcut}
                                                            </kbd>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30 text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-background border border-border rounded">↑</kbd>
                                        <kbd className="px-1 py-0.5 bg-background border border-border rounded">↓</kbd>
                                        navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-background border border-border rounded">↵</kbd>
                                        select
                                    </span>
                                </div>
                                <span>Makin Quick Actions</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
