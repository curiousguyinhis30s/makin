"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building, FileText, Globe, Clock, Shield, CheckCircle2, Star, Landmark } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Building,
        title: "Business Licensing",
        description: "Commercial Registration (CR), Municipal licenses, and sector-specific permits handled end-to-end.",
    },
    {
        icon: Globe,
        title: "Visa & Immigration",
        description: "Work visas, visit visas, family visas, exit/re-entry permits, and final exit processing.",
    },
    {
        icon: FileText,
        title: "Iqama Services",
        description: "New iqama issuance, renewals, profession changes, and dependent additions.",
    },
    {
        icon: Landmark,
        title: "Ministry Relations",
        description: "Direct liaison with MHRSD, MOFA, MOC, and other government entities.",
    },
    {
        icon: Shield,
        title: "Compliance Management",
        description: "Nitaqat management, Saudization compliance, and regulatory updates.",
    },
    {
        icon: Clock,
        title: "Express Processing",
        description: "Priority handling for urgent requests with dedicated government relations officers.",
    },
];

const portals = [
    { name: "Qiwa", description: "Labor Market Platform" },
    { name: "Absher", description: "Ministry of Interior Services" },
    { name: "Muqeem", description: "Expatriate Affairs" },
    { name: "MISA", description: "Investment Licenses" },
    { name: "Balady", description: "Municipal Services" },
    { name: "Etimad", description: "Government Procurement" },
];

const stats = [
    { value: "10,000+", label: "Transactions Processed" },
    { value: "48hrs", label: "Average Processing" },
    { value: "15+", label: "Government Portals" },
    { value: "100%", label: "Success Rate" },
];

export default function GovernmentServicePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5" />
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
                            <Landmark className="w-4 h-4 text-primary" />
                            Government Relations
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Government Relations & PRO Services
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            Navigate Saudi bureaucracy with ease. We handle all government interactions,
                            from licensing to immigration, so you can focus on your business.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/checkout/professional" className="btn-primary inline-flex items-center gap-2">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#contact" className="btn-outline">
                                Schedule Consultation
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-border bg-primary text-primary-foreground">
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
                                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm opacity-80">{stat.label}</div>
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
                            Complete PRO Services
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Expert handling of all government-related matters for your business.
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

            {/* Government Portals */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Government Portals We Manage
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Direct access and expertise across all major Saudi government platforms.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {portals.map((portal, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-2xl border border-border bg-card text-center hover:border-primary/50 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold text-foreground mb-1">{portal.name}</h3>
                                <p className="text-xs text-muted-foreground">{portal.description}</p>
                            </motion.div>
                        ))}
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
                        className="bg-secondary text-secondary-foreground rounded-3xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stop Wasting Time on Bureaucracy
                        </h2>
                        <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                            Let our experienced GRO team handle your government matters while you focus on growing your business.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/checkout/professional" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                                Get Started Today <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/#pricing" className="border border-secondary-foreground/20 text-secondary-foreground px-8 py-3 rounded-xl font-medium hover:bg-secondary-foreground/10 transition-colors">
                                View Pricing
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
