"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export default function Team() {
    const { t } = useLanguage();

    const team = [
        {
            name: "Mohammed Al-Rashid",
            role: "Founder & CEO",
            image: null, // Using initials avatar
            bio: "15+ years in business consulting across the GCC region."
        },
        {
            name: "Sarah Ahmed",
            role: "Head of Operations",
            image: null,
            bio: "Expert in streamlining business processes and compliance."
        },
        {
            name: "Khalid Hassan",
            role: "Government Relations Director",
            image: null,
            bio: "Former government official with extensive regulatory expertise."
        },
        {
            name: "Fatima Al-Salem",
            role: "HR & Recruitment Lead",
            image: null,
            bio: "Specializes in talent acquisition and workforce management."
        },
    ];

    return (
        <section id="about" className="py-12 md:py-24 bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                        Who We Are
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        A dedicated team of experts committed to your success in the Kingdom.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group text-center"
                        >
                            <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-3xl md:text-4xl font-bold text-primary group-hover:scale-105 transition-transform">
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-foreground">{member.name}</h3>
                            <p className="text-xs md:text-sm text-primary font-medium">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
