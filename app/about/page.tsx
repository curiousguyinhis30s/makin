"use client";

import { motion } from "framer-motion";
import { Target, Eye, Users, Award, Globe, Shield, Rocket, Heart } from "lucide-react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

const values = [
    {
        icon: Shield,
        title: "Trust & Integrity",
        description: "We build lasting relationships through transparency and honest communication with every client."
    },
    {
        icon: Rocket,
        title: "Excellence",
        description: "We strive for the highest standards in everything we do, constantly improving our services."
    },
    {
        icon: Heart,
        title: "Client-First",
        description: "Your success is our success. We tailor solutions to meet your unique business needs."
    },
    {
        icon: Globe,
        title: "Local Expertise",
        description: "Deep understanding of Saudi Arabia's business landscape, regulations, and culture."
    }
];

const stats = [
    { value: "500+", label: "Businesses Served" },
    { value: "10+", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "50+", label: "Expert Team Members" }
];

const team = [
    {
        name: "Mohammed Al-Rashid",
        role: "Founder & CEO",
        image: "/images/team/ceo.jpg",
        bio: "15+ years in business consulting across the GCC region."
    },
    {
        name: "Sarah Ahmed",
        role: "Head of Operations",
        image: "/images/team/operations.jpg",
        bio: "Expert in streamlining business processes and compliance."
    },
    {
        name: "Khalid Hassan",
        role: "Government Relations Director",
        image: "/images/team/gro.jpg",
        bio: "Former government official with extensive regulatory expertise."
    },
    {
        name: "Fatima Al-Salem",
        role: "HR & Recruitment Lead",
        image: "/images/team/hr.jpg",
        bio: "Specializes in talent acquisition and workforce management."
    }
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-50" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-medium text-foreground/70 mb-6">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                About Makin
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                                Empowering Businesses to
                                <span className="text-primary block mt-2">Thrive in Saudi Arabia</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Since 2014, Makin has been the trusted partner for businesses navigating
                                the complexities of operating in the Kingdom. We handle the paperwork,
                                compliance, and administration so you can focus on growth.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 border-y border-border bg-secondary/30">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-panel rounded-3xl p-8 md:p-10"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    To simplify business operations in Saudi Arabia by providing comprehensive
                                    HR, government relations, and accounting services that allow entrepreneurs
                                    and companies to focus on their core business and achieve sustainable growth.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-panel rounded-3xl p-8 md:p-10"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Eye className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    To be the leading business services partner in the Kingdom, recognized
                                    for excellence, innovation, and unwavering commitment to our clients'
                                    success in alignment with Saudi Vision 2030.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-secondary/30">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Experienced professionals dedicated to your success
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold text-primary group-hover:scale-105 transition-transform">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                                    <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary/5">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Ready to Partner with Us?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Let's discuss how Makin can help your business thrive in Saudi Arabia.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/register" className="btn-primary px-8 py-4">
                                Get Started Today
                            </a>
                            <a href="/#contact" className="btn-outline px-8 py-4">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
