"use client";

import { useSafeSession } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
    CreditCard,
    User,
    Shield,
    Plus,
    X,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Scale,
    TrendingUp,
    ArrowRight,
    Calendar,
    Building2,
    Zap,
    MessageSquare,
    Receipt,
    ChevronRight,
    Activity,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";

interface ServiceRequest {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    type: string;
    description: string;
}

const serviceTypeConfig: Record<string, { icon: typeof Shield; color: string; bgColor: string }> = {
    Government: { icon: Shield, color: "text-blue-600", bgColor: "bg-blue-500/10" },
    HR: { icon: User, color: "text-purple-600", bgColor: "bg-purple-500/10" },
    Legal: { icon: Scale, color: "text-emerald-600", bgColor: "bg-emerald-500/10" },
    Accounting: { icon: CreditCard, color: "text-orange-600", bgColor: "bg-orange-500/10" },
};

const quickActions = [
    { label: "New Request", icon: Plus, href: "#new-request", primary: true },
    { label: "AI Assistant", icon: MessageSquare, href: "/dashboard/ai/chat" },
    { label: "View Invoices", icon: Receipt, href: "/dashboard/billing" },
    { label: "Get Support", icon: Zap, href: "/dashboard/support" },
];

export default function CustomerDashboard() {
    const { data: session, status } = useSafeSession();
    const router = useRouter();
    const { t } = useLanguage();
    const { isDemoMode, demoUser, demoRequests, addDemoRequest, isInitialized } = useDemo();

    const [activeServices, setActiveServices] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ type: "HR", title: "", description: "" });

    const isAuthenticated = session || isDemoMode;
    const currentUser = isDemoMode ? demoUser : session?.user;

    // Calculate stats from requests
    const stats = useMemo(() => {
        const pending = activeServices.filter(s => s.status === "Pending").length;
        const inProgress = activeServices.filter(s => s.status === "In Progress").length;
        const completed = activeServices.filter(s => s.status === "Completed").length;
        return { total: activeServices.length, pending, inProgress, completed };
    }, [activeServices]);

    // Get time of day greeting
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    useEffect(() => {
        if (status === "loading" || !isInitialized) return;

        if (!isDemoMode && status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (isDemoMode) {
            setActiveServices(demoRequests.map(req => ({
                id: req.id,
                title: req.title,
                status: req.status,
                createdAt: req.createdAt,
                type: req.type,
                description: req.description
            })));
            setIsLoading(false);
        } else if (status === "authenticated") {
            fetchRequests();
        }
    }, [status, router, isDemoMode, demoRequests, isInitialized]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/requests");
            if (res.ok) {
                const data = await res.json();
                setActiveServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading" || isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDemoMode) {
            const newDemoRequest = {
                id: `req-demo-${Date.now()}`,
                title: newRequest.title || `${newRequest.type} Service Request`,
                type: newRequest.type,
                status: "Pending",
                createdAt: new Date().toISOString(),
                description: newRequest.description
            };
            addDemoRequest(newDemoRequest);
            setActiveServices([newDemoRequest, ...activeServices]);
            setIsRequestModalOpen(false);
            setNewRequest({ type: "HR", title: "", description: "" });
            return;
        }

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: newRequest.type,
                    title: newRequest.title || `${newRequest.type} Service Request`,
                    description: newRequest.description
                }),
            });

            if (res.ok) {
                const createdRequest = await res.json();
                setActiveServices([createdRequest, ...activeServices]);
                setIsRequestModalOpen(false);
                setNewRequest({ type: "HR", title: "", description: "" });
            }
        } catch (error) {
            console.error("Failed to create request", error);
        }
    };

    const handleQuickAction = (action: typeof quickActions[0]) => {
        if (action.href === "#new-request") {
            setIsRequestModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20 pt-6 sm:pt-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {isDemoMode && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-medium text-primary">
                                    <Sparkles className="w-3 h-3" />
                                    Demo Mode
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                            {greeting}, {currentUser?.name?.split(" ")[0] || "User"}
                        </h1>
                        <p className="text-muted-foreground">
                            Here's what's happening with your business services today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-muted-foreground">Today</p>
                            <p className="text-lg font-semibold text-foreground">
                                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Requests", value: stats.total, icon: FileText, color: "text-foreground", bgColor: "bg-secondary" },
                    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-500/10" },
                    { label: "In Progress", value: stats.inProgress, icon: Activity, color: "text-blue-600", bgColor: "bg-blue-500/10" },
                    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-500/10" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-2xl p-4 sm:p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            onClick={() => action.primary ? handleQuickAction(action) : null}
                            className={`group relative flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-2xl border transition-all ${
                                action.primary
                                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                            }`}
                        >
                            {action.primary ? (
                                <>
                                    <action.icon className="w-6 h-6" />
                                    <span className="text-sm font-medium">{action.label}</span>
                                </>
                            ) : (
                                <Link href={action.href} className="flex flex-col items-center gap-2 w-full">
                                    <action.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                                </Link>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
                            <Link
                                href="/dashboard/requests"
                                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {activeServices.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-foreground font-medium mb-1">No requests yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get started by creating your first service request.
                                </p>
                                <button
                                    onClick={() => setIsRequestModalOpen(true)}
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Request
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {activeServices.slice(0, 5).map((service, index) => {
                                    const typeConfig = serviceTypeConfig[service.type] || serviceTypeConfig.HR;
                                    const Icon = typeConfig.icon;

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={service.id}
                                            className="group p-4 hover:bg-secondary/30 transition-colors"
                                        >
                                            <Link href={`/dashboard/requests/${service.id}`} className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${typeConfig.bgColor} shrink-0`}>
                                                    <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                        {service.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                        <span>{service.type}</span>
                                                        <span>•</span>
                                                        <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                                                    service.status === "Completed"
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                        : service.status === "In Progress"
                                                        ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                                        : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                                                }`}>
                                                    {service.status}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                {currentUser?.name?.[0] || "U"}
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">{currentUser?.name}</h3>
                                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-3 bg-secondary/50 rounded-xl">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Plan
                                </span>
                                <span className="font-medium text-primary">
                                    {isDemoMode ? demoUser?.plan : "Professional"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-secondary/50 rounded-xl">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member Since
                                </span>
                                <span className="font-medium text-foreground">
                                    {isDemoMode && demoUser?.memberSince
                                        ? new Date(demoUser.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                                        : new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/profile"
                            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        >
                            View Profile
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Need Help Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 border border-border rounded-2xl p-5">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Need Assistance?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our team is ready to help with your business needs.
                            </p>
                            <Link
                                href="/dashboard/support"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                Contact Support
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            <AnimatePresence>
                {isRequestModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRequestModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-50 p-6 sm:p-8 mx-4"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">New Service Request</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Submit a new request and we'll get back to you shortly.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Service Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(serviceTypeConfig).map(([type, config]) => {
                                            const Icon = config.icon;
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewRequest({ ...newRequest, type })}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                        newRequest.type === type
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">{type}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newRequest.title}
                                        onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                        placeholder="e.g. Renew Commercial License"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        required
                                        value={newRequest.description}
                                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] text-sm resize-none"
                                        placeholder="Describe your request in detail..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsRequestModalOpen(false)}
                                        className="flex-1 py-3 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 btn-primary">
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
