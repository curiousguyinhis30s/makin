"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface DemoUser {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    plan: string;
    memberSince: string;
}

interface DemoContextType {
    isDemoMode: boolean;
    demoUser: DemoUser | null;
    isInitialized: boolean;
    enableDemoMode: (role?: "USER" | "ADMIN") => Promise<void>;
    disableDemoMode: () => void;
    demoRequests: DemoRequest[];
    addDemoRequest: (request: Omit<DemoRequest, "id" | "createdAt">) => void;
    updateDemoRequest: (id: string, status: string) => void;
}

interface DemoRequest {
    id: string;
    title: string;
    type: string;
    status: string;
    description: string;
    createdAt: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const DEMO_USER: DemoUser = {
    id: "demo-user-001",
    name: "Ahmed Al-Rashid",
    email: "demo@makin.sa",
    role: "USER",
    plan: "Professional",
    memberSince: "2024-01-15",
};

const DEMO_ADMIN: DemoUser = {
    id: "demo-admin-001",
    name: "Admin User",
    email: "admin@makin.sa",
    role: "ADMIN",
    plan: "Enterprise",
    memberSince: "2023-06-01",
};

const INITIAL_DEMO_REQUESTS: DemoRequest[] = [
    {
        id: "req-001",
        title: "Commercial License Renewal",
        type: "Government",
        status: "In Progress",
        description: "Annual renewal of commercial registration (CR) for our trading company.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "req-002",
        title: "Employee Visa Processing",
        type: "HR",
        status: "Pending",
        description: "Work visa application for 3 new software engineers from India.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "req-003",
        title: "VAT Return Filing Q4",
        type: "Accounting",
        status: "Completed",
        description: "Quarterly VAT return filing for Q4 2024 with ZATCA.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "req-004",
        title: "Employment Contract Review",
        type: "Legal",
        status: "In Progress",
        description: "Review and update standard employment contracts for compliance with new labor laws.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Helper to check localStorage (safe for SSR)
function getInitialDemoState(): { isDemoMode: boolean; role: "USER" | "ADMIN" | null } {
    if (typeof window === "undefined") {
        return { isDemoMode: false, role: null };
    }
    const savedDemoMode = localStorage.getItem("makin-demo-mode");
    const savedDemoRole = localStorage.getItem("makin-demo-role") as "USER" | "ADMIN" | null;
    return {
        isDemoMode: savedDemoMode === "true",
        role: savedDemoRole
    };
}

export function DemoProvider({ children }: { children: ReactNode }) {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
    const [demoRequests, setDemoRequests] = useState<DemoRequest[]>(INITIAL_DEMO_REQUESTS);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
        const { isDemoMode: savedMode, role } = getInitialDemoState();
        if (savedMode && role) {
            setIsDemoMode(true);
            setDemoUser(role === "ADMIN" ? DEMO_ADMIN : DEMO_USER);
        }
        setIsInitialized(true);
    }, []);

    const enableDemoMode = useCallback(async (role: "USER" | "ADMIN" = "USER"): Promise<void> => {
        return new Promise((resolve) => {
            setIsDemoMode(true);
            setDemoUser(role === "ADMIN" ? DEMO_ADMIN : DEMO_USER);
            localStorage.setItem("makin-demo-mode", "true");
            localStorage.setItem("makin-demo-role", role);
            // Small delay to ensure state is committed before navigation
            setTimeout(resolve, 50);
        });
    }, []);

    const disableDemoMode = useCallback(() => {
        setIsDemoMode(false);
        setDemoUser(null);
        localStorage.removeItem("makin-demo-mode");
        localStorage.removeItem("makin-demo-role");
    }, []);

    const addDemoRequest = (request: Omit<DemoRequest, "id" | "createdAt">) => {
        const newRequest: DemoRequest = {
            ...request,
            id: `req-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setDemoRequests([newRequest, ...demoRequests]);
    };

    const updateDemoRequest = (id: string, status: string) => {
        setDemoRequests(
            demoRequests.map((req) => (req.id === id ? { ...req, status } : req))
        );
    };

    return (
        <DemoContext.Provider
            value={{
                isDemoMode,
                demoUser,
                isInitialized,
                enableDemoMode,
                disableDemoMode,
                demoRequests,
                addDemoRequest,
                updateDemoRequest,
            }}
        >
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error("useDemo must be used within a DemoProvider");
    }
    return context;
}
