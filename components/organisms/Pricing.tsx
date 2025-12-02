"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";

export default function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            id: "starter",
            name: t("pricing.starter.title"),
            price: "2,500",
            description: t("pricing.starter.desc"),
            features: [
                t("pricing.starter.f1"),
                t("pricing.starter.f2"),
                t("pricing.starter.f3"),
                t("pricing.starter.f4"),
            ],
            highlighted: false,
        },
        {
            id: "professional",
            name: t("pricing.pro.title"),
            price: "5,000",
            description: t("pricing.pro.desc"),
            features: [
                t("pricing.pro.f1"),
                t("pricing.pro.f2"),
                t("pricing.pro.f3"),
                t("pricing.pro.f4"),
                t("pricing.pro.f5"),
            ],
            highlighted: true,
        },
        {
            id: "enterprise",
            name: t("pricing.enterprise.title"),
            price: t("pricing.custom"),
            description: t("pricing.enterprise.desc"),
            features: [
                t("pricing.enterprise.f1"),
                t("pricing.enterprise.f2"),
                t("pricing.enterprise.f3"),
                t("pricing.enterprise.f4"),
                t("pricing.enterprise.f5"),
            ],
            highlighted: false,
        },
    ];

    return (
        <section id="pricing" className="py-12 md:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                        {t("pricing.title")}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("pricing.subtitle")}
                    </p>
                </div>

                {/* Mobile: Horizontal Scroll / Desktop: Grid */}
                <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 gap-4 -mx-6 px-6 scrollbar-hide">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`snap-center flex-shrink-0 w-[85vw] relative rounded-2xl p-6 border transition-all ${plan.highlighted
                                ? "bg-card border-primary shadow-2xl shadow-primary/10"
                                : "bg-background border-border hover:border-primary/30"
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                                    {t("pricing.popular")}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">/ {t("pricing.month")}</span>
                                </div>
                                <p className="text-muted-foreground mt-3 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={`/checkout/${plan.id}`} className="block w-full">
                                <button
                                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${plan.highlighted
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                                        : "bg-secondary/50 text-foreground hover:bg-secondary border border-border"
                                        }`}
                                >
                                    {t("pricing.getStarted")}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop Grid View */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-3xl border transition-all flex flex-col group cursor-pointer ${plan.highlighted
                                ? "bg-card border-primary shadow-2xl shadow-primary/10 scale-105 z-10"
                                : "bg-background border-border hover:border-primary/50 hover:shadow-lg"
                                }`}
                        >
                            <Link href={`/checkout/${plan.id}`} className="flex flex-col h-full p-6">
                                {plan.highlighted && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                        {t("pricing.popular")}
                                    </div>
                                )}

                                <div className="text-center mb-8 flex-grow">
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">/ {t("pricing.month")}</span>
                                    </div>
                                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-muted-foreground/90 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto w-full">
                                    <div
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all shadow-md ${plan.highlighted
                                            ? "bg-primary text-primary-foreground group-hover:bg-primary/90 group-hover:shadow-primary/20"
                                            : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                                            }`}
                                    >
                                        {t("pricing.getStarted")}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
