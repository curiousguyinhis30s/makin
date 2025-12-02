"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/lib/use-auth";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useDemo } from "@/lib/demo-context";

export default function CheckoutPage({ params }: { params: { planId: string } }) {
    const router = useRouter();
    const { data: session } = useSafeSession();
    const { isDemoMode, demoUser, enableDemoMode } = useDemo();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    // Plan details
    const planDetails: Record<string, { name: string; price: string; period: string }> = {
        starter: { name: "Starter", price: "2,500", period: "month" },
        professional: { name: "Professional", price: "5,000", period: "month" },
        enterprise: { name: "Enterprise", price: "Custom", period: "month" },
    };

    const plan = planDetails[params.planId] || planDetails.starter;
    const priceNum = parseInt(plan.price.replace(",", "")) || 5000;
    const tax = Math.round(priceNum * 0.15);
    const total = priceNum + tax;

    // Auto-fill demo data
    const fillDemoData = () => {
        setFormData({
            name: "Ahmed Al-Rashid",
            cardNumber: "4242 4242 4242 4242",
            expiry: "12/28",
            cvc: "123",
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Enable demo mode if not already enabled
        if (!isDemoMode) {
            enableDemoMode("USER");
        }

        // Redirect to success page
        router.push(`/checkout/success?plan=${plan.name}`);
    };

    // Check if user is authenticated via session or demo mode
    const isAuthenticated = session || isDemoMode;
    const userName = session?.user?.name || demoUser?.name || "";

    // If not authenticated, show option to continue as demo or login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="bg-card border border-border rounded-3xl p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
                        <p className="text-muted-foreground mb-6">
                            Please sign in to continue with your {plan.name} subscription.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href={`/login?callbackUrl=/checkout/${params.planId}`}
                                className="btn-primary w-full inline-flex items-center justify-center"
                            >
                                Sign In to Continue
                            </Link>

                            <button
                                onClick={() => {
                                    enableDemoMode("USER");
                                    router.refresh();
                                }}
                                className="w-full py-3 px-4 border border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/10 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Try Demo Mode
                            </button>

                            <Link
                                href="/"
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-24">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-2xl p-8"
                >
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("checkout.cancel")}
                    </Link>

                    <h2 className="text-2xl font-bold text-foreground mb-6">{t("checkout.summary")}</h2>

                    {isDemoMode && (
                        <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">Demo Mode Active</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border mb-6">
                        <div>
                            <h3 className="font-bold text-foreground">{plan.name} {t("checkout.plan")}</h3>
                            <p className="text-sm text-muted-foreground">{t("checkout.monthly")}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-primary">SAR {plan.price}</p>
                            <p className="text-xs text-muted-foreground">/ {plan.period}</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>{t("checkout.subtotal")}</span>
                            <span>SAR {plan.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("checkout.tax")}</span>
                            <span>SAR {tax.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-lg">
                            <span>{t("checkout.total")}</span>
                            <span>SAR {total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="font-medium text-foreground mb-4">What's Included:</h4>
                        <ul className="space-y-2">
                            {["Full HR Management", "Government Relations", "Dedicated Account Manager", "24/7 Support"].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Payment Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-2xl p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">{t("checkout.paymentDetails")}</h2>
                        <Lock className="w-5 h-5 text-green-500" />
                    </div>

                    {/* Demo Auto-fill Button */}
                    <button
                        onClick={fillDemoData}
                        className="w-full mb-6 py-2 px-4 border border-dashed border-primary/30 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Auto-fill Demo Card
                    </button>

                    <form onSubmit={handleCheckout} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                {t("checkout.cardholder")}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder={userName || "Ahmed Al-Rashid"}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                {t("checkout.cardNumber")}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.cardNumber}
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors pl-12"
                                    placeholder="4242 4242 4242 4242"
                                />
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    {t("checkout.expiry")}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.expiry}
                                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    {t("checkout.cvc")}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.cvc}
                                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t("checkout.processing")}
                                </>
                            ) : (
                                <>
                                    {t("checkout.confirm")}
                                    <Check className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-muted-foreground">
                            By clicking confirm, you agree to our Terms of Service and Privacy Policy.
                            This is a demo transaction - no actual payment will be processed.
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
