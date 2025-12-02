"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users, FileCheck, Building, Clock, Shield, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const features = [
    {
        icon: Users,
        title: "Payroll Management",
        description: "Complete payroll processing including salary calculations, deductions, GOSI contributions, and WPS compliance.",
    },
    {
        icon: FileCheck,
        title: "Employee Onboarding",
        description: "Streamlined onboarding process from offer letters to work permits, iqamas, and bank account setup.",
    },
    {
        icon: Building,
        title: "GOSI & Social Insurance",
        description: "Full management of GOSI registrations, monthly contributions, and compliance reporting.",
    },
    {
        icon: Clock,
        title: "Leave & Attendance",
        description: "Automated leave management, attendance tracking, and end-of-service benefits calculations.",
    },
    {
        icon: Shield,
        title: "Labor Law Compliance",
        description: "Ensure full compliance with Saudi Labor Law, Nitaqat requirements, and Ministry of HR regulations.",
    },
    {
        icon: CheckCircle2,
        title: "Contract Management",
        description: "Drafting, renewal, and termination of employment contracts in line with current regulations.",
    },
];

const processSteps = [
    { step: "01", title: "Initial Consultation", description: "We assess your HR needs and current processes" },
    { step: "02", title: "Setup & Integration", description: "Configure systems and integrate with government portals" },
    { step: "03", title: "Employee Migration", description: "Transfer existing employee data and documentation" },
    { step: "04", title: "Ongoing Management", description: "Monthly payroll, compliance, and reporting" },
];

const stats = [
    { value: "5,000+", label: "Employees Managed" },
    { value: "99.9%", label: "Payroll Accuracy" },
    { value: "100%", label: "Compliance Rate" },
    { value: "24/7", label: "Support Available" },
];

export default function HRServicePage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
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
                            <Users className="w-4 h-4 text-primary" />
                            People & Culture
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                            HR & Workforce Management
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            Complete human resources management designed for businesses operating in Saudi Arabia.
                            From hiring to retirement, we handle every aspect of your workforce.
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
                            Comprehensive HR Services
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to build, manage, and grow your team in the Kingdom.
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

            {/* Process */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            A simple 4-step process to transform your HR operations.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative"
                            >
                                <div className="text-6xl font-bold text-primary/20 mb-4">{step.step}</div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent translate-x-1/2" />
                                )}
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
                        className="bg-gradient-to-br from-primary/10 via-card to-purple-500/10 rounded-3xl p-12 border border-border"
                    >
                        <div className="flex justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Ready to Transform Your HR?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join 500+ companies that trust Makin for their HR operations in Saudi Arabia.
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
