import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

// GET single service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = await db.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true, requests: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Parse JSON fields
    const formattedService = {
      ...service,
      title: JSON.parse(service.title),
      description: JSON.parse(service.description),
      features: JSON.parse(service.features),
    };

    return NextResponse.json(formattedService);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Get existing service for audit
    const existing = await db.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check if slug is being changed and if it conflicts
    if (body.slug !== existing.slug) {
      const slugExists = await db.service.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A service with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const service = await db.service.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        price: body.price,
        features: body.features,
        icon: body.icon,
        category: body.category,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    });

    // Audit log
    await audit.serviceUpdated(
      service.id,
      {
        slug: existing.slug,
        title: JSON.parse(existing.title),
        price: existing.price,
        category: existing.category,
      },
      {
        slug: service.slug,
        title: JSON.parse(service.title),
        price: service.price,
        category: service.category,
      },
      session.user.id,
      request
    );

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get service for audit before deletion
    const existing = await db.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true, requests: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check for active subscriptions
    if (existing._count.subscriptions > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete service with active subscriptions",
          subscriptions: existing._count.subscriptions,
        },
        { status: 400 }
      );
    }

    await db.service.delete({
      where: { id },
    });

    // Audit log
    await audit.serviceDeleted(
      id,
      {
        slug: existing.slug,
        title: JSON.parse(existing.title),
        price: existing.price,
        category: existing.category,
      },
      session.user.id,
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
