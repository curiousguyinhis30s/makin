import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PermissionCode, PERMISSIONS, ROLE_DEFINITIONS, RoleName } from "@/lib/permissions";

// Get user's permissions from database
export async function getUserPermissions(userId: string): Promise<PermissionCode[]> {
  const userRoles = await db.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  const permissions = new Set<PermissionCode>();

  userRoles.forEach((userRole) => {
    userRole.role.permissions.forEach((rp) => {
      permissions.add(rp.permission.code as PermissionCode);
    });
  });

  return Array.from(permissions);
}

// Get user's roles from database
export async function getUserRoles(userId: string): Promise<string[]> {
  const userRoles = await db.userRole.findMany({
    where: { userId },
    include: { role: true },
  });

  return userRoles.map((ur) => ur.role.name);
}

// Check if user has a specific permission
export async function hasPermission(
  userId: string,
  permission: PermissionCode
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

// Check if user has any of the specified permissions
export async function hasAnyPermission(
  userId: string,
  permissions: PermissionCode[]
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return permissions.some((p) => userPermissions.includes(p));
}

// Check if user has all of the specified permissions
export async function hasAllPermissions(
  userId: string,
  permissions: PermissionCode[]
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return permissions.every((p) => userPermissions.includes(p));
}

// Check if user has a specific role
export async function hasRole(userId: string, role: RoleName): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
}

// Server-side permission check for API routes
export async function requirePermission(permission: PermissionCode) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const hasAccess = await hasPermission(session.user.id, permission);

  if (!hasAccess) {
    throw new Error("Forbidden");
  }

  return session;
}

// Server-side permission check for any of multiple permissions
export async function requireAnyPermission(permissions: PermissionCode[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const hasAccess = await hasAnyPermission(session.user.id, permissions);

  if (!hasAccess) {
    throw new Error("Forbidden");
  }

  return session;
}

// Server-side role check
export async function requireRole(role: RoleName) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const hasAccess = await hasRole(session.user.id, role);

  if (!hasAccess) {
    throw new Error("Forbidden");
  }

  return session;
}

// Get permissions for a specific role (from definitions)
export function getRolePermissions(roleName: RoleName): PermissionCode[] {
  const roleDefinition = ROLE_DEFINITIONS[roleName];
  return roleDefinition ? [...roleDefinition.permissions] : [];
}

// Assign a role to a user
export async function assignRole(
  userId: string,
  roleName: RoleName,
  assignedBy?: string
): Promise<void> {
  const role = await db.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  await db.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    create: {
      userId,
      roleId: role.id,
      assignedBy,
    },
    update: {},
  });
}

// Remove a role from a user
export async function removeRole(userId: string, roleName: RoleName): Promise<void> {
  const role = await db.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  await db.userRole.deleteMany({
    where: {
      userId,
      roleId: role.id,
    },
  });
}

// Check permission with fallback to legacy role field
export async function checkPermissionWithFallback(
  userId: string,
  permission: PermissionCode,
  legacyRole?: string
): Promise<boolean> {
  // First check RBAC permissions
  const hasRbacPermission = await hasPermission(userId, permission);
  if (hasRbacPermission) return true;

  // Fallback to legacy role check for backwards compatibility
  if (legacyRole) {
    const legacyRolePermissions = ROLE_DEFINITIONS[legacyRole as RoleName]?.permissions || [];
    return legacyRolePermissions.includes(permission);
  }

  return false;
}

// Utility to get all permissions grouped by category
export function getPermissionsByCategory(): Record<string, PermissionCode[]> {
  const grouped: Record<string, PermissionCode[]> = {};

  Object.entries(PERMISSIONS).forEach(([_, code]) => {
    const category = code.split('.')[0];
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(code);
  });

  return grouped;
}
