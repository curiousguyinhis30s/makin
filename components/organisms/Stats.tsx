"use client";

import { motion } from "framer-motion";
import { Building2, FileText, Calendar, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Stats() {
    const { t } = useLanguage();

    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="bg-secondary rounded-[2rem] p-12 border-thick shadow-pop text-secondary-foreground">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { label: t("hero.stats.clients"), value: "500+", icon: Building2 },
                            { label: t("hero.stats.transactions"), value: "10k+", icon: FileText },
                            { label: t("hero.stats.experience"), value: "15+", icon: Calendar },
                            { label: t("hero.stats.satisfaction"), value: "99%", icon: Star },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-4xl font-bold tracking-tight text-white">{stat.value}</div>
                                </div>
                                <div className="text-lg font-medium text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
