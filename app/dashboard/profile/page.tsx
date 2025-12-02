"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Bell,
    Lock,
    Globe,
    Save,
    Loader2,
    Camera,
    Shield,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useSafeSession } from "@/lib/use-auth";
import { useDemo } from "@/lib/demo-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/toast";
import { SkeletonProfile } from "@/components/ui/skeleton";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    language: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

export default function ProfilePage() {
    const { data: session, status: authStatus } = useSafeSession();
    const { isDemoMode, demoUser, isInitialized } = useDemo();
    const { t, language, setLanguage } = useLanguage();
    const router = useRouter();
    const { success, error: showError } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        language: "en",
        notifications: {
            email: true,
            sms: false,
            push: true,
        },
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const isAuthenticated = session || isDemoMode;
    const currentUser = isDemoMode ? demoUser : session?.user;

    useEffect(() => {
        if (authStatus === "loading" || !isInitialized) return;

        if (!isDemoMode && authStatus === "unauthenticated") {
            router.push("/login");
            return;
        }

        // Initialize profile with user data
        if (currentUser) {
            setProfile({
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: isDemoMode ? "+966 50 123 4567" : "",
                company: isDemoMode ? "Acme Corporation" : "",
                address: isDemoMode ? "Riyadh, Saudi Arabia" : "",
                language: language,
                notifications: {
                    email: true,
                    sms: false,
                    push: true,
                },
            });
        }
        setIsLoading(false);
    }, [authStatus, router, isDemoMode, currentUser, isInitialized, language]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            if (isDemoMode) {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                success("Profile updated", "Your profile has been saved successfully");
            } else {
                const res = await fetch("/api/user/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profile),
                });

                if (res.ok) {
                    success("Profile updated", "Your profile has been saved successfully");
                } else {
                    throw new Error("Failed to update profile");
                }
            }
        } catch (err) {
            showError("Failed to save", "Please try again later");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            showError("Passwords don't match", "Please make sure your new passwords match");
            return;
        }

        if (passwords.new.length < 8) {
            showError("Password too short", "Password must be at least 8 characters");
            return;
        }

        setIsSaving(true);
        try {
            if (isDemoMode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                success("Password changed", "Your password has been updated successfully");
                setPasswords({ current: "", new: "", confirm: "" });
            } else {
                const res = await fetch("/api/user/password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        currentPassword: passwords.current,
                        newPassword: passwords.new,
                    }),
                });

                if (res.ok) {
                    success("Password changed", "Your password has been updated successfully");
                    setPasswords({ current: "", new: "", confirm: "" });
                } else {
                    throw new Error("Failed to change password");
                }
            }
        } catch (err) {
            showError("Failed to change password", "Please check your current password");
        } finally {
            setIsSaving(false);
        }
    };

    if (authStatus === "loading" || isLoading || !isInitialized) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "Profile" }]} />
                </div>
                <SkeletonProfile />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb items={[{ label: "Profile & Settings" }]} />
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile & Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-2xl p-2 sticky top-24">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    activeTab === "profile"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab("notifications")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    activeTab === "notifications"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                            >
                                <Bell className="w-4 h-4" />
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    activeTab === "security"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                            >
                                <Lock className="w-4 h-4" />
                                Security
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-card border border-border rounded-2xl">
                                {/* Avatar Section */}
                                <div className="p-6 border-b border-border">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-2xl">
                                                {profile.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                                                <Camera className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">{profile.name}</h2>
                                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                                            {isDemoMode && (
                                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                                    <Shield className="w-3 h-3" />
                                                    {demoUser?.plan}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                placeholder="+966 50 123 4567"
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                <Building className="w-4 h-4 inline mr-2" />
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.company}
                                                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                                placeholder="Your company name"
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                            placeholder="City, Country"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            <Globe className="w-4 h-4 inline mr-2" />
                                            Preferred Language
                                        </label>
                                        <select
                                            value={profile.language}
                                            onChange={(e) => {
                                                setProfile({ ...profile, language: e.target.value });
                                                setLanguage(e.target.value as "en" | "ar");
                                            }}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        >
                                            <option value="en">English</option>
                                            <option value="ar">العربية (Arabic)</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-border">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-foreground">Email Notifications</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Receive updates about your requests via email
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.notifications.email}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        notifications: {
                                                            ...profile.notifications,
                                                            email: e.target.checked,
                                                        },
                                                    })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-foreground">SMS Notifications</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Get important updates via text message
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.notifications.sms}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        notifications: {
                                                            ...profile.notifications,
                                                            sms: e.target.checked,
                                                        },
                                                    })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-foreground">Push Notifications</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    In-app notifications for real-time updates
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.notifications.push}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        notifications: {
                                                            ...profile.notifications,
                                                            push: e.target.checked,
                                                        },
                                                    })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 mt-6 border-t border-border">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                {/* Password Change */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-6">Change Password</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) =>
                                                    setPasswords({ ...passwords, current: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) =>
                                                    setPasswords({ ...passwords, new: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) =>
                                                    setPasswords({ ...passwords, confirm: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 mt-4 border-t border-border">
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
                                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Lock className="w-4 h-4" />
                                            )}
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Two-Factor Auth */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground">Two-Factor Authentication</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-secondary transition-colors">
                                            Enable
                                        </button>
                                    </div>
                                </div>

                                {/* Active Sessions */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h2>
                                    <div className="p-4 bg-background border border-border rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-500/10 rounded-lg">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Current Session</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Started {new Date().toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
