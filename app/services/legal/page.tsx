"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Scale, FileText, Shield, Building, Users, CheckCircle2, AlertTriangle, Briefcase } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Building,
        title: "Corporate Structure",
        description: "Company formation, restructuring, mergers, and acquisitions support with full legal documentation.",
    },
    {
        icon: FileText,
        title: "Contract Management",
        description: "Drafting, review, and negotiation of commercial contracts, NDAs, and partnership agreements.",
    },
    {
        icon: Shield,
        title: "Risk Management",
        description: "Identify and mitigate legal risks before they become problems. Proactive legal protection.",
    },
    {
        icon: Users,
        title: "Employment Law",
        description: "Employment contract templates, termination procedures, and dispute resolution guidance.",
    },
    {
        icon: Scale,
        title: "Regulatory Compliance",
        description: "Ensure compliance with Saudi commercial law, data protection, and sector-specific regulations.",
    },
    {
        icon: Briefcase,
        title: "Legal Advisory",
        description: "On-demand legal consultation for day-to-day business decisions and strategic planning.",
    },
];

const contractTypes = [
    "Employment Contracts",
    "Commercial Agreements",
    "Partnership Agreements",
    "Non-Disclosure Agreements",
    "Service Level Agreements",
    "Lease Agreements",
    "Distribution Contracts",
    "Franchise Agreements",
];

const stats = [
    { value: "1,000+", label: "Contracts Reviewed" },
    { value: "50+", label: "Companies Formed" },
    { value: "100%", label: "Compliance Rate" },
    { value: "24hr", label: "Response Time" },
];

export default function LegalServicePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-primary/5" />
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
                            <Scale className="w-4 h-4 text-primary" />
                            Legal Safety
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Legal & Compliance Services
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            Protect your business with expert legal guidance tailored for the Saudi market.
                            From contracts to compliance, we've got you covered.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/checkout/professional" className="btn-primary inline-flex items-center gap-2">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#contact" className="btn-outline">
                                Legal Consultation
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
                            Comprehensive Legal Support
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Expert legal services designed for businesses operating in Saudi Arabia.
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

            {/* Contract Types */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                Contract Templates & Review
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Access professionally drafted contract templates compliant with Saudi law,
                                or have our legal team review your existing agreements.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {contractTypes.map((type, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-foreground text-sm">{type}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-card rounded-3xl border border-border p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Risk Assessment</h3>
                                        <p className="text-sm text-muted-foreground">Contract Review Report</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                        <p className="text-sm font-medium text-red-600 mb-1">High Risk</p>
                                        <p className="text-xs text-muted-foreground">Clause 7.2 - Unlimited liability exposure</p>
                                    </div>
                                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                        <p className="text-sm font-medium text-yellow-600 mb-1">Medium Risk</p>
                                        <p className="text-xs text-muted-foreground">Clause 12 - Ambiguous termination terms</p>
                                    </div>
                                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                                        <p className="text-sm font-medium text-green-600 mb-1">Compliant</p>
                                        <p className="text-xs text-muted-foreground">14 clauses passed Saudi law compliance</p>
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
                        className="bg-gradient-to-br from-blue-500/10 via-card to-primary/10 rounded-3xl p-12 border border-border"
                    >
                        <Scale className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Protect Your Business Today
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Don't wait for legal issues to arise. Get proactive legal protection for your business.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/checkout/professional" className="btn-primary inline-flex items-center gap-2">
                                Get Legal Protection <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#contact" className="btn-outline">
                                Schedule Consultation
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
