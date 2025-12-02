"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Users, Key, Loader2, Plus, Edit, CheckCircle } from "lucide-react";
import { ROLE_DEFINITIONS, PERMISSION_CATEGORIES } from "@/lib/permissions";

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  _count: {
    users: number;
    permissions: number;
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch("/api/admin/roles");
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          // If no roles in DB, show predefined roles
          const predefinedRoles = Object.entries(ROLE_DEFINITIONS).map(
            ([key, def]) => ({
              id: key,
              name: def.name,
              displayName: def.displayName,
              description: def.description,
              isSystem: def.isSystem,
              _count: {
                users: 0,
                permissions: def.permissions.length,
              },
            })
          );
          setRoles(predefinedRoles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        // Fallback to predefined roles
        const predefinedRoles = Object.entries(ROLE_DEFINITIONS).map(
          ([key, def]) => ({
            id: key,
            name: def.name,
            displayName: def.displayName,
            description: def.description,
            isSystem: def.isSystem,
            _count: {
              users: 0,
              permissions: def.permissions.length,
            },
          })
        );
        setRoles(predefinedRoles);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "border-red-500/30 bg-red-500/5",
    ADMIN: "border-purple-500/30 bg-purple-500/5",
    STAFF: "border-blue-500/30 bg-blue-500/5",
    CUSTOMER: "border-green-500/30 bg-green-500/5",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`bg-card border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
              roleColors[role.name] || "border-border"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{role.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{role.name}</p>
                </div>
              </div>
              {role.isSystem && (
                <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-full">
                  System
                </span>
              )}
            </div>

            {role.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {role.description}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{role._count.users} users</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Key className="w-4 h-4" />
                <span>{role._count.permissions} permissions</span>
              </div>
            </div>

            {/* Permission Categories Preview */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {Object.values(PERMISSION_CATEGORIES).slice(0, 5).map((category) => {
                const rolePermissions =
                  ROLE_DEFINITIONS[role.name as keyof typeof ROLE_DEFINITIONS]
                    ?.permissions || [];
                const hasCategory = rolePermissions.some((p) =>
                  p.startsWith(category)
                );
                return (
                  <span
                    key={category}
                    className={`px-2 py-0.5 text-xs rounded ${
                      hasCategory
                        ? "bg-green-500/10 text-green-500"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {hasCategory && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {category}
                  </span>
                );
              })}
            </div>

            <Link
              href={`/admin/roles/${role.id}/permissions`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Manage Permissions
            </Link>
          </div>
        ))}
      </div>

      {/* Permissions Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Permission Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(PERMISSION_CATEGORIES).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-secondary/30 rounded-lg text-center"
            >
              <div className="font-medium capitalize">{value}</div>
              <div className="text-sm text-muted-foreground">
                {value}.* permissions
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
