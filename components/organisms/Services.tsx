"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

// Custom SVG icons for better visual appeal
const HRIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
);

const GovIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
        <path d="M9 13h.01" />
        <path d="M15 13h.01" />
    </svg>
);

const AccountingIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10" />
        <path d="M12 7v10" />
        <path d="M16 7v10" />
        <path d="M2 12h20" />
    </svg>
);

const LegalIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <path d="M6.5 8h11" />
        <path d="M6 8l-2 12h16L18 8" />
        <path d="M12 8v12" />
        <path d="M8.5 14h7" />
    </svg>
);

export default function Services() {
    const { t } = useLanguage();

    const services = [
        {
            icon: HRIcon,
            title: t("services.hr.title"),
            description: t("services.hr.desc"),
            features: [
                t("services.hr.f1"),
                t("services.hr.f2"),
                t("services.hr.f3"),
                t("services.hr.f4"),
            ],
            className: "lg:col-span-2 bg-card",
        },
        {
            icon: GovIcon,
            title: t("services.gov.title"),
            description: t("services.gov.desc"),
            features: [
                t("services.gov.f1"),
                t("services.gov.f2"),
                t("services.gov.f3"),
                t("services.gov.f4"),
            ],
            className: "lg:col-span-1 bg-primary text-primary-foreground",
        },
        {
            icon: AccountingIcon,
            title: t("services.acc.title"),
            description: t("services.acc.desc"),
            features: [
                t("services.acc.f1"),
                t("services.acc.f2"),
                t("services.acc.f3"),
                t("services.acc.f4"),
            ],
            className: "lg:col-span-1 bg-secondary text-secondary-foreground",
        },
        {
            title: t("services.legal.title"),
            description: t("services.legal.desc"),
            icon: LegalIcon,
            features: [
                t("services.legal.f1"),
                t("services.legal.f2"),
                t("services.legal.f3"),
                t("services.legal.f4"),
            ],
            className: "lg:col-span-2 bg-card",
        },
    ];

    return (
        <section id="services" className="py-32 bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-foreground mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(185,255,102,0.5)]" />
                        Our Expertise
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                        {t("services.title")}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t("services.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`${service.className}
                                group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border transition-all duration-500
                                ${service.className.includes('bg-secondary')
                                    ? 'bg-secondary text-secondary-foreground border-secondary shadow-2xl'
                                    : service.className.includes('bg-primary')
                                        ? 'bg-primary text-primary-foreground border-primary shadow-xl'
                                        : 'bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5'
                                }`}
                        >
                            {/* Gradient Overlay for Hover */}
                            {!service.className.includes('bg-secondary') && !service.className.includes('bg-primary') && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-6 md:mb-8">
                                    <motion.div
                                        className={`w-14 h-14 md:w-18 md:h-18 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                                        ${service.className.includes('bg-secondary')
                                            ? 'bg-white/10 text-white'
                                            : service.className.includes('bg-primary')
                                                ? 'bg-black/10 text-black'
                                                : 'bg-primary/10 text-primary'
                                        }`}
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <service.icon className="w-7 h-7 md:w-9 md:h-9" />
                                    </motion.div>
                                    <motion.div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0
                                        ${service.className.includes('bg-secondary')
                                            ? 'bg-white/10 text-white'
                                            : service.className.includes('bg-primary')
                                                ? 'bg-black/10 text-black'
                                                : 'bg-primary/10 text-primary'
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <span className="transform -rotate-45 text-lg md:text-xl">→</span>
                                    </motion.div>
                                </div>

                                <h3 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${service.className.includes('bg-secondary') ? 'text-white' : service.className.includes('bg-primary') ? 'text-black' : 'text-foreground'}`}>
                                    {service.title}
                                </h3>

                                <p className={`mb-6 md:mb-10 text-base md:text-lg leading-relaxed ${service.className.includes('bg-secondary') ? 'text-gray-300' : service.className.includes('bg-primary') ? 'text-black/80' : 'text-muted-foreground'}`}>
                                    {service.description}
                                </p>

                                <ul className="space-y-3 md:space-y-4 mt-auto">
                                    {service.features?.map((feature, idx) => (
                                        <motion.li
                                            key={idx}
                                            className={`flex items-center gap-3 text-sm font-medium ${service.className.includes('bg-secondary') ? 'text-gray-300' : service.className.includes('bg-primary') ? 'text-black/80' : 'text-muted-foreground'}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * idx }}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.className.includes('bg-secondary') ? 'bg-primary' : service.className.includes('bg-primary') ? 'bg-black' : 'bg-primary'}`} />
                                            <span>{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
