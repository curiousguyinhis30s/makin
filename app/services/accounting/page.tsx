"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, FileText, PieChart, TrendingUp, Shield, CheckCircle2, Star, Receipt } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Calculator,
        title: "Bookkeeping",
        description: "Accurate daily transaction recording, account reconciliation, and financial record maintenance.",
    },
    {
        icon: Receipt,
        title: "ZATCA E-Invoicing",
        description: "Full compliance with Phase 2 e-invoicing requirements including QR codes and API integration.",
    },
    {
        icon: FileText,
        title: "VAT Management",
        description: "VAT registration, quarterly returns filing, and compliance with ZATCA regulations.",
    },
    {
        icon: PieChart,
        title: "Financial Reporting",
        description: "Monthly, quarterly, and annual financial statements prepared to IFRS standards.",
    },
    {
        icon: TrendingUp,
        title: "Financial Planning",
        description: "Budgeting, forecasting, and cash flow management to support your growth.",
    },
    {
        icon: Shield,
        title: "Audit Support",
        description: "Preparation for external audits and assistance throughout the audit process.",
    },
];

const zatcaFeatures = [
    "Phase 2 Compliant",
    "QR Code Generation",
    "XML/API Integration",
    "Real-time Validation",
    "Automatic Submission",
    "Archive Management",
];

const stats = [
    { value: "SAR 2B+", label: "Transactions Processed" },
    { value: "100%", label: "ZATCA Compliance" },
    { value: "500+", label: "Businesses Served" },
    { value: "0", label: "Missed Deadlines" },
];

export default function AccountingServicePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Link href="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
                            <Calculator className="w-4 h-4 text-primary" />
                            Finance & Growth
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Accounting & Tax Services
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            Professional accounting services with full ZATCA compliance.
                            From bookkeeping to tax filing, we keep your finances in order.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/checkout/professional" className="btn-primary inline-flex items-center gap-2">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#contact" className="btn-outline">
                                Free Consultation
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-border bg-card/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Complete Financial Services
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Expert accounting and financial management for businesses of all sizes.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ZATCA Compliance */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 mb-6">
                                <CheckCircle2 className="w-4 h-4" />
                                ZATCA Certified
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                E-Invoicing Made Simple
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Full compliance with ZATCA Phase 2 e-invoicing requirements.
                                We handle the technical complexity so you can focus on your business.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {zatcaFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        <span className="text-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-card rounded-3xl border border-border p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Invoice #INV-2024-0542</p>
                                        <p className="text-2xl font-bold text-foreground">SAR 15,750.00</p>
                                    </div>
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Receipt className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="text-green-600 font-medium">ZATCA Validated ✓</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">QR Code</span>
                                        <span className="text-foreground font-medium">Generated</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">XML Submitted</span>
                                        <span className="text-foreground font-medium">2 sec ago</span>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="w-24 h-24 mx-auto bg-secondary rounded-lg flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">QR Code</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-orange-500/10 via-card to-primary/10 rounded-3xl p-12 border border-border"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Get Your Finances in Order
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Professional accounting services that grow with your business.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/checkout/professional" className="btn-primary inline-flex items-center gap-2">
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#pricing" className="btn-outline">
                                View Pricing
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
