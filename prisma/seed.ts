import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive seed...\n");

  // Create passwords
  const customerPassword = await bcrypt.hash("Demo@123!", 12);
  const staffPassword = await bcrypt.hash("Staff@123!", 12);
  const adminPassword = await bcrypt.hash("Admin@123!", 12);
  const superAdminPassword = await bcrypt.hash("Super@123!", 12);

  // ============================================
  // STEP 1: Create Permissions
  // ============================================
  console.log("📝 Creating permissions...");

  const permissionData = [
    // Services
    { code: "services.view", category: "Services", displayName: "View Services" },
    { code: "services.create", category: "Services", displayName: "Create Services" },
    { code: "services.edit", category: "Services", displayName: "Edit Services" },
    { code: "services.delete", category: "Services", displayName: "Delete Services" },
    // Users
    { code: "users.view", category: "Users", displayName: "View Users" },
    { code: "users.create", category: "Users", displayName: "Create Users" },
    { code: "users.edit", category: "Users", displayName: "Edit Users" },
    { code: "users.delete", category: "Users", displayName: "Delete Users" },
    { code: "users.manage_roles", category: "Users", displayName: "Manage User Roles" },
    // Requests
    { code: "requests.view_own", category: "Requests", displayName: "View Own Requests" },
    { code: "requests.view_all", category: "Requests", displayName: "View All Requests" },
    { code: "requests.create", category: "Requests", displayName: "Create Requests" },
    { code: "requests.edit", category: "Requests", displayName: "Edit Requests" },
    { code: "requests.delete", category: "Requests", displayName: "Delete Requests" },
    { code: "requests.assign", category: "Requests", displayName: "Assign Requests" },
    // Analytics
    { code: "analytics.view", category: "Analytics", displayName: "View Analytics" },
    { code: "analytics.export", category: "Analytics", displayName: "Export Analytics" },
    // AI Features
    { code: "ai.chat", category: "AI", displayName: "Use AI Chat" },
    { code: "ai.resume", category: "AI", displayName: "Use Resume Builder" },
    { code: "ai.documents", category: "AI", displayName: "Generate Documents" },
    // Audit
    { code: "audit.view", category: "Audit", displayName: "View Audit Logs" },
    // Billing
    { code: "billing.view_own", category: "Billing", displayName: "View Own Billing" },
    { code: "billing.view_all", category: "Billing", displayName: "View All Billing" },
    { code: "billing.manage", category: "Billing", displayName: "Manage Billing" },
    // Settings
    { code: "settings.view", category: "Settings", displayName: "View Settings" },
    { code: "settings.edit", category: "Settings", displayName: "Edit Settings" },
  ];

  for (const perm of permissionData) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }
  console.log(`  ✓ Created ${permissionData.length} permissions`);

  // ============================================
  // STEP 2: Create Roles
  // ============================================
  console.log("👥 Creating roles...");

  const roles = [
    {
      name: "SUPER_ADMIN",
      displayName: "Super Admin",
      description: "Full system access with all permissions",
      isSystem: true,
      permissions: permissionData.map((p) => p.code),
    },
    {
      name: "ADMIN",
      displayName: "Admin",
      description: "Administrative access to manage most resources",
      isSystem: true,
      permissions: permissionData
        .filter((p) => !p.code.includes("delete") && p.code !== "users.manage_roles")
        .map((p) => p.code),
    },
    {
      name: "STAFF",
      displayName: "Staff",
      description: "Staff member with limited administrative access",
      isSystem: true,
      permissions: [
        "services.view",
        "users.view",
        "requests.view_all",
        "requests.edit",
        "requests.assign",
        "ai.chat",
        "ai.documents",
        "billing.view_all",
      ],
    },
    {
      name: "CUSTOMER",
      displayName: "Customer",
      description: "Regular customer with access to own resources",
      isSystem: true,
      permissions: [
        "services.view",
        "requests.view_own",
        "requests.create",
        "ai.chat",
        "ai.resume",
        "ai.documents",
        "billing.view_own",
      ],
    },
  ];

  for (const roleData of roles) {
    const { permissions: permCodes, ...roleInfo } = roleData;

    const role = await prisma.role.upsert({
      where: { name: roleInfo.name },
      update: roleInfo,
      create: roleInfo,
    });

    // Clear existing role permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    });

    // Add role permissions
    for (const code of permCodes) {
      const permission = await prisma.permission.findUnique({
        where: { code },
      });
      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }
  console.log(`  ✓ Created ${roles.length} roles with permissions`);

  // ============================================
  // STEP 3: Create Test Users
  // ============================================
  console.log("👤 Creating test users...");

  const users = [
    {
      id: "super-admin-id",
      email: "superadmin@makin.sa",
      name: "Super Admin",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      phone: "+966501234567",
      company: "Makin Business Services",
    },
    {
      id: "admin-user-id",
      email: "admin@makin.sa",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      phone: "+966502345678",
      company: "Makin Business Services",
    },
    {
      id: "staff-user-id",
      email: "staff@makin.sa",
      name: "Sarah Staff",
      password: staffPassword,
      role: "STAFF",
      phone: "+966503456789",
      company: "Makin Business Services",
    },
    {
      id: "demo-user-id",
      email: "demo@makin.sa",
      name: "Demo Customer",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+966504567890",
      company: "ABC Trading Company",
    },
    {
      id: "customer-2-id",
      email: "ahmed@example.sa",
      name: "Ahmed Al-Rashid",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+966505678901",
      company: "Rashid Enterprises",
    },
    {
      id: "customer-3-id",
      email: "fatima@example.sa",
      name: "Fatima Hassan",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+966506789012",
      company: "Hassan & Partners",
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        phone: userData.phone,
        company: userData.company,
        role: userData.role,
      },
      create: userData,
    });

    // Assign role to user
    const role = await prisma.role.findUnique({
      where: { name: userData.role },
    });

    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
          assignedBy: "system",
        },
      });
    }
  }
  console.log(`  ✓ Created ${users.length} users`);

  // ============================================
  // STEP 4: Create Services
  // ============================================
  console.log("📦 Creating services...");

  const services = [
    {
      slug: "hr-consultation",
      title: JSON.stringify({ en: "HR Consultation", ar: "استشارات الموارد البشرية" }),
      description: JSON.stringify({
        en: "Expert HR consulting services for your business",
        ar: "خدمات استشارات الموارد البشرية الخبيرة لعملك"
      }),
      category: "HR",
      price: 2500,
      features: JSON.stringify(["Policy Development", "Employee Relations", "Compliance Audit"]),
      icon: "Users",
      sortOrder: 1,
    },
    {
      slug: "visa-processing",
      title: JSON.stringify({ en: "Visa Processing", ar: "معالجة التأشيرات" }),
      description: JSON.stringify({
        en: "Complete visa processing and sponsorship services",
        ar: "خدمات معالجة التأشيرات والكفالة الكاملة"
      }),
      category: "HR",
      price: 1500,
      features: JSON.stringify(["Work Visa", "Family Visa", "Visit Visa", "Exit/Re-entry"]),
      icon: "Stamp",
      sortOrder: 2,
    },
    {
      slug: "payroll-management",
      title: JSON.stringify({ en: "Payroll Management", ar: "إدارة الرواتب" }),
      description: JSON.stringify({
        en: "Full payroll processing and management",
        ar: "معالجة وإدارة الرواتب الكاملة"
      }),
      category: "HR",
      price: 3000,
      features: JSON.stringify(["Salary Processing", "GOSI/Tax", "Bank Transfers", "Reports"]),
      icon: "Wallet",
      sortOrder: 3,
    },
    {
      slug: "commercial-license",
      title: JSON.stringify({ en: "Commercial License", ar: "الرخصة التجارية" }),
      description: JSON.stringify({
        en: "Business license application and renewal",
        ar: "طلب وتجديد الرخصة التجارية"
      }),
      category: "Government",
      price: 5000,
      features: JSON.stringify(["New Registration", "Renewal", "Amendment", "Cancellation"]),
      icon: "Building2",
      sortOrder: 4,
    },
    {
      slug: "ministry-registration",
      title: JSON.stringify({ en: "Ministry Registration", ar: "التسجيل في الوزارة" }),
      description: JSON.stringify({
        en: "Registration with government ministries",
        ar: "التسجيل لدى الوزارات الحكومية"
      }),
      category: "Government",
      price: 3500,
      features: JSON.stringify(["MOL", "MOFA", "MOI", "MOC"]),
      icon: "Shield",
      sortOrder: 5,
    },
    {
      slug: "municipal-permits",
      title: JSON.stringify({ en: "Municipal Permits", ar: "التصاريح البلدية" }),
      description: JSON.stringify({
        en: "Municipal permits and approvals",
        ar: "التصاريح والموافقات البلدية"
      }),
      category: "Government",
      price: 2000,
      features: JSON.stringify(["Signage Permit", "Health License", "Building Permit"]),
      icon: "FileCheck",
      sortOrder: 6,
    },
    {
      slug: "vat-registration",
      title: JSON.stringify({ en: "VAT Registration", ar: "التسجيل في ضريبة القيمة المضافة" }),
      description: JSON.stringify({
        en: "VAT registration and filing services",
        ar: "خدمات التسجيل والإيداع في ضريبة القيمة المضافة"
      }),
      category: "Accounting",
      price: 4000,
      features: JSON.stringify(["Registration", "Filing", "Compliance", "Refund Claims"]),
      icon: "Receipt",
      sortOrder: 7,
    },
    {
      slug: "financial-statements",
      title: JSON.stringify({ en: "Financial Statements", ar: "القوائم المالية" }),
      description: JSON.stringify({
        en: "Financial statement preparation and audit",
        ar: "إعداد القوائم المالية والتدقيق"
      }),
      category: "Accounting",
      price: 8000,
      features: JSON.stringify(["Balance Sheet", "Income Statement", "Cash Flow", "Audit Support"]),
      icon: "BarChart3",
      sortOrder: 8,
    },
    {
      slug: "zakat-calculation",
      title: JSON.stringify({ en: "Zakat Calculation", ar: "حساب الزكاة" }),
      description: JSON.stringify({
        en: "Zakat calculation and submission",
        ar: "حساب الزكاة وتقديمها"
      }),
      category: "Accounting",
      price: 3500,
      features: JSON.stringify(["Calculation", "Filing", "ZATCA Compliance"]),
      icon: "Calculator",
      sortOrder: 9,
    },
    {
      slug: "contract-drafting",
      title: JSON.stringify({ en: "Contract Drafting", ar: "صياغة العقود" }),
      description: JSON.stringify({
        en: "Legal contract drafting and review",
        ar: "صياغة ومراجعة العقود القانونية"
      }),
      category: "Legal",
      price: 2000,
      features: JSON.stringify(["Employment Contracts", "Commercial Contracts", "NDAs", "MOUs"]),
      icon: "FileText",
      sortOrder: 10,
    },
    {
      slug: "legal-consultation",
      title: JSON.stringify({ en: "Legal Consultation", ar: "الاستشارة القانونية" }),
      description: JSON.stringify({
        en: "Expert legal advice and consultation",
        ar: "الاستشارة والمشورة القانونية الخبيرة"
      }),
      category: "Legal",
      price: 500,
      features: JSON.stringify(["Corporate Law", "Labor Law", "Commercial Law"]),
      icon: "Scale",
      sortOrder: 11,
    },
    {
      slug: "company-formation",
      title: JSON.stringify({ en: "Company Formation", ar: "تأسيس الشركات" }),
      description: JSON.stringify({
        en: "Complete company formation services",
        ar: "خدمات تأسيس الشركات الكاملة"
      }),
      category: "Legal",
      price: 15000,
      features: JSON.stringify(["LLC Formation", "Branch Office", "Representative Office", "Joint Venture"]),
      icon: "Building",
      sortOrder: 12,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`  ✓ Created ${services.length} services`);

  // ============================================
  // STEP 5: Create Service Requests
  // ============================================
  console.log("📋 Creating service requests...");

  const requests = [
    {
      userId: "demo-user-id",
      type: "HR",
      subType: "Visa Processing",
      title: "Employee Visa Processing",
      description: "Need to process work visa for 3 new employees",
      status: "IN_PROGRESS",
      priority: "HIGH",
    },
    {
      userId: "demo-user-id",
      type: "Government",
      subType: "Commercial License",
      title: "Commercial License Renewal",
      description: "Annual renewal of commercial license CR-12345",
      status: "PENDING",
      priority: "NORMAL",
    },
    {
      userId: "demo-user-id",
      type: "Accounting",
      subType: "VAT Filing",
      title: "VAT Filing Q4 2023",
      description: "Quarterly VAT filing for Q4 2023",
      status: "COMPLETED",
      priority: "NORMAL",
    },
    {
      userId: "customer-2-id",
      type: "Legal",
      subType: "Contract Review",
      title: "Employment Contract Review",
      description: "Review and update standard employment contracts",
      status: "IN_PROGRESS",
      priority: "NORMAL",
    },
    {
      userId: "customer-2-id",
      type: "HR",
      subType: "Payroll Setup",
      title: "Payroll Setup",
      description: "Initial payroll system setup for 25 employees",
      status: "PENDING",
      priority: "HIGH",
    },
    {
      userId: "customer-3-id",
      type: "Government",
      subType: "Municipal Permit",
      title: "Municipal Permit Application",
      description: "New office location permit application",
      status: "IN_PROGRESS",
      priority: "NORMAL",
    },
    {
      userId: "customer-3-id",
      type: "Accounting",
      subType: "Audit Preparation",
      title: "Annual Audit Preparation",
      description: "Prepare documents for annual financial audit",
      status: "COMPLETED",
      priority: "HIGH",
    },
  ];

  for (const request of requests) {
    await prisma.serviceRequest.create({
      data: request,
    });
  }
  console.log(`  ✓ Created ${requests.length} service requests`);

  // ============================================
  // STEP 6: Create Notifications
  // ============================================
  console.log("🔔 Creating notifications...");

  const notifications = [
    {
      userId: "demo-user-id",
      type: "REQUEST_UPDATE",
      title: "Request Status Updated",
      message: "Your visa processing request has been moved to 'In Progress'",
      link: "/dashboard/requests",
      read: false,
    },
    {
      userId: "demo-user-id",
      type: "PAYMENT",
      title: "Invoice Generated",
      message: "A new invoice INV-2024-001 for SAR 2,500 has been generated",
      link: "/dashboard/billing",
      read: false,
    },
    {
      userId: "demo-user-id",
      type: "AI_COMPLETE",
      title: "Document Ready",
      message: "Your employment contract has been generated and is ready for download",
      link: "/dashboard/ai/documents",
      read: true,
    },
    {
      userId: "customer-2-id",
      type: "REQUEST_UPDATE",
      title: "Contract Review Complete",
      message: "Your employment contract review has been completed",
      link: "/dashboard/requests",
      read: false,
    },
    {
      userId: "customer-3-id",
      type: "REQUEST_UPDATE",
      title: "Permit Application Submitted",
      message: "Your municipal permit application has been submitted to the authorities",
      link: "/dashboard/requests",
      read: false,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    });
  }
  console.log(`  ✓ Created ${notifications.length} notifications`);

  // ============================================
  // STEP 7: Create Invoices
  // ============================================
  console.log("💳 Creating invoices...");

  const invoices = [
    {
      invoiceNumber: "INV-2024-001",
      userId: "demo-user-id",
      amount: 2500,
      tax: 375, // 15% VAT
      total: 2875,
      status: "PENDING",
      dueDate: new Date("2024-02-15"),
      items: [
        { description: "HR Consultation - January 2024", quantity: 1, unitPrice: 2500, total: 2500 },
      ],
    },
    {
      invoiceNumber: "INV-2024-002",
      userId: "demo-user-id",
      amount: 1500,
      tax: 225,
      total: 1725,
      status: "PAID",
      dueDate: new Date("2024-01-31"),
      paidAt: new Date("2024-01-28"),
      items: [
        { description: "Visa Processing (3 employees)", quantity: 3, unitPrice: 500, total: 1500 },
      ],
    },
    {
      invoiceNumber: "INV-2024-003",
      userId: "customer-2-id",
      amount: 5000,
      tax: 750,
      total: 5750,
      status: "PENDING",
      dueDate: new Date("2024-02-20"),
      items: [
        { description: "Commercial License Renewal", quantity: 1, unitPrice: 5000, total: 5000 },
      ],
    },
    {
      invoiceNumber: "INV-2024-004",
      userId: "customer-3-id",
      amount: 8000,
      tax: 1200,
      total: 9200,
      status: "PAID",
      dueDate: new Date("2024-01-15"),
      paidAt: new Date("2024-01-10"),
      items: [
        { description: "Annual Financial Statements", quantity: 1, unitPrice: 8000, total: 8000 },
      ],
    },
  ];

  for (const invoiceData of invoices) {
    const { items, ...invoice } = invoiceData;

    const createdInvoice = await prisma.invoice.create({
      data: invoice,
    });

    for (const item of items) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: createdInvoice.id,
          ...item,
        },
      });
    }
  }
  console.log(`  ✓ Created ${invoices.length} invoices`);

  // ============================================
  // STEP 8: Create Audit Logs
  // ============================================
  console.log("📊 Creating audit logs...");

  const auditLogs = [
    {
      userId: "admin-user-id",
      action: "USER_CREATED",
      entityType: "User",
      entityId: "demo-user-id",
      newValue: JSON.stringify({ email: "demo@makin.sa", name: "Demo Customer" }),
      ipAddress: "192.168.1.1",
    },
    {
      userId: "admin-user-id",
      action: "SERVICE_CREATED",
      entityType: "Service",
      entityId: "1",
      newValue: JSON.stringify({ name: "HR Consultation", price: 2500 }),
      ipAddress: "192.168.1.1",
    },
    {
      userId: "staff-user-id",
      action: "REQUEST_STATUS_CHANGED",
      entityType: "ServiceRequest",
      entityId: "1",
      oldValue: JSON.stringify({ status: "PENDING" }),
      newValue: JSON.stringify({ status: "IN_PROGRESS" }),
      ipAddress: "192.168.1.2",
    },
    {
      userId: "super-admin-id",
      action: "ROLE_ASSIGNED",
      entityType: "UserRole",
      entityId: "admin-user-id",
      newValue: JSON.stringify({ role: "ADMIN" }),
      ipAddress: "192.168.1.1",
    },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: log,
    });
  }
  console.log(`  ✓ Created ${auditLogs.length} audit logs`);

  // ============================================
  // DONE
  // ============================================
  console.log("\n✅ Seed completed successfully!\n");
  console.log("📋 Test Accounts:");
  console.log("─────────────────────────────────────");
  console.log("Super Admin: superadmin@makin.sa / Super@123!");
  console.log("Admin:       admin@makin.sa / Admin@123!");
  console.log("Staff:       staff@makin.sa / Staff@123!");
  console.log("Customer:    demo@makin.sa / Demo@123!");
  console.log("─────────────────────────────────────\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
