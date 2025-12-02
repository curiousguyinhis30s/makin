"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Building2, Globe, Briefcase, ShieldCheck, Zap, TrendingUp, Layers, Anchor } from "lucide-react";

const companies = [
    { name: "TechCorp", icon: Zap },
    { name: "GlobalVentures", icon: Globe },
    { name: "SaudiInvest", icon: TrendingUp },
    { name: "RiyadhRetail", icon: Building2 },
    { name: "DesertDynamics", icon: Layers },
    { name: "GulfLogistics", icon: Anchor },
    { name: "ArabianSystems", icon: Briefcase },
    { name: "FutureBuild", icon: ShieldCheck },
];

export default function LogoMarquee() {
    const { t, direction } = useLanguage();

    return (
        <section className="py-12 bg-background border-b border-border overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                    {t("marquee.trusted")}
                </p>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-16 w-max"
                    animate={{
                        x: direction === "rtl" ? [0, 1000] : [0, -1000],
                    }}
                    style={{ x: 0 }}
                >
                    <MarqueeContent companies={companies} direction={direction} />
                </motion.div>
            </div>
        </section>
    );
}

function MarqueeContent({ companies, direction }: { companies: any[], direction: string }) {
    const list = [...companies, ...companies, ...companies, ...companies];

    return (
        <motion.div
            className="flex gap-16 items-center"
            animate={{
                x: direction === "rtl" ? ["-50%", "0%"] : ["0%", "-50%"],
            }}
            transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {list.map((company, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default"
                >
                    <company.icon className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold text-foreground">{company.name}</span>
                </div>
            ))}
        </motion.div>
    );
}
