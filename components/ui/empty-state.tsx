"use client";

import { LucideIcon, FileText, Bell, Users, Search } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}

// Pre-configured empty states for common scenarios
export function EmptyRequests({ onCreateNew }: { onCreateNew?: () => void }) {
    return (
        <EmptyState
            icon={FileText}
            title="No requests yet"
            description="You haven't submitted any service requests. Start by creating your first request."
            action={{
                label: "Create New Request",
                onClick: onCreateNew,
            }}
        />
    );
}

export function EmptyNotifications() {
    return (
        <EmptyState
            icon={Bell}
            title="All caught up!"
            description="You don't have any notifications. We'll let you know when something needs your attention."
        />
    );
}

export function EmptySearch({ query }: { query?: string }) {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description={query
                ? `We couldn't find anything matching "${query}". Try a different search term.`
                : "Try searching with different keywords."
            }
        />
    );
}

export function EmptyTeam() {
    return (
        <EmptyState
            icon={Users}
            title="No team members"
            description="Invite team members to collaborate on your business requests."
            action={{
                label: "Invite Team Member",
                href: "/dashboard/profile?tab=team",
            }}
        />
    );
}
