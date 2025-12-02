"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

// Check if demo mode is active from localStorage
function isDemoModeActive(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("makin-demo-mode") === "true";
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [isDemo, setIsDemo] = useState<boolean | null>(null);

    useEffect(() => {
        // Check demo mode on client side
        setIsDemo(isDemoModeActive());

        // Listen for storage changes (demo mode toggle)
        const handleStorageChange = () => {
            setIsDemo(isDemoModeActive());
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Still loading - render children without SessionProvider to avoid flash
    if (isDemo === null) {
        return <>{children}</>;
    }

    // In demo mode - skip NextAuth SessionProvider entirely
    if (isDemo) {
        return <>{children}</>;
    }

    // Normal mode - use NextAuth SessionProvider
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
