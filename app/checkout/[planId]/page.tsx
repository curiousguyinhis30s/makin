"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function CheckoutPage({ params }: { params: { planId: string } }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    // Mock plan details based on ID (In real app, fetch from DB)
    const planDetails: any = {
        starter: { name: "Starter", price: "2,500", period: "month" },
        professional: { name: "Professional", price: "5,000", period: "month" },
        enterprise: { name: "Enterprise", price: "Custom", period: "month" },
    };

    const plan = planDetails[params.planId] || planDetails.starter;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: params.planId }),
            });

            if (!response.ok) throw new Error("Checkout failed");

            // Redirect to success/dashboard
            router.push("/dashboard?success=true");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        router.push(`/login?callbackUrl=/checkout/${params.planId}`);
        return null;
    }

    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-2xl p-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("checkout.cancel")}
                    </Link>

                    <h2 className="text-2xl font-bold text-foreground mb-6">{t("checkout.summary")}</h2>

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
                            <span>SAR {(parseInt(plan.price.replace(",", "")) * 0.15).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-lg">
                            <span>{t("checkout.total")}</span>
                            <span>SAR {(parseInt(plan.price.replace(",", "")) * 1.15).toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-2xl p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-foreground">{t("checkout.paymentDetails")}</h2>
                        <Lock className="w-5 h-5 text-green-500" />
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                {t("checkout.cardholder")}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="John Doe"
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
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors pl-12"
                                    placeholder="0000 0000 0000 0000"
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
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
