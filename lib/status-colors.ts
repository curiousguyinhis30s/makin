// Consistent status styling across the entire application
// Use these instead of inline color classes for consistency

export type RequestStatus =
    | "Pending"
    | "In Progress"
    | "Under Review"
    | "Completed"
    | "Rejected"
    | "Cancelled"
    | "Approved";

export type InvoiceStatus =
    | "Paid"
    | "Pending"
    | "Overdue"
    | "Cancelled";

export type DocumentStatus =
    | "Pending Review"
    | "Approved"
    | "Rejected"
    | "Uploaded";

export type ServiceType =
    | "Government"
    | "HR"
    | "Accounting"
    | "Legal"
    | "Specialized";

// Request status styles
export const REQUEST_STATUS_STYLES: Record<RequestStatus, { bg: string; text: string; border: string; icon?: string }> = {
    "Pending": {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
        icon: "clock"
    },
    "In Progress": {
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
        icon: "loader"
    },
    "Under Review": {
        bg: "bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
        icon: "eye"
    },
    "Completed": {
        bg: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20",
        icon: "check-circle"
    },
    "Approved": {
        bg: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20",
        icon: "check-circle"
    },
    "Rejected": {
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20",
        icon: "x-circle"
    },
    "Cancelled": {
        bg: "bg-gray-500/10",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-500/20",
        icon: "x"
    }
};

// Invoice status styles
export const INVOICE_STATUS_STYLES: Record<InvoiceStatus, { bg: string; text: string; border: string }> = {
    "Paid": {
        bg: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20"
    },
    "Pending": {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20"
    },
    "Overdue": {
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20"
    },
    "Cancelled": {
        bg: "bg-gray-500/10",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-500/20"
    }
};

// Document status styles
export const DOCUMENT_STATUS_STYLES: Record<DocumentStatus, { bg: string; text: string; border: string }> = {
    "Pending Review": {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20"
    },
    "Approved": {
        bg: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20"
    },
    "Rejected": {
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20"
    },
    "Uploaded": {
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20"
    }
};

// Service type styles
export const SERVICE_TYPE_STYLES: Record<ServiceType, { bg: string; text: string; border: string; iconBg: string }> = {
    "Government": {
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
        iconBg: "bg-blue-500"
    },
    "HR": {
        bg: "bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
        iconBg: "bg-purple-500"
    },
    "Accounting": {
        bg: "bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500/20",
        iconBg: "bg-orange-500"
    },
    "Legal": {
        bg: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20",
        iconBg: "bg-green-500"
    },
    "Specialized": {
        bg: "bg-pink-500/10",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-500/20",
        iconBg: "bg-pink-500"
    }
};

// Helper function to get status badge classes
export function getStatusClasses(status: string, type: "request" | "invoice" | "document" = "request"): string {
    let styles;

    if (type === "request") {
        styles = REQUEST_STATUS_STYLES[status as RequestStatus];
    } else if (type === "invoice") {
        styles = INVOICE_STATUS_STYLES[status as InvoiceStatus];
    } else {
        styles = DOCUMENT_STATUS_STYLES[status as DocumentStatus];
    }

    if (!styles) {
        // Fallback for unknown status
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }

    return `${styles.bg} ${styles.text} ${styles.border}`;
}

// Helper to get service type classes
export function getServiceTypeClasses(type: string): { bg: string; text: string; iconBg: string } {
    const styles = SERVICE_TYPE_STYLES[type as ServiceType];

    if (!styles) {
        return {
            bg: "bg-gray-500/10",
            text: "text-gray-600 dark:text-gray-400",
            iconBg: "bg-gray-500"
        };
    }

    return {
        bg: styles.bg,
        text: styles.text,
        iconBg: styles.iconBg
    };
}

// Status badge component helper
export function StatusBadge({ status, type = "request" }: { status: string; type?: "request" | "invoice" | "document" }) {
    const classes = getStatusClasses(status, type);
    return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`;
}
