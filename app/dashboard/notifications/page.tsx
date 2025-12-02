"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  Filter,
  CreditCard,
  FileText,
  Bot,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=50");
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
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    await Promise.all(unreadIds.map((id) => markAsRead(id)));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "REQUEST_UPDATE":
        return <FileText className="w-5 h-5" />;
      case "PAYMENT":
        return <CreditCard className="w-5 h-5" />;
      case "AI_COMPLETE":
        return <Bot className="w-5 h-5" />;
      case "MESSAGE":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REQUEST_UPDATE":
        return "bg-blue-500/10 text-blue-600";
      case "PAYMENT":
        return "bg-green-500/10 text-green-600";
      case "AI_COMPLETE":
        return "bg-purple-500/10 text-purple-600";
      case "MESSAGE":
        return "bg-orange-500/10 text-orange-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.read) return false;
    if (selectedType && n.type !== selectedType) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationTypes = Array.from(
    new Set(notifications.map((n) => n.type))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated on your requests and account activity
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            Unread ({unreadCount})
          </button>

          <div className="h-8 w-px bg-border mx-2" />

          {notificationTypes.map((type) => (
            <button
              key={type}
              onClick={() =>
                setSelectedType(selectedType === type ? null : type)
              }
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedType === type
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {getTypeIcon(type)}
              {type.replace(/_/g, " ").toLowerCase()}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-medium mb-1">
                No notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                {filter === "unread"
                  ? "You've read all your notifications"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className={`font-medium ${
                              !notification.read
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Empty state when no notifications at all */}
        {notifications.length === 0 && !isLoading && (
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">
              Stay informed
            </h3>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications about your service requests, payments,
              and important updates here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
