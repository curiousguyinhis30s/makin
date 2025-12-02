"use client";

import { motion } from "framer-motion";
import { Users, Building2, Calculator, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Services() {
    const { t } = useLanguage();

    const services = [
        {
            icon: Users,
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
            icon: Building2,
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
            icon: Calculator,
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
            icon: ShieldCheck,
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
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply">
                <img src="/images/services-bg.png" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-medium text-foreground/70 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(185,255,102,0.5)]" />
                        Our Expertise
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                        {t("services.title")}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t("services.subtitle")}
                    </p>
                </div>

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
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                                        ${service.className.includes('bg-secondary')
                                            ? 'bg-white/10 text-white'
                                            : service.className.includes('bg-primary')
                                                ? 'bg-black/10 text-black'
                                                : 'bg-primary/10 text-primary'
                                        }`}>
                                        <service.icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0
                                        ${service.className.includes('bg-secondary')
                                            ? 'bg-white/10 text-white'
                                            : service.className.includes('bg-primary')
                                                ? 'bg-black/10 text-black'
                                                : 'bg-primary/10 text-primary'
                                        }`}>
                                        <span className="transform -rotate-45 text-lg md:text-xl">→</span>
                                    </div>
                                </div>

                                <h3 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${service.className.includes('bg-secondary') ? 'text-white' : service.className.includes('bg-primary') ? 'text-black' : 'text-foreground'}`}>
                                    {service.title}
                                </h3>

                                <p className={`mb-6 md:mb-10 text-base md:text-lg leading-relaxed ${service.className.includes('bg-secondary') ? 'text-gray-300' : service.className.includes('bg-primary') ? 'text-black/80' : 'text-muted-foreground'}`}>
                                    {service.description}
                                </p>

                                <ul className="space-y-3 md:space-y-4 mt-auto">
                                    {service.features?.map((feature, idx) => (
                                        <li key={idx} className={`flex items-center gap-3 text-sm font-medium ${service.className.includes('bg-secondary') ? 'text-gray-300' : service.className.includes('bg-primary') ? 'text-black/80' : 'text-muted-foreground'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.className.includes('bg-secondary') ? 'bg-primary' : service.className.includes('bg-primary') ? 'bg-black' : 'bg-primary'}`} />
                                            <span>{feature}</span>
                                        </li>
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
