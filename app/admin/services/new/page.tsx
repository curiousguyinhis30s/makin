"use client";

import { ServiceForm } from "@/components/admin/ServiceForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/services"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground">
            Add a new service to your platform
          </p>
        </div>
      </div>

      <ServiceForm mode="create" />
    </div>
  );
}
