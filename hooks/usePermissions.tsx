"use client";

import { useSafeSession } from "@/lib/use-auth";
import { useEffect, useState, useCallback } from "react";
import { PermissionCode, ROLE_DEFINITIONS, RoleName } from "@/lib/permissions";

interface PermissionsState {
  permissions: PermissionCode[];
  roles: string[];
  isLoading: boolean;
  error: string | null;
}

export function usePermissions() {
  const { data: session, status } = useSafeSession();
  const [state, setState] = useState<PermissionsState>({
    permissions: [],
    roles: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchPermissions() {
      if (status === "loading") return;

      if (!session?.user?.id) {
        setState({
          permissions: [],
          roles: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const response = await fetch("/api/auth/permissions");
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();

        // If no RBAC data, fallback to legacy role
        if (data.permissions.length === 0 && session.user.role) {
          const legacyPermissions =
            ROLE_DEFINITIONS[session.user.role as RoleName]?.permissions || [];
          setState({
            permissions: legacyPermissions as PermissionCode[],
            roles: [session.user.role],
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            permissions: data.permissions,
            roles: data.roles,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        // Fallback to legacy role on error
        if (session?.user?.role) {
          const legacyPermissions =
            ROLE_DEFINITIONS[session.user.role as RoleName]?.permissions || [];
          setState({
            permissions: legacyPermissions as PermissionCode[],
            roles: [session.user.role],
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            permissions: [],
            roles: [],
            isLoading: false,
            error: "Failed to load permissions",
          });
        }
      }
    }

    fetchPermissions();
  }, [session, status]);

  const hasPermission = useCallback(
    (permission: PermissionCode): boolean => {
      return state.permissions.includes(permission);
    },
    [state.permissions]
  );

  const hasAnyPermission = useCallback(
    (permissions: PermissionCode[]): boolean => {
      return permissions.some((p) => state.permissions.includes(p));
    },
    [state.permissions]
  );

  const hasAllPermissions = useCallback(
    (permissions: PermissionCode[]): boolean => {
      return permissions.every((p) => state.permissions.includes(p));
    },
    [state.permissions]
  );

  const hasRole = useCallback(
    (role: RoleName): boolean => {
      return state.roles.includes(role);
    },
    [state.roles]
  );

  const isAdmin = useCallback((): boolean => {
    return state.roles.includes("SUPER_ADMIN") || state.roles.includes("ADMIN");
  }, [state.roles]);

  const isStaff = useCallback((): boolean => {
    return (
      state.roles.includes("SUPER_ADMIN") ||
      state.roles.includes("ADMIN") ||
      state.roles.includes("STAFF")
    );
  }, [state.roles]);

  return {
    ...state,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isStaff,
  };
}

// HOC for permission-gated components
interface PermissionGateProps {
  permission?: PermissionCode;
  permissions?: PermissionCode[];
  requireAll?: boolean;
  role?: RoleName;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isLoading } =
    usePermissions();

  if (isLoading) {
    return null;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions) {
    if (requireAll && !hasAllPermissions(permissions)) {
      return <>{fallback}</>;
    }
    if (!requireAll && !hasAnyPermission(permissions)) {
      return <>{fallback}</>;
    }
  }

  // Check role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
