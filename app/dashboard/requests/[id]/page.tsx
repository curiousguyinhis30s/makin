"use client";

import { useSafeSession } from "@/lib/use-auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    FileText,
    Upload,
    MessageSquare,
    Shield,
    User,
    CreditCard,
    Download,
    Eye,
    Trash2,
    Loader2,
    Calendar,
    Hash,
    Building2,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SkeletonRequestDetail } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getStatusClasses, getServiceTypeClasses, REQUEST_STATUS_STYLES } from "@/lib/status-colors";
import { ActivityTimeline, createTimelineFromRequest, TimelineEvent } from "@/components/portal/ActivityTimeline";
import { MessageThread } from "@/components/portal/MessageThread";

interface Document {
    id: string;
    name: string;
    fileName: string;
    url: string;
    type: string;
    createdAt: string;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    isStaff: boolean;
    user?: {
        name: string;
        role?: string;
    };
}

interface ServiceRequest {
    id: string;
    title: string;
    description: string;
    status: string;
    type: string;
    priority?: string;
    createdAt: string;
    updatedAt?: string;
    documents: Document[];
    comments: Comment[];
    assignedTo?: {
        id: string;
        name: string;
        role?: string;
    };
    service?: {
        name: string;
        category?: string;
    };
}

export default function RequestDetails() {
    const { data: session, status } = useSafeSession();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { success, error: showError } = useToast();

    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "messages" | "timeline">("details");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated" && id) {
            fetchRequest();
        }
    }, [status, id, router]);

    const fetchRequest = async () => {
        try {
            const res = await fetch(`/api/requests/${id}`);
            if (res.ok) {
                const data = await res.json();
                setRequest(data);
            } else {
                router.push("/dashboard/requests");
            }
        } catch (err) {
            showError("Failed to load request", "Please try again");
            router.push("/dashboard/requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            showError("File too large", "Maximum file size is 10MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("serviceRequestId", id);
        formData.append("type", "USER_UPLOAD");

        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                success("Document uploaded", "Your file has been uploaded successfully");
                fetchRequest();
            } else {
                showError("Upload failed", "Please try again");
            }
        } catch (err) {
            showError("Upload failed", "Please check your connection and try again");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSendMessage = useCallback(async (content: string) => {
        const res = await fetch(`/api/requests/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        if (!res.ok) {
            throw new Error("Failed to send message");
        }

        success("Message sent", "Your message has been delivered");
        fetchRequest();
    }, [id, success]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Government":
                return Shield;
            case "HR":
                return User;
            case "Financial":
                return CreditCard;
            default:
                return Building2;
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-background p-6 lg:p-8">
                <SkeletonRequestDetail />
            </div>
        );
    }

    if (!request) return null;

    const TypeIcon = getTypeIcon(request.type);
    const statusClasses = getStatusClasses(request.status, "request");
    const typeStyles = getServiceTypeClasses(request.type);
    const timelineEvents = createTimelineFromRequest({
        id: request.id,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        documents: request.documents.map((d) => ({
            id: d.id,
            fileName: d.fileName || d.name,
            createdAt: d.createdAt,
        })),
        comments: request.comments,
        assignedTo: request.assignedTo,
    });

    const tabs = [
        { id: "details" as const, label: "Details", icon: FileText },
        { id: "messages" as const, label: "Messages", icon: MessageSquare, count: request.comments.length },
        { id: "timeline" as const, label: "Timeline", icon: Clock, count: timelineEvents.length },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center gap-4">
                        <Link
                            href="/dashboard/requests"
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            aria-label="Back to requests"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Breadcrumb
                            items={[
                                { label: "Requests", href: "/dashboard/requests" },
                                { label: request.title, href: `/dashboard/requests/${id}` },
                            ]}
                            showHome={false}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Request Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-6 mb-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                                    {request.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyles.bg} ${typeStyles.text}`}>
                                    {request.type}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {request.id.slice(0, 8)}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                {request.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Created {new Date(request.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                                {request.assignedTo && (
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        Assigned to {request.assignedTo.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl ${typeStyles.iconBg}`}>
                            <TypeIcon className={`w-8 h-8 ${typeStyles.text}`} />
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                    activeTab === tab.id
                                        ? "bg-primary/10 text-primary"
                                        : "bg-secondary text-muted-foreground"
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            {/* Description */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">
                                        Description
                                    </h2>
                                    <div className="prose prose-sm max-w-none text-muted-foreground">
                                        <p className="whitespace-pre-wrap">{request.description}</p>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            Documents
                                            {request.documents.length > 0 && (
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    ({request.documents.length})
                                                </span>
                                            )}
                                        </h2>
                                        <label
                                            className={`cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors ${
                                                isUploading ? "opacity-50 pointer-events-none" : ""
                                            }`}
                                        >
                                            {isUploading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4 mr-2" />
                                            )}
                                            {isUploading ? "Uploading..." : "Upload"}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                aria-label="Upload document"
                                            />
                                        </label>
                                    </div>

                                    {request.documents.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                                            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-sm text-muted-foreground mb-1">
                                                No documents uploaded yet
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Upload PDF, Word, or image files (max 10MB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {request.documents.map((doc, index) => (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-background rounded-lg border border-border">
                                                            <FileText className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {doc.fileName || doc.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(doc.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 hover:bg-background rounded-lg transition-colors"
                                                            aria-label={`Download ${doc.fileName || doc.name}`}
                                                        >
                                                            <Download className="w-4 h-4 text-muted-foreground" />
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Info */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                                Status
                                            </dt>
                                            <dd className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusClasses}`}>
                                                {request.status}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                                Service Type
                                            </dt>
                                            <dd className="text-sm text-foreground">{request.type}</dd>
                                        </div>
                                        {request.service && (
                                            <div>
                                                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                                    Service
                                                </dt>
                                                <dd className="text-sm text-foreground">{request.service.name}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                                Created
                                            </dt>
                                            <dd className="text-sm text-foreground">
                                                {new Date(request.createdAt).toLocaleString()}
                                            </dd>
                                        </div>
                                        {request.updatedAt && (
                                            <div>
                                                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                                    Last Updated
                                                </dt>
                                                <dd className="text-sm text-foreground">
                                                    {new Date(request.updatedAt).toLocaleString()}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* Assigned Staff */}
                                {request.assignedTo && (
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h3 className="font-semibold text-foreground mb-4">Assigned To</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {request.assignedTo.name}
                                                </p>
                                                {request.assignedTo.role && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {request.assignedTo.role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "messages" && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-card border border-border rounded-2xl overflow-hidden"
                        >
                            <MessageThread
                                requestId={request.id}
                                messages={request.comments.map((c) => ({
                                    id: c.id,
                                    content: c.content,
                                    createdAt: c.createdAt,
                                    isStaff: c.isStaff,
                                    user: c.user,
                                }))}
                                onSendMessage={handleSendMessage}
                                disabled={request.status === "Completed" || request.status === "Cancelled"}
                            />
                        </motion.div>
                    )}

                    {activeTab === "timeline" && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-card border border-border rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Activity Timeline
                            </h2>
                            <ActivityTimeline events={timelineEvents} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
