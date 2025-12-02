import { db } from "@/lib/db";

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "VIEW"
  | "EXPORT"
  | "ASSIGN"
  | "STATUS_CHANGE"
  | "PERMISSION_CHANGE";

type EntityType =
  | "User"
  | "Service"
  | "ServiceRequest"
  | "Subscription"
  | "Role"
  | "Permission"
  | "Invoice"
  | "Document"
  | "ChatSession"
  | "GeneratedDocument"
  | "SiteConfig";

interface AuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entityType: EntityType;
  entityId?: string | null;
  oldValue?: object | null;
  newValue?: object | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: object | null;
}

export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  oldValue,
  newValue,
  ipAddress,
  userAgent,
  metadata,
}: AuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        ipAddress,
        userAgent,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw - audit logging should not break main operations
    return null;
  }
}

// Helper to get request metadata
export function getRequestMetadata(request: Request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}

// Convenience functions for common audit actions
export const audit = {
  async userCreated(userId: string, newUser: object, adminId?: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId: adminId,
      action: "CREATE",
      entityType: "User",
      entityId: userId,
      newValue: newUser,
      ...meta,
    });
  },

  async userUpdated(
    userId: string,
    oldValue: object,
    newValue: object,
    adminId?: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId: adminId || userId,
      action: "UPDATE",
      entityType: "User",
      entityId: userId,
      oldValue,
      newValue,
      ...meta,
    });
  },

  async userDeleted(userId: string, oldValue: object, adminId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId: adminId,
      action: "DELETE",
      entityType: "User",
      entityId: userId,
      oldValue,
      ...meta,
    });
  },

  async userLogin(userId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "LOGIN",
      entityType: "User",
      entityId: userId,
      ...meta,
    });
  },

  async userLogout(userId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "LOGOUT",
      entityType: "User",
      entityId: userId,
      ...meta,
    });
  },

  async serviceCreated(serviceId: string, service: object, userId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "CREATE",
      entityType: "Service",
      entityId: serviceId,
      newValue: service,
      ...meta,
    });
  },

  async serviceUpdated(
    serviceId: string,
    oldValue: object,
    newValue: object,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "UPDATE",
      entityType: "Service",
      entityId: serviceId,
      oldValue,
      newValue,
      ...meta,
    });
  },

  async serviceDeleted(serviceId: string, oldValue: object, userId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "DELETE",
      entityType: "Service",
      entityId: serviceId,
      oldValue,
      ...meta,
    });
  },

  async requestCreated(requestId: string, request: object, userId: string, req?: Request) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "CREATE",
      entityType: "ServiceRequest",
      entityId: requestId,
      newValue: request,
      ...meta,
    });
  },

  async requestUpdated(
    requestId: string,
    oldValue: object,
    newValue: object,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "UPDATE",
      entityType: "ServiceRequest",
      entityId: requestId,
      oldValue,
      newValue,
      ...meta,
    });
  },

  async requestStatusChanged(
    requestId: string,
    oldStatus: string,
    newStatus: string,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "STATUS_CHANGE",
      entityType: "ServiceRequest",
      entityId: requestId,
      oldValue: { status: oldStatus },
      newValue: { status: newStatus },
      ...meta,
    });
  },

  async requestAssigned(
    requestId: string,
    assignedTo: string,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "ASSIGN",
      entityType: "ServiceRequest",
      entityId: requestId,
      newValue: { assignedTo },
      ...meta,
    });
  },

  async roleAssigned(
    userId: string,
    roleName: string,
    adminId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId: adminId,
      action: "PERMISSION_CHANGE",
      entityType: "User",
      entityId: userId,
      newValue: { roleAssigned: roleName },
      ...meta,
    });
  },

  async roleRemoved(
    userId: string,
    roleName: string,
    adminId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId: adminId,
      action: "PERMISSION_CHANGE",
      entityType: "User",
      entityId: userId,
      oldValue: { roleRemoved: roleName },
      ...meta,
    });
  },

  async subscriptionCreated(
    subscriptionId: string,
    subscription: object,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "CREATE",
      entityType: "Subscription",
      entityId: subscriptionId,
      newValue: subscription,
      ...meta,
    });
  },

  async subscriptionUpdated(
    subscriptionId: string,
    oldValue: object,
    newValue: object,
    userId: string,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "UPDATE",
      entityType: "Subscription",
      entityId: subscriptionId,
      oldValue,
      newValue,
      ...meta,
    });
  },

  async dataExported(
    entityType: EntityType,
    userId: string,
    metadata?: object,
    req?: Request
  ) {
    const meta = req ? getRequestMetadata(req) : {};
    return createAuditLog({
      userId,
      action: "EXPORT",
      entityType,
      metadata,
      ...meta,
    });
  },
};
