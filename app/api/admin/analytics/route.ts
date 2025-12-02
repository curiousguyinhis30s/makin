import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for efficiency
    const [
      totalUsers,
      newUsersThisMonth,
      totalRequests,
      requestsThisMonth,
      pendingRequests,
      completedRequests,
      totalSubscriptions,
      activeSubscriptions,
      requestsByStatus,
      requestsByType,
      recentRequests,
      userGrowth,
    ] = await Promise.all([
      // Total users
      db.user.count(),

      // New users this month
      db.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Total requests
      db.serviceRequest.count(),

      // Requests this month
      db.serviceRequest.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Pending requests
      db.serviceRequest.count({
        where: { status: "PENDING" },
      }),

      // Completed requests
      db.serviceRequest.count({
        where: { status: "COMPLETED" },
      }),

      // Total subscriptions
      db.subscription.count(),

      // Active subscriptions
      db.subscription.count({
        where: { status: "ACTIVE" },
      }),

      // Requests by status
      db.serviceRequest.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Requests by type
      db.serviceRequest.groupBy({
        by: ["type"],
        _count: true,
      }),

      // Recent requests (last 7 days)
      db.serviceRequest.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: {
          id: true,
          title: true,
          status: true,
          type: true,
          createdAt: true,
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // User growth (last 30 days)
      db.$queryRaw`
        SELECT
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM User
        WHERE createdAt >= ${thirtyDaysAgo}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ]);

    // Format data for charts
    const statusData = requestsByStatus.map((item) => ({
      name: item.status,
      value: item._count,
    }));

    const typeData = requestsByType.map((item) => ({
      name: item.type,
      value: item._count,
    }));

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsersThisMonth,
        totalRequests,
        requestsThisMonth,
        pendingRequests,
        completedRequests,
        totalSubscriptions,
        activeSubscriptions,
      },
      charts: {
        requestsByStatus: statusData,
        requestsByType: typeData,
        userGrowth,
      },
      recentRequests,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
