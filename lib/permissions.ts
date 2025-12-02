// Permission Constants for RBAC System

export const PERMISSION_CATEGORIES = {
  SERVICES: 'services',
  USERS: 'users',
  REQUESTS: 'requests',
  SUBSCRIPTIONS: 'subscriptions',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  AI: 'ai',
  AUDIT: 'audit',
  NOTIFICATIONS: 'notifications',
} as const;

export const PERMISSIONS = {
  // Services
  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_UPDATE: 'services.update',
  SERVICES_DELETE: 'services.delete',

  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_ROLES: 'users.manage_roles',

  // Requests
  REQUESTS_VIEW_OWN: 'requests.view_own',
  REQUESTS_VIEW_ALL: 'requests.view_all',
  REQUESTS_CREATE: 'requests.create',
  REQUESTS_UPDATE_OWN: 'requests.update_own',
  REQUESTS_UPDATE_ALL: 'requests.update_all',
  REQUESTS_DELETE: 'requests.delete',
  REQUESTS_ASSIGN: 'requests.assign',
  REQUESTS_CHANGE_STATUS: 'requests.change_status',

  // Subscriptions
  SUBSCRIPTIONS_VIEW_OWN: 'subscriptions.view_own',
  SUBSCRIPTIONS_VIEW_ALL: 'subscriptions.view_all',
  SUBSCRIPTIONS_CREATE: 'subscriptions.create',
  SUBSCRIPTIONS_UPDATE: 'subscriptions.update',
  SUBSCRIPTIONS_CANCEL: 'subscriptions.cancel',

  // Analytics
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_MANAGE_ROLES: 'settings.manage_roles',

  // AI Features
  AI_CHAT: 'ai.chat',
  AI_RESUME: 'ai.resume',
  AI_DOCUMENTS: 'ai.documents',

  // Audit
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',

  // Notifications
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_MANAGE: 'notifications.manage',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role definitions with their default permissions
export const ROLE_DEFINITIONS = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    permissions: Object.values(PERMISSIONS),
  },
  ADMIN: {
    name: 'ADMIN',
    displayName: 'Administrator',
    description: 'Administrative access excluding critical system settings',
    isSystem: true,
    permissions: [
      PERMISSIONS.SERVICES_VIEW,
      PERMISSIONS.SERVICES_CREATE,
      PERMISSIONS.SERVICES_UPDATE,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_MANAGE_ROLES,
      PERMISSIONS.REQUESTS_VIEW_ALL,
      PERMISSIONS.REQUESTS_UPDATE_ALL,
      PERMISSIONS.REQUESTS_ASSIGN,
      PERMISSIONS.REQUESTS_CHANGE_STATUS,
      PERMISSIONS.SUBSCRIPTIONS_VIEW_ALL,
      PERMISSIONS.SUBSCRIPTIONS_CREATE,
      PERMISSIONS.SUBSCRIPTIONS_UPDATE,
      PERMISSIONS.SUBSCRIPTIONS_CANCEL,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.ANALYTICS_EXPORT,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.AI_CHAT,
      PERMISSIONS.AI_RESUME,
      PERMISSIONS.AI_DOCUMENTS,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.NOTIFICATIONS_VIEW,
      PERMISSIONS.NOTIFICATIONS_MANAGE,
    ],
  },
  STAFF: {
    name: 'STAFF',
    displayName: 'Staff Member',
    description: 'Can view and manage assigned requests',
    isSystem: true,
    permissions: [
      PERMISSIONS.SERVICES_VIEW,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.REQUESTS_VIEW_ALL,
      PERMISSIONS.REQUESTS_UPDATE_ALL,
      PERMISSIONS.REQUESTS_CHANGE_STATUS,
      PERMISSIONS.SUBSCRIPTIONS_VIEW_ALL,
      PERMISSIONS.AI_CHAT,
      PERMISSIONS.AI_RESUME,
      PERMISSIONS.AI_DOCUMENTS,
      PERMISSIONS.NOTIFICATIONS_VIEW,
    ],
  },
  CUSTOMER: {
    name: 'CUSTOMER',
    displayName: 'Customer',
    description: 'Standard customer access',
    isSystem: true,
    permissions: [
      PERMISSIONS.SERVICES_VIEW,
      PERMISSIONS.REQUESTS_VIEW_OWN,
      PERMISSIONS.REQUESTS_CREATE,
      PERMISSIONS.REQUESTS_UPDATE_OWN,
      PERMISSIONS.SUBSCRIPTIONS_VIEW_OWN,
      PERMISSIONS.AI_CHAT,
      PERMISSIONS.AI_RESUME,
      PERMISSIONS.AI_DOCUMENTS,
      PERMISSIONS.NOTIFICATIONS_VIEW,
    ],
  },
} as const;

export type RoleName = keyof typeof ROLE_DEFINITIONS;

