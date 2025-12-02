"use client";

import { useSafeSession } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    FileText,
    TrendingUp,
    Settings,
    Check,
    X,
    Search,
    Clock,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Menu,
    Home,
    BarChart3,
    Shield,
    ChevronRight,
    Loader2,
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

// Demo admin requests for demo mode
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
        type: "Financial",
        user: { name: "Omar Trading Co.", email: "finance@omar-trading.sa" }
    },
    {
        id: "admin-req-004",
        title: "Contract Review - Partnership Agreement",
        status: "Pending",
        createdAt: "2024-01-16T11:45:00Z",
        type: "Government",
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

export default function AdminDashboard() {
    const { data: session, status } = useSafeSession();
    const router = useRouter();
    const { t } = useLanguage();
    const { isDemoMode, demoUser, isInitialized } = useDemo();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Check if user is authenticated via session or demo mode (as admin)
    const isAdmin = isDemoMode ? demoUser?.role === "ADMIN" : session?.user?.role === "ADMIN";
    const currentUser = isDemoMode ? demoUser : session?.user;

    // Stats data
    const [stats, setStats] = useState([
        { label: "Total Users", value: "1,240", icon: Users, change: "+12%", trend: "up" },
        { label: "Active Requests", value: "0", icon: FileText, change: "+5%", trend: "up" },
        { label: "Revenue (SAR)", value: "850k", icon: TrendingUp, change: "+18%", trend: "up" },
    ]);

    useEffect(() => {
        // Wait for both session and demo context to initialize
        if (status === "loading" || !isInitialized) return;

        if (isDemoMode) {
            // Check if demo user is admin
            if (demoUser?.role !== "ADMIN") {
                router.push("/dashboard");
                return;
            }
            // Use demo admin requests
            setRequests(DEMO_ADMIN_REQUESTS);
            setStats(prev => prev.map(s =>
                s.label === "Active Requests" ? { ...s, value: DEMO_ADMIN_REQUESTS.length.toString() } : s
            ));
            setIsLoading(false);
            return;
        }

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            // Check role
            if (session?.user?.role !== "ADMIN") {
                router.push("/dashboard"); // Redirect non-admins
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
                // Update stats based on real data
                setStats(prev => prev.map(s =>
                    s.label === "Active Requests" ? { ...s, value: data.length.toString() } : s
                ));
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
            // Handle demo mode action with delay for UX
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
                        aria-expanded={isMobileMenuOpen}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Navigation */}
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
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                M
                            </div>
                            <span className="text-xl font-bold text-foreground">Makin Admin</span>
                        </div>
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
                        <div className="max-w-6xl mx-auto">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
                                    <p className="text-muted-foreground text-sm sm:text-base">Welcome back, Admin.</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        aria-label="Search"
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card border border-border rounded-2xl p-4 sm:p-6"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl text-primary">
                                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                                                stat.trend === "up"
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-destructive/10 text-destructive"
                                            }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Requests */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-card border border-border rounded-2xl overflow-hidden"
                            >
                                <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Recent Requests</h2>
                                    <Link
                                        href="/admin/requests"
                                        className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/30">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Type</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {requests.map((req) => {
                                                const statusClasses = getStatusClasses(req.status, "request");
                                                const typeStyles = getServiceTypeClasses(req.type);
                                                const isProcessing = processingId === req.id;

                                                return (
                                                    <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                                                            #{req.id.slice(-4)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <div className="font-medium text-foreground">{req.user?.name || "Unknown"}</div>
                                                            <div className="text-xs text-muted-foreground">{req.user?.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${typeStyles.bg} ${typeStyles.text}`}>
                                                                {req.type}
                                                            </span>
                                                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                                                                {req.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                                            {new Date(req.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                                                                {req.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {req.status === 'Pending' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleAction(req.id, 'approve')}
                                                                            disabled={isProcessing}
                                                                            className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                                                            title="Approve (Start Progress)"
                                                                            aria-label="Approve request"
                                                                        >
                                                                            {isProcessing ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <Check className="w-4 h-4" />
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleAction(req.id, 'reject')}
                                                                            disabled={isProcessing}
                                                                            className="p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50"
                                                                            title="Reject"
                                                                            aria-label="Reject request"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <Link
                                                                    href={`/admin/requests/${req.id}`}
                                                                    className="p-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                                                                    title="View Details"
                                                                    aria-label="View request details"
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-border">
                                    {requests.map((req) => {
                                        const statusClasses = getStatusClasses(req.status, "request");
                                        const typeStyles = getServiceTypeClasses(req.type);
                                        const isProcessing = processingId === req.id;

                                        return (
                                            <div key={req.id} className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-foreground truncate">{req.title}</p>
                                                        <p className="text-xs text-muted-foreground">#{req.id.slice(-4)}</p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusClasses}`}>
                                                        {req.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles.bg} ${typeStyles.text}`}>
                                                        {req.type}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-medium text-foreground">{req.user?.name}</span>
                                                    <span className="mx-1">·</span>
                                                    <span className="text-xs">{req.user?.email}</span>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    {req.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(req.id, 'approve')}
                                                                disabled={isProcessing}
                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                                                            >
                                                                {isProcessing ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(req.id, 'reject')}
                                                                disabled={isProcessing}
                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm font-medium disabled:opacity-50"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <Link
                                                        href={`/admin/requests/${req.id}`}
                                                        className={`${req.status === 'Pending' ? '' : 'flex-1'} flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium`}
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {requests.length === 0 && (
                                    <div className="p-8 text-center">
                                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No requests found</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
