"use client";

import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    FileText,
    MessageSquare,
    User,
    AlertCircle,
    XCircle,
    Loader2,
    Upload,
} from "lucide-react";

export interface TimelineEvent {
    id: string;
    type: "created" | "status_change" | "document" | "message" | "assignment" | "cancelled";
    title: string;
    description?: string;
    timestamp: string;
    user?: string;
    metadata?: Record<string, string>;
}

interface ActivityTimelineProps {
    events: TimelineEvent[];
    isLoading?: boolean;
}

const eventIcons: Record<TimelineEvent["type"], typeof Clock> = {
    created: Clock,
    status_change: CheckCircle2,
    document: FileText,
    message: MessageSquare,
    assignment: User,
    cancelled: XCircle,
};

const eventColors: Record<TimelineEvent["type"], string> = {
    created: "bg-blue-500",
    status_change: "bg-green-500",
    document: "bg-purple-500",
    message: "bg-amber-500",
    assignment: "bg-cyan-500",
    cancelled: "bg-red-500",
};

export function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No activity yet</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
                {events.map((event, index) => {
                    const Icon = eventIcons[event.type];
                    const color = eventColors[event.type];

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-10"
                        >
                            {/* Icon */}
                            <div
                                className={`absolute left-0 top-0 w-8 h-8 rounded-full ${color} flex items-center justify-center shadow-sm`}
                            >
                                <Icon className="w-4 h-4 text-white" />
                            </div>

                            {/* Content */}
                            <div className="bg-card border border-border rounded-xl p-4">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-foreground">
                                        {event.title}
                                    </h4>
                                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatTimeAgo(event.timestamp)}
                                    </time>
                                </div>
                                {event.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {event.description}
                                    </p>
                                )}
                                {event.user && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {event.user}
                                    </p>
                                )}
                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {Object.entries(event.metadata).map(([key, value]) => (
                                            <span
                                                key={key}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-secondary rounded-full"
                                            >
                                                <span className="text-muted-foreground">{key}:</span>
                                                <span className="font-medium">{value}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function formatTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
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

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

// Helper to create timeline events from request data
export function createTimelineFromRequest(request: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
    documents?: Array<{ id: string; fileName: string; createdAt: string }>;
    comments?: Array<{ id: string; content: string; createdAt: string; user?: { name: string } }>;
    assignedTo?: { name: string };
}): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    // Created event
    events.push({
        id: `created-${request.id}`,
        type: "created",
        title: "Request Created",
        description: "Your service request has been submitted",
        timestamp: request.createdAt,
    });

    // Document events
    if (request.documents) {
        request.documents.forEach((doc) => {
            events.push({
                id: `doc-${doc.id}`,
                type: "document",
                title: "Document Uploaded",
                description: doc.fileName,
                timestamp: doc.createdAt,
            });
        });
    }

    // Comment events
    if (request.comments) {
        request.comments.forEach((comment) => {
            events.push({
                id: `comment-${comment.id}`,
                type: "message",
                title: "New Message",
                description: comment.content.substring(0, 100) + (comment.content.length > 100 ? "..." : ""),
                timestamp: comment.createdAt,
                user: comment.user?.name,
            });
        });
    }

    // Assignment event
    if (request.assignedTo) {
        events.push({
            id: `assigned-${request.id}`,
            type: "assignment",
            title: "Assigned to Staff",
            description: `${request.assignedTo.name} is now handling your request`,
            timestamp: request.updatedAt || request.createdAt,
            user: request.assignedTo.name,
        });
    }

    // Status change (if different from Pending)
    if (request.status !== "Pending" && request.updatedAt) {
        events.push({
            id: `status-${request.id}`,
            type: request.status === "Cancelled" || request.status === "Rejected" ? "cancelled" : "status_change",
            title: `Status: ${request.status}`,
            description: getStatusDescription(request.status),
            timestamp: request.updatedAt,
        });
    }

    // Sort by timestamp (newest first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
        "In Progress": "Our team is actively working on your request",
        "Under Review": "Your request is being reviewed by our specialists",
        "Completed": "Your request has been successfully completed",
        "Rejected": "Unfortunately, we were unable to process this request",
        "Cancelled": "This request has been cancelled",
    };
    return descriptions[status] || "";
}
