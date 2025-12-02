"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
    const allItems = showHome
        ? [{ label: "Dashboard", href: "/dashboard" }, ...items]
        : items;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
            {showHome && (
                <>
                    <Link
                        href="/dashboard"
                        className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Dashboard home"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                    {items.length > 0 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    )}
                </>
            )}
            {items.map((item, index) => (
                <Fragment key={index}>
                    {index > 0 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    )}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="px-1.5 py-0.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="px-1.5 py-0.5 text-foreground font-medium">
                            {item.label}
                        </span>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}
