"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Loader2, ExternalLink } from "lucide-react";
import { useSafeSession } from "@/lib/use-auth";
import Link from "next/link";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link: string | null;
    read: boolean;
    createdAt: string;
}

const notificationTypeConfig: Record<string, { emoji: string; label: string }> = {
    REQUEST_UPDATE: { emoji: "📋", label: "Request Update" },
    PAYMENT: { emoji: "💳", label: "Payment" },
    AI_COMPLETE: { emoji: "🤖", label: "AI Complete" },
    DOCUMENT: { emoji: "📄", label: "Document" },
    MESSAGE: { emoji: "💬", label: "Message" },
    SYSTEM: { emoji: "🔔", label: "System" },
};

export function NotificationBell() {
    const { data: session } = useSafeSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === "Escape") {
            setIsOpen(false);
            buttonRef.current?.focus();
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/notifications?limit=10");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: "POST" });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        setIsMarkingAll(true);
        try {
            await Promise.all(
                notifications.filter((n) => !n.read).map((n) => markAsRead(n.id))
            );
        } finally {
            setIsMarkingAll(false);
        }
    };

    const getTypeConfig = (type: string) => {
        return notificationTypeConfig[type] || notificationTypeConfig.SYSTEM;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-secondary rounded-lg relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Bell className="w-5 h-5" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span
                        className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center"
                        aria-hidden="true"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="notifications-menu"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground" id="notifications-menu">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={isMarkingAll}
                                    className="text-xs text-primary hover:underline disabled:opacity-50 focus:outline-none focus:underline"
                                    aria-label="Mark all notifications as read"
                                >
                                    {isMarkingAll ? (
                                        <span className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Marking...
                                        </span>
                                    ) : (
                                        "Mark all as read"
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-96 overflow-y-auto" role="list">
                            {isLoading ? (
                                <div className="p-8 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-6 h-6 text-muted-foreground/50" aria-hidden="true" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        We&apos;ll notify you when something happens
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification, index) => {
                                    const config = getTypeConfig(notification.type);
                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${
                                                !notification.read ? "bg-primary/5" : ""
                                            }`}
                                            role="listitem"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span
                                                    className="text-xl flex-shrink-0"
                                                    role="img"
                                                    aria-label={config.label}
                                                >
                                                    {config.emoji}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="font-medium text-sm text-foreground truncate">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                aria-label={`Mark "${notification.title}" as read`}
                                                            >
                                                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <time
                                                            className="text-xs text-muted-foreground"
                                                            dateTime={notification.createdAt}
                                                        >
                                                            {formatTime(notification.createdAt)}
                                                        </time>
                                                        {notification.link && (
                                                            <Link
                                                                href={notification.link}
                                                                className="text-xs text-primary hover:underline flex items-center gap-1 focus:outline-none focus:underline"
                                                                onClick={() => {
                                                                    if (!notification.read) {
                                                                        markAsRead(notification.id);
                                                                    }
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                View
                                                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-border bg-secondary/20">
                                <Link
                                    href="/dashboard/notifications"
                                    className="block text-center text-sm text-primary hover:underline focus:outline-none focus:underline py-1"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all notifications
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
