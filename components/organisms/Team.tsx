"use client";

import { motion } from "framer-motion";
import { User, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Team() {
    const { t } = useLanguage();

    const team = [
        {
            name: "James Anderson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
        },
        {
            name: "Sarah Mitchell",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1573496359-136d47552640?w=400&h=400&fit=crop&q=80",
        },
        {
            name: "Michael Chen",
            role: "Legal Consultant",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
        },
        {
            name: "Emma Wilson",
            role: "Client Relations",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
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
                            <div className="relative overflow-hidden rounded-full bg-secondary/30 aspect-square w-32 h-32 mx-auto mb-4 border-2 border-transparent group-hover:border-primary transition-colors">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                {/* Overlay with socials */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                    <a href="#" className="p-1.5 bg-white/10 rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a href="#" className="p-1.5 bg-white/10 rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                </div>
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
