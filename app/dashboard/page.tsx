"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, User, Calendar, Shield, Plus, X, FileText, Clock, CheckCircle2, AlertCircle, Sparkles, Scale } from "lucide-react";
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

export default function CustomerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const { isDemoMode, demoUser, demoRequests, addDemoRequest, isInitialized } = useDemo();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const [activeServices, setActiveServices] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Request Modal State
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ type: "HR", title: "", description: "" });
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Check if user is authenticated via session or demo mode
    const isAuthenticated = session || isDemoMode;
    const currentUser = isDemoMode ? demoUser : session?.user;

    useEffect(() => {
        // Wait for both session and demo context to initialize
        if (status === "loading" || !isInitialized) return;

        if (!isDemoMode && status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (isDemoMode) {
            // Use demo requests
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
            // Handle demo mode request creation
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

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20 pt-6 sm:pt-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                        {t("dashboard.title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage your business operations and track service requests.</p>
                </div>
                <div className="flex items-center gap-4">
                    {isDemoMode && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">Demo Mode</span>
                        </div>
                    )}
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    </div>
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Request
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Active Services */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <FileText className="w-5 h-5" />
                            </div>
                            {t("dashboard.activeSubs") || "Active Services"}
                        </h2>

                        {activeServices.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl bg-secondary/20">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-foreground font-medium mb-1">No active requests</h3>
                                <p className="text-sm text-muted-foreground mb-4">Get started by creating your first service request.</p>
                                <button onClick={() => setIsRequestModalOpen(true)} className="text-primary hover:underline text-sm font-medium">Create Request</button>
                            </div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-4"
                            >
                                {activeServices.map((service) => (
                                    <motion.div
                                        layout
                                        variants={item}
                                        key={service.id}
                                        className="group relative bg-background/50 border border-border rounded-2xl p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-md overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl shrink-0 ${service.type === 'Government' ? 'bg-blue-500/10 text-blue-600' :
                                                    service.type === 'HR' ? 'bg-purple-500/10 text-purple-600' :
                                                    service.type === 'Legal' ? 'bg-green-500/10 text-green-600' :
                                                        'bg-orange-500/10 text-orange-600'
                                                    }`}>
                                                    {service.type === 'Government' ? <Shield className="w-5 h-5" /> :
                                                        service.type === 'HR' ? <User className="w-5 h-5" /> :
                                                        service.type === 'Legal' ? <Scale className="w-5 h-5" /> :
                                                            <CreditCard className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <Link href={`/dashboard/requests/${service.id}`} className="hover:text-primary transition-colors">
                                                        <h3 className="text-base font-bold text-foreground">{service.title}</h3>
                                                    </Link>
                                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-md">
                                                            <Clock className="w-3 h-3" /> {new Date(service.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span>#{service.id.slice(-4)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${service.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                                                    service.status === "In Progress" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                                                        "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                                                    }`}>
                                                    {service.status === "Completed" ? <CheckCircle2 className="w-3 h-3" /> :
                                                        service.status === "In Progress" ? <Clock className="w-3 h-3" /> :
                                                            <AlertCircle className="w-3 h-3" />}
                                                    {service.status}
                                                </span>
                                                <Link
                                                    href={`/dashboard/requests/${service.id}`}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="nano-border-gradient p-[1px] rounded-[2rem]">
                        <div className="bg-card rounded-[2rem] p-6 h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                    {currentUser?.name?.[0] || "U"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-base">{currentUser?.name}</h3>
                                    <p className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                        {isDemoMode ? demoUser?.plan : "Premium Member"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm p-4 bg-background/50 border border-border rounded-xl hover:border-primary/30 transition-colors">
                                    <span className="text-muted-foreground">{t("dashboard.memberSince")}</span>
                                    <span className="font-medium text-foreground">
                                        {isDemoMode && demoUser?.memberSince
                                            ? new Date(demoUser.memberSince).toLocaleDateString()
                                            : new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-4 bg-background/50 border border-border rounded-xl hover:border-primary/30 transition-colors">
                                    <span className="text-muted-foreground">{t("dashboard.activeServices")}</span>
                                    <span className="font-medium text-foreground">{activeServices.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3 relative z-10">
                            <Shield className="w-5 h-5 text-primary" />
                            {t("dashboard.needHelp")}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed relative z-10">
                            {t("dashboard.supportDesc")}
                        </p>
                        <button className="w-full btn-outline relative z-10 bg-background/50 hover:bg-background">
                            {t("dashboard.contactSupport")}
                        </button>
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
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-panel rounded-3xl shadow-2xl z-50 p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">New Service Request</h2>
                                    <p className="text-sm text-muted-foreground">Submit a new request for your business.</p>
                                </div>
                                <button
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Service Type</label>
                                    <div className="relative">
                                        <select
                                            value={newRequest.type}
                                            onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none"
                                        >
                                            <option value="HR">HR & Recruitment</option>
                                            <option value="Government">Government Relations (GRO)</option>
                                            <option value="Accounting">Accounting & Finance</option>
                                            <option value="Legal">Legal Consultation</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newRequest.title}
                                        onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                        placeholder="e.g. Renew Commercial License"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                    <textarea
                                        required
                                        value={newRequest.description}
                                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] text-sm resize-none"
                                        placeholder="Describe your request in detail..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsRequestModalOpen(false)}
                                        className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
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
