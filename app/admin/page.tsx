"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, Settings, Check, X, Search, Clock, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";

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

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const { isDemoMode, demoUser, isInitialized } = useDemo();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated via session or demo mode (as admin)
    const isAdmin = isDemoMode ? demoUser?.role === "ADMIN" : session?.user?.role === "ADMIN";
    const currentUser = isDemoMode ? demoUser : session?.user;

    // Mock Admin Data for stats (could be real later)
    const [stats, setStats] = useState([
        { label: "Total Users", value: "1,240", icon: Users, change: "+12%" },
        { label: "Active Requests", value: "0", icon: FileText, change: "+5%" },
        { label: "Revenue (SAR)", value: "850k", icon: TrendingUp, change: "+18%" },
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
        const newStatus = action === 'approve' ? 'In Progress' : 'Rejected';

        if (isDemoMode) {
            // Handle demo mode action
            setRequests(requests.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
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
        }
    };

    if (status === "loading" || isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading Admin Portal...</p>
                </div>
            </div>
        );
    }

    if (!isDemoMode && !session) return null;
    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-muted/10 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">M</div>
                        <span className="text-xl font-bold text-foreground">Makin Admin</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                        <TrendingUp className="w-5 h-5" /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium transition-colors">
                        <Users className="w-5 h-5" /> Users
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium transition-colors">
                        <FileText className="w-5 h-5" /> Requests
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium transition-colors">
                        <Settings className="w-5 h-5" /> Settings
                    </a>
                </nav>
                <div className="p-4 border-t border-border">
                    {isDemoMode && (
                        <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-primary/10 border border-primary/20 rounded-xl">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">Demo Mode</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                            <p className="text-muted-foreground">Welcome back, Admin.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-card border border-border rounded-full text-sm focus:outline-none focus:border-primary w-64"
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-green-500 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-full">{stat.change}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Requests */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Recent Requests</h2>
                            <button className="text-sm text-primary font-medium hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50">
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
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-foreground">#{req.id.slice(-4)}</td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                <div className="font-medium text-foreground">{req.user?.name || "Unknown"}</div>
                                                <div className="text-xs">{req.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground font-medium">
                                                <div>{req.type}</div>
                                                <div className="text-xs text-muted-foreground">{req.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'Completed' || req.status === 'Approved' ? 'bg-green-500/10 text-green-600' :
                                                    req.status === 'Rejected' ? 'bg-red-500/10 text-red-600' :
                                                        req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' :
                                                            'bg-yellow-500/10 text-yellow-600'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {req.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(req.id, 'approve')}
                                                                className="p-1.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
                                                                title="Approve (Start Progress)"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(req.id, 'reject')}
                                                                className="p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <Link href={`/admin/requests/${req.id}`} className="p-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors" title="View Details">
                                                        <FileText className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
