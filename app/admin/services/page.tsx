"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";

interface Service {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  category: string;
  isActive: boolean;
  sortOrder: number;
  features: string[];
  _count: {
    subscriptions: number;
    requests: number;
  };
  createdAt: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "title.en",
      label: "Service",
      sortable: true,
      render: (value: string, row: Service) => (
        <div>
          <div className="font-medium">{row.title.en}</div>
          <div className="text-xs text-muted-foreground">{row.slug}</div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">
          {value.toLocaleString()} SAR
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (value: boolean) =>
        value ? (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500">
            <XCircle className="w-4 h-4" />
            Inactive
          </span>
        ),
    },
    {
      key: "_count.subscriptions",
      label: "Subscriptions",
      sortable: false,
      render: (_: any, row: Service) => (
        <span className="text-muted-foreground">
          {row._count?.subscriptions || 0}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Service) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/services/${row.id}/edit`}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            disabled={deleteId === row.id}
            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleteId === row.id ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your business services
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      <DataTable
        data={services}
        columns={columns}
        rowKey="id"
        searchable
        searchKeys={["title.en" as keyof Service, "slug", "category"]}
        searchPlaceholder="Search services..."
        isLoading={isLoading}
        emptyMessage="No services found"
        onRowClick={(row) => router.push(`/admin/services/${row.id}/edit`)}
      />
    </div>
  );
}
