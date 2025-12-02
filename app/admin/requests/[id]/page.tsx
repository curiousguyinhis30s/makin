"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, FileText, Upload, MessageSquare, CheckCircle2, AlertCircle, Shield, User, CreditCard, Check, X } from "lucide-react";
import Link from "next/link";

export default function AdminRequestDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated") {
            if (session.user.role !== "ADMIN") {
                router.push("/dashboard");
                return;
            }
            if (id) fetchRequest();
        }
    }, [status, id, router, session]);

    const fetchRequest = async () => {
        try {
            const res = await fetch(`/api/requests/${id}`);
            if (res.ok) {
                const data = await res.json();
                setRequest(data);
            } else {
                router.push("/admin");
            }
        } catch (error) {
            console.error("Failed to fetch request", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchRequest();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("serviceRequestId", id);
        formData.append("type", "OFFICIAL_DOC"); // Admin uploads are official

        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                fetchRequest();
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    if (status === "loading" || isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-muted/10">Loading...</div>;
    }

    if (!request) return null;

    return (
        <div className="min-h-screen bg-muted/10 pb-20">
            <nav className="bg-background border-b border-border sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </Link>
                    <span className="text-lg font-bold text-foreground">Request Details (Admin)</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${request.status === "Completed" ? "bg-green-500/10 text-green-600" :
                                            request.status === "In Progress" ? "bg-blue-500/10 text-blue-600" :
                                                request.status === "Rejected" ? "bg-red-500/10 text-red-600" :
                                                    "bg-yellow-500/10 text-yellow-600"
                                            }`}>
                                            {request.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(request.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
                                    <p className="text-sm text-muted-foreground mt-1">Requested by: <span className="font-medium text-foreground">{request.user?.name}</span> ({request.user?.email})</p>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-muted-foreground border-t border-border pt-4 mt-4">
                                <p>{request.description}</p>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Documents
                                </h2>
                                <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-lg transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Upload className="w-3 h-3 mr-2" />
                                    {isUploading ? 'Uploading...' : 'Upload Official Doc'}
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>

                            {request.documents.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                                    <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {request.documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg border border-border">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[10px] text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                                        {doc.type === 'OFFICIAL_DOC' && <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded">Official</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-foreground mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatusUpdate('In Progress')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-xl font-medium transition-colors"
                                >
                                    <Clock className="w-4 h-4" /> Mark In Progress
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('Completed')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-xl font-medium transition-colors"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('Rejected')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                                >
                                    <X className="w-4 h-4" /> Reject Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
