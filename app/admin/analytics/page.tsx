"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  SimpleBarChart,
  SimplePieChart,
  SimpleLineChart,
} from "@/components/admin/charts/SimpleCharts";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    newUsersThisMonth: number;
    totalRequests: number;
    requestsThisMonth: number;
    pendingRequests: number;
    completedRequests: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
  };
  charts: {
    requestsByStatus: Array<{ name: string; value: number }>;
    requestsByType: Array<{ name: string; value: number }>;
    userGrowth: Array<{ date: string; count: number }>;
  };
  recentRequests: Array<{
    id: string;
    title: string;
    status: string;
    type: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500",
  UNDER_REVIEW: "bg-purple-500/10 text-purple-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-red-500/10 text-red-500",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
        Failed to load analytics data
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: data.overview.totalUsers,
      change: `+${data.overview.newUsersThisMonth} this month`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Requests",
      value: data.overview.totalRequests,
      change: `+${data.overview.requestsThisMonth} this month`,
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Pending Requests",
      value: data.overview.pendingRequests,
      change: "Awaiting action",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Active Subscriptions",
      value: data.overview.activeSubscriptions,
      change: `${data.overview.totalSubscriptions} total`,
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Requests by Status</h3>
          {data.charts.requestsByStatus.length > 0 ? (
            <SimplePieChart data={data.charts.requestsByStatus} height={250} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>

        {/* Requests by Type */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Requests by Service Type</h3>
          {data.charts.requestsByType.length > 0 ? (
            <SimpleBarChart data={data.charts.requestsByType} height={250} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">User Growth (Last 30 Days)</h3>
        {data.charts.userGrowth && data.charts.userGrowth.length > 0 ? (
          <SimpleLineChart data={data.charts.userGrowth} height={300} />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </div>

      {/* Recent Requests */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Requests</h3>
        {data.recentRequests.length > 0 ? (
          <div className="space-y-3">
            {data.recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{request.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.user.name || request.user.email} •{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-full">
                    {request.type}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      STATUS_COLORS[request.status] || "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent requests
          </div>
        )}
      </div>
    </div>
  );
}
