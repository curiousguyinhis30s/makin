"use client";

import { useSafeSession } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    FileText,
    TrendingUp,
    Check,
    X,
    Search,
    Clock,
    Sparkles,
    Menu,
    Home,
    BarChart3,
    Shield,
    ChevronRight,
    Loader2,
    DollarSign,
    UserPlus,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Settings,
    Activity,
    Calendar,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { getStatusClasses, getServiceTypeClasses } from "@/lib/status-colors";

interface ServiceRequest {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    type: string;
    user: {
        name: string;
        email: string;
    };
}

const DEMO_ADMIN_REQUESTS: ServiceRequest[] = [
    {
        id: "admin-req-001",
        title: "Commercial License Renewal",
        status: "Pending",
        createdAt: "2024-01-15T10:30:00Z",
        type: "Government",
        user: { name: "Ahmed Al-Rashid", email: "ahmed@company.sa" }
    },
    {
        id: "admin-req-002",
        title: "Employee Visa Processing",
        status: "In Progress",
        createdAt: "2024-01-14T14:20:00Z",
        type: "HR",
        user: { name: "Fatima Al-Hassan", email: "fatima@startup.sa" }
    },
    {
        id: "admin-req-003",
        title: "Quarterly Tax Filing",
        status: "Completed",
        createdAt: "2024-01-12T09:15:00Z",
        type: "Accounting",
        user: { name: "Omar Trading Co.", email: "finance@omar-trading.sa" }
    },
    {
        id: "admin-req-004",
        title: "Contract Review - Partnership Agreement",
        status: "Pending",
        createdAt: "2024-01-16T11:45:00Z",
        type: "Legal",
        user: { name: "Saudi Tech Solutions", email: "legal@sauditech.sa" }
    },
    {
        id: "admin-req-005",
        title: "Nitaqat Compliance Review",
        status: "In Progress",
        createdAt: "2024-01-13T16:00:00Z",
        type: "Government",
        user: { name: "Riyadh Consulting", email: "hr@riyadhconsulting.sa" }
    }
];

