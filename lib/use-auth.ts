"use client";

import { useSession } from "next-auth/react";

/**
 * Safe useSession hook that doesn't crash when SessionProvider is not present.
 * useSession returns undefined when SessionProvider is not available (e.g., demo mode).
 */
export function useSafeSession() {
    const session = useSession();
    if (!session) {
        return { data: null, status: "unauthenticated" as const };
    }
    return session;
}