// Permission metadata for UI display
export const PERMISSION_METADATA: Record<PermissionCode, {
  displayName: string;
  description: string;
  category: string;
}> = {
  [PERMISSIONS.SERVICES_VIEW]: {
    displayName: 'View Services',
    description: 'Can view all available services',
    category: PERMISSION_CATEGORIES.SERVICES,
  },
  [PERMISSIONS.SERVICES_CREATE]: {
    displayName: 'Create Services',
    description: 'Can create new services',
    category: PERMISSION_CATEGORIES.SERVICES,
  },
  [PERMISSIONS.SERVICES_UPDATE]: {
    displayName: 'Update Services',
    description: 'Can modify existing services',
    category: PERMISSION_CATEGORIES.SERVICES,
  },
  [PERMISSIONS.SERVICES_DELETE]: {
    displayName: 'Delete Services',
    description: 'Can delete services',
    category: PERMISSION_CATEGORIES.SERVICES,
  },
  [PERMISSIONS.USERS_VIEW]: {
    displayName: 'View Users',
    description: 'Can view user profiles',
    category: PERMISSION_CATEGORIES.USERS,
  },
  [PERMISSIONS.USERS_CREATE]: {
    displayName: 'Create Users',
    description: 'Can create new users',
    category: PERMISSION_CATEGORIES.USERS,
  },
  [PERMISSIONS.USERS_UPDATE]: {
    displayName: 'Update Users',
    description: 'Can modify user profiles',
    category: PERMISSION_CATEGORIES.USERS,
  },
  [PERMISSIONS.USERS_DELETE]: {
    displayName: 'Delete Users',
    description: 'Can delete users',
    category: PERMISSION_CATEGORIES.USERS,
  },
  [PERMISSIONS.USERS_MANAGE_ROLES]: {
    displayName: 'Manage User Roles',
    description: 'Can assign and remove roles from users',
    category: PERMISSION_CATEGORIES.USERS,
  },
  [PERMISSIONS.REQUESTS_VIEW_OWN]: {
    displayName: 'View Own Requests',
    description: 'Can view own service requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_VIEW_ALL]: {
    displayName: 'View All Requests',
    description: 'Can view all service requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_CREATE]: {
    displayName: 'Create Requests',
    description: 'Can create new service requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_UPDATE_OWN]: {
    displayName: 'Update Own Requests',
    description: 'Can update own service requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_UPDATE_ALL]: {
    displayName: 'Update All Requests',
    description: 'Can update any service request',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_DELETE]: {
    displayName: 'Delete Requests',
    description: 'Can delete service requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_ASSIGN]: {
    displayName: 'Assign Requests',
    description: 'Can assign requests to staff members',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.REQUESTS_CHANGE_STATUS]: {
    displayName: 'Change Request Status',
    description: 'Can change the status of requests',
    category: PERMISSION_CATEGORIES.REQUESTS,
  },
  [PERMISSIONS.SUBSCRIPTIONS_VIEW_OWN]: {
    displayName: 'View Own Subscriptions',
    description: 'Can view own subscriptions',
    category: PERMISSION_CATEGORIES.SUBSCRIPTIONS,
  },
  [PERMISSIONS.SUBSCRIPTIONS_VIEW_ALL]: {
    displayName: 'View All Subscriptions',
    description: 'Can view all subscriptions',
    category: PERMISSION_CATEGORIES.SUBSCRIPTIONS,
  },
  [PERMISSIONS.SUBSCRIPTIONS_CREATE]: {
    displayName: 'Create Subscriptions',
    description: 'Can create new subscriptions',
    category: PERMISSION_CATEGORIES.SUBSCRIPTIONS,
  },
  [PERMISSIONS.SUBSCRIPTIONS_UPDATE]: {
    displayName: 'Update Subscriptions',
    description: 'Can modify subscriptions',
    category: PERMISSION_CATEGORIES.SUBSCRIPTIONS,
  },
  [PERMISSIONS.SUBSCRIPTIONS_CANCEL]: {
    displayName: 'Cancel Subscriptions',
    description: 'Can cancel subscriptions',
    category: PERMISSION_CATEGORIES.SUBSCRIPTIONS,
  },
  [PERMISSIONS.ANALYTICS_VIEW]: {
    displayName: 'View Analytics',
    description: 'Can view analytics dashboards',
    category: PERMISSION_CATEGORIES.ANALYTICS,
  },
  [PERMISSIONS.ANALYTICS_EXPORT]: {
    displayName: 'Export Analytics',
    description: 'Can export analytics data',
    category: PERMISSION_CATEGORIES.ANALYTICS,
  },
  [PERMISSIONS.SETTINGS_VIEW]: {
    displayName: 'View Settings',
    description: 'Can view system settings',
    category: PERMISSION_CATEGORIES.SETTINGS,
  },
  [PERMISSIONS.SETTINGS_UPDATE]: {
    displayName: 'Update Settings',
    description: 'Can modify system settings',
    category: PERMISSION_CATEGORIES.SETTINGS,
  },
  [PERMISSIONS.SETTINGS_MANAGE_ROLES]: {
    displayName: 'Manage Roles',
    description: 'Can create and modify roles',
    category: PERMISSION_CATEGORIES.SETTINGS,
  },
  [PERMISSIONS.AI_CHAT]: {
    displayName: 'AI Chat',
    description: 'Can use AI chatbot',
    category: PERMISSION_CATEGORIES.AI,
  },
  [PERMISSIONS.AI_RESUME]: {
    displayName: 'AI Resume',
    description: 'Can use AI resume enhancement',
    category: PERMISSION_CATEGORIES.AI,
  },
  [PERMISSIONS.AI_DOCUMENTS]: {
    displayName: 'AI Documents',
    description: 'Can use AI document generation',
    category: PERMISSION_CATEGORIES.AI,
  },
  [PERMISSIONS.AUDIT_VIEW]: {
    displayName: 'View Audit Logs',
    description: 'Can view audit logs',
    category: PERMISSION_CATEGORIES.AUDIT,
  },
  [PERMISSIONS.AUDIT_EXPORT]: {
    displayName: 'Export Audit Logs',
    description: 'Can export audit logs',
    category: PERMISSION_CATEGORIES.AUDIT,
  },
  [PERMISSIONS.NOTIFICATIONS_VIEW]: {
    displayName: 'View Notifications',
    description: 'Can view notifications',
    category: PERMISSION_CATEGORIES.NOTIFICATIONS,
  },
  [PERMISSIONS.NOTIFICATIONS_MANAGE]: {
    displayName: 'Manage Notifications',
    description: 'Can manage notification settings',
    category: PERMISSION_CATEGORIES.NOTIFICATIONS,
  },
};