const navItems = [
    { label: "Dashboard", icon: Home, href: "/admin", active: true },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Requests", icon: FileText, href: "/admin/requests" },
    { label: "Services", icon: Settings, href: "/admin/services" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Roles", icon: Shield, href: "/admin/roles" },
];

const quickActions = [
    { label: "View All Requests", icon: FileText, href: "/admin/requests", color: "bg-blue-500/10 text-blue-600" },
    { label: "Manage Users", icon: Users, href: "/admin/users", color: "bg-purple-500/10 text-purple-600" },
    { label: "View Analytics", icon: BarChart3, href: "/admin/analytics", color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Settings", icon: Settings, href: "/admin/settings", color: "bg-orange-500/10 text-orange-600" },
];

export default function AdminDashboard() {
    const { data: session, status } = useSafeSession();
    const router = useRouter();
    const { t } = useLanguage();
    const { isDemoMode, demoUser, isInitialized } = useDemo();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const isAdmin = isDemoMode ? demoUser?.role === "ADMIN" : session?.user?.role === "ADMIN";
    const currentUser = isDemoMode ? demoUser : session?.user;

    // Calculate stats from requests
    const stats = useMemo(() => {
        const pending = requests.filter(r => r.status === "Pending").length;
        const inProgress = requests.filter(r => r.status === "In Progress").length;
        const completed = requests.filter(r => r.status === "Completed").length;
        return { total: requests.length, pending, inProgress, completed };
    }, [requests]);

    // Filter requests based on search
    const filteredRequests = useMemo(() => {
        if (!searchQuery) return requests;
        const query = searchQuery.toLowerCase();
        return requests.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.user.name.toLowerCase().includes(query) ||
            r.type.toLowerCase().includes(query)
        );
    }, [requests, searchQuery]);

    useEffect(() => {
        if (status === "loading" || !isInitialized) return;

        if (isDemoMode) {
            if (demoUser?.role !== "ADMIN") {
                router.push("/dashboard");
                return;
            }
            setRequests(DEMO_ADMIN_REQUESTS);
            setIsLoading(false);
            return;
        }

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            if (session?.user?.role !== "ADMIN") {
                router.push("/dashboard");
                return;
            }
            fetchRequests();
        }
    }, [status, router, session, isDemoMode, demoUser, isInitialized]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        const newStatus = action === 'approve' ? 'In Progress' : 'Rejected';

        if (isDemoMode) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRequests(requests.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
            setProcessingId(null);
            return;
        }

        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: newStatus } : req
                ));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (status === "loading" || isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading Admin Portal...</p>
                </div>
            </div>
        );
    }

    if (!isDemoMode && !session) return null;
    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between px-4 h-14">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                            M
                        </div>
                        <span className="font-semibold text-foreground">Admin</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-border bg-card"
                        >
                            <div className="p-2 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                            item.active
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-secondary"
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                            {isDemoMode && (
                                <div className="mx-4 mb-4 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-medium text-primary">Demo Mode</span>
                                </div>
                            )}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-screen">
                    <div className="p-6 border-b border-border">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                M
                            </div>
                            <span className="text-xl font-bold text-foreground">Makin Admin</span>
                        </Link>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                                    item.active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary"
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-border">
                        {isDemoMode && (
                            <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-primary/10 border border-primary/20 rounded-xl">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-medium text-primary">Demo Mode</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                {currentUser?.name?.charAt(0) || "A"}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">{currentUser?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 min-h-screen">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                                    <p className="text-muted-foreground mt-1">
                                        Welcome back, {currentUser?.name?.split(" ")[0]}. Here's what's happening today.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm text-muted-foreground">Today</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: "Total Users", value: "1,248", icon: Users, change: "+12%", trend: "up", color: "text-blue-600", bgColor: "bg-blue-500/10" },
                                    { label: "Active Requests", value: stats.total.toString(), icon: FileText, change: `${stats.pending} pending`, trend: "neutral", color: "text-purple-600", bgColor: "bg-purple-500/10" },
                                    { label: "Revenue (SAR)", value: "847K", icon: DollarSign, change: "+18%", trend: "up", color: "text-emerald-600", bgColor: "bg-emerald-500/10" },
                                    { label: "Completion Rate", value: "94%", icon: TrendingUp, change: "+5%", trend: "up", color: "text-orange-600", bgColor: "bg-orange-500/10" },
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
                                            {stat.trend !== "neutral" && (
                                                <span className={`flex items-center gap-1 text-xs font-medium ${
                                                    stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                                                }`}>
                                                    {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {stat.change}
                                                </span>
                                            )}
                                            {stat.trend === "neutral" && (
                                                <span className="text-xs text-muted-foreground">{stat.change}</span>
                                            )}
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
                                        <Link
                                            key={action.label}
                                            href={action.href}
                                            className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
                                        >
                                            <div className={`p-2.5 rounded-lg ${action.color}`}>
                                                <action.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                                {action.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Recent Requests - Takes 2 columns */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden"
                                >
                                    <div className="p-5 border-b border-border">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-1 sm:flex-none">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full sm:w-48 pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    />
                                                </div>
                                                <Link
                                                    href="/admin/requests"
                                                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
                                                >
                                                    View All
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request List */}
                                    <div className="divide-y divide-border">
                                        {filteredRequests.slice(0, 5).map((req) => {
                                            const statusClasses = getStatusClasses(req.status, "request");
                                            const typeStyles = getServiceTypeClasses(req.type);
                                            const isProcessing = processingId === req.id;

                                            return (
                                                <div key={req.id} className="p-4 hover:bg-secondary/20 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles.bg} ${typeStyles.text}`}>
                                                                    {req.type}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">#{req.id.slice(-4)}</span>
                                                            </div>
                                                            <h3 className="font-medium text-foreground truncate">{req.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                                <span>{req.user.name}</span>
                                                                <span>•</span>
                                                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                                                                {req.status}
                                                            </span>
                                                            {req.status === 'Pending' && (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleAction(req.id, 'approve')}
                                                                        disabled={isProcessing}
                                                                        className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                                                        title="Approve"
                                                                    >
                                                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAction(req.id, 'reject')}
                                                                        disabled={isProcessing}
                                                                        className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                                        title="Reject"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <Link
                                                                href={`/admin/requests/${req.id}`}
                                                                className="p-1.5 bg-secondary text-muted-foreground rounded-lg hover:bg-secondary/80 hover:text-foreground transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {filteredRequests.length === 0 && (
                                            <div className="p-8 text-center">
                                                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                                <p className="text-muted-foreground">No requests found</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Sidebar - Activity & Alerts */}
                                <div className="space-y-6">
                                    {/* Request Summary */}
                                    <div className="bg-card border border-border rounded-2xl p-5">
                                        <h3 className="font-semibold text-foreground mb-4">Request Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                    <span className="text-sm text-muted-foreground">Pending</span>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{stats.pending}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                    <span className="text-sm text-muted-foreground">In Progress</span>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{stats.inProgress}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                    <span className="text-sm text-muted-foreground">Completed</span>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{stats.completed}</span>
                                            </div>
                                        </div>

                                        {/* Simple progress bar */}
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
                                                {stats.completed > 0 && (
                                                    <div
                                                        className="bg-emerald-500"
                                                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                                                    />
                                                )}
                                                {stats.inProgress > 0 && (
                                                    <div
                                                        className="bg-blue-500"
                                                        style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                                                    />
                                                )}
                                                {stats.pending > 0 && (
                                                    <div
                                                        className="bg-yellow-500"
                                                        style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alerts */}
                                    <div className="bg-card border border-border rounded-2xl p-5">
                                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            Alerts
                                        </h3>
                                        <div className="space-y-3">
                                            {stats.pending > 0 && (
                                                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{stats.pending} pending requests</p>
                                                        <p className="text-xs text-muted-foreground">Requires your attention</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                <UserPlus className="w-4 h-4 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">3 new users today</p>
                                                    <p className="text-xs text-muted-foreground">Review their profiles</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-card border border-border rounded-2xl p-5">
                                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-primary" />
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { action: "Request approved", user: "Ahmed Al-Rashid", time: "2 min ago" },
                                                { action: "New user registered", user: "Sara Tech", time: "15 min ago" },
                                                { action: "Payment received", user: "Omar Trading", time: "1 hour ago" },
                                            ].map((activity, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-foreground truncate">{activity.action}</p>
                                                        <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
