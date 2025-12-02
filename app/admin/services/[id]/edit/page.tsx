"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface ServiceData {
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  features: string[];
  icon: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export default function EditServicePage() {
  const params = useParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(`/api/admin/services/${params.id}`);
        if (!response.ok) {
          throw new Error("Service not found");
        }
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Service Not Found</h1>
        </div>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error || "The requested service could not be found."}
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground">{service.title.en}</p>
        </div>
      </div>

      <ServiceForm
        mode="edit"
        serviceId={params.id as string}
        initialData={{
          slug: service.slug,
          titleEn: service.title.en,
          titleAr: service.title.ar,
          descriptionEn: service.description.en,
          descriptionAr: service.description.ar,
          price: Number(service.price),
          features: service.features,
          icon: service.icon || "briefcase",
          category: service.category || "HR",
          isActive: service.isActive,
          sortOrder: service.sortOrder,
        }}
      />
    </div>
  );
}
