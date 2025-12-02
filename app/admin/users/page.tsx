"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Shield,
  User,
  Building,
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  company: string | null;
  createdAt: string;
  userRoles: Array<{
    role: {
      name: string;
      displayName: string;
    };
  }>;
  _count: {
    subscriptions: number;
    serviceRequests: number;
  };
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  STAFF: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CUSTOMER: "bg-green-500/10 text-green-500 border-green-500/20",
  SUPER_ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (value: string, row: UserData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{value || "No name"}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: string, row: UserData) => {
        const roles = row.userRoles.length > 0
          ? row.userRoles.map(ur => ur.role.displayName).join(", ")
          : value;
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${ROLE_COLORS[value] || ROLE_COLORS.CUSTOMER}`}>
            {roles}
          </span>
        );
      },
    },
    {
      key: "company",
      label: "Company",
      sortable: true,
      render: (value: string | null) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          {value ? (
            <>
              <Building className="w-4 h-4" />
              {value}
            </>
          ) : (
            <span className="text-muted-foreground/50">—</span>
          )}
        </div>
      ),
    },
    {
      key: "_count.serviceRequests",
      label: "Requests",
      sortable: false,
      render: (_: any, row: UserData) => (
        <span className="text-muted-foreground">
          {row._count.serviceRequests}
        </span>
      ),
    },
    {
      key: "_count.subscriptions",
      label: "Subscriptions",
      sortable: false,
      render: (_: any, row: UserData) => (
        <span className="text-muted-foreground">
          {row._count.subscriptions}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (value: string) => (
        <span className="text-muted-foreground text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: UserData) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users/${row.id}`}
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
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and roles
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      <DataTable
        data={users}
        columns={columns}
        rowKey="id"
        searchable
        searchKeys={["name", "email", "company"]}
        searchPlaceholder="Search users..."
        isLoading={isLoading}
        emptyMessage="No users found"
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
      />
    </div>
  );
}
