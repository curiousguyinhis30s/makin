"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2,
    Plus,
    ChevronDown,
    Shield,
    User,
    CreditCard,
    Scale,
    Calendar,
    ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/lib/use-auth";
import { useDemo } from "@/lib/demo-context";
import { useLanguage } from "@/lib/i18n";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyRequests } from "@/components/ui/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { getStatusClasses, getServiceTypeClasses } from "@/lib/status-colors";

interface ServiceRequest {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    type: string;
    description: string;
}

type SortField = "createdAt" | "status" | "type" | "title";
type SortDirection = "asc" | "desc";

const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Under Review", "Completed", "Rejected", "Cancelled"];
const TYPE_OPTIONS = ["All", "Government", "HR", "Accounting", "Legal"];

export default function RequestsListPage() {
    const { data: session, status: authStatus } = useSafeSession();
    const { isDemoMode, demoRequests, isInitialized } = useDemo();
    const { t } = useLanguage();
    const router = useRouter();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isAuthenticated = session || isDemoMode;

    useEffect(() => {
        if (authStatus === "loading" || !isInitialized) return;

        if (!isDemoMode && authStatus === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (isDemoMode) {
            setRequests(demoRequests);
            setIsLoading(false);
        } else if (authStatus === "authenticated") {
            fetchRequests();
        }
    }, [authStatus, router, isDemoMode, demoRequests, isInitialized]);

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

    // Filtered and sorted requests
    const filteredRequests = useMemo(() => {
        let result = [...requests];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (req) =>
                    req.title.toLowerCase().includes(query) ||
                    req.id.toLowerCase().includes(query) ||
                    req.description?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "All") {
            result = result.filter((req) => req.status === statusFilter);
        }

        // Type filter
        if (typeFilter !== "All") {
            result = result.filter((req) => req.type === typeFilter);
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "createdAt":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case "status":
                    comparison = a.status.localeCompare(b.status);
                    break;
                case "type":
                    comparison = a.type.localeCompare(b.type);
                    break;
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return result;
    }, [requests, searchQuery, statusFilter, typeFilter, sortField, sortDirection]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed":
            case "Approved":
                return <CheckCircle2 className="w-3.5 h-3.5" />;
            case "In Progress":
            case "Under Review":
                return <Clock className="w-3.5 h-3.5" />;
            case "Rejected":
            case "Cancelled":
                return <XCircle className="w-3.5 h-3.5" />;
            default:
                return <AlertCircle className="w-3.5 h-3.5" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Government":
                return <Shield className="w-4 h-4" />;
            case "HR":
                return <User className="w-4 h-4" />;
            case "Accounting":
                return <CreditCard className="w-4 h-4" />;
            case "Legal":
                return <Scale className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    if (authStatus === "loading" || isLoading || !isInitialized) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "My Requests" }]} />
                </div>
                <SkeletonTable rows={5} />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb items={[{ label: "My Requests" }]} />
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Requests</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
                    </p>
                </div>
                <Link
                    href="/dashboard?action=new-request"
                    className="btn-primary flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    New Request
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, ID, or description..."
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Filter toggles */}
                    <div className="flex flex-wrap gap-3">
                        {/* Status filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status === "All" ? "All Status" : status}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* Type filter */}
                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                {TYPE_OPTIONS.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "All" ? "All Types" : type}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Active filters */}
                {(statusFilter !== "All" || typeFilter !== "All" || searchQuery) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">Active filters:</span>
                        {statusFilter !== "All" && (
                            <button
                                onClick={() => setStatusFilter("All")}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                            >
                                {statusFilter}
                                <XCircle className="w-3 h-3" />
                            </button>
                        )}
                        {typeFilter !== "All" && (
                            <button
                                onClick={() => setTypeFilter("All")}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                            >
                                {typeFilter}
                                <XCircle className="w-3 h-3" />
                            </button>
                        )}
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                            >
                                "{searchQuery}"
                                <XCircle className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setStatusFilter("All");
                                setTypeFilter("All");
                                setSearchQuery("");
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl">
                    <EmptyRequests onCreateNew={() => router.push("/dashboard?action=new-request")} />
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-secondary/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <button
                            onClick={() => toggleSort("title")}
                            className="col-span-4 flex items-center gap-1 hover:text-foreground transition-colors text-left"
                        >
                            Request
                            <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => toggleSort("type")}
                            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left"
                        >
                            Type
                            <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => toggleSort("status")}
                            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left"
                        >
                            Status
                            <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => toggleSort("createdAt")}
                            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left"
                        >
                            Date
                            <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {filteredRequests.map((request, index) => {
                            const typeStyles = getServiceTypeClasses(request.type);

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group hover:bg-secondary/30 transition-colors"
                                >
                                    {/* Desktop view */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
                                        <div className="col-span-4">
                                            <Link
                                                href={`/dashboard/requests/${request.id}`}
                                                className="font-medium text-foreground hover:text-primary transition-colors"
                                            >
                                                {request.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                #{request.id.slice(-6)}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${typeStyles.bg} ${typeStyles.text}`}>
                                                {getTypeIcon(request.type)}
                                                {request.type}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClasses(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Link
                                                href={`/dashboard/requests/${request.id}`}
                                                className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Mobile view */}
                                    <Link
                                        href={`/dashboard/requests/${request.id}`}
                                        className="md:hidden block p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${typeStyles.bg}`}>
                                                    {getTypeIcon(request.type)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-foreground">{request.title}</h3>
                                                    <p className="text-xs text-muted-foreground">#{request.id.slice(-6)}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusClasses(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className={`px-2 py-0.5 rounded ${typeStyles.bg} ${typeStyles.text}`}>
                                                {request.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
