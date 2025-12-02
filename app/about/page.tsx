"use client";

import { motion } from "framer-motion";
import { Target, Eye, Users, Award, Globe, Shield, Rocket, Heart, CheckCircle2, Building2, Briefcase, GraduationCap, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const values = [
    {
        icon: Shield,
        title: "Trust & Integrity",
        description: "We build lasting relationships through transparency and honest communication with every client.",
        color: "from-blue-500/20 to-blue-600/20"
    },
    {
        icon: Rocket,
        title: "Excellence",
        description: "We strive for the highest standards in everything we do, constantly improving our services.",
        color: "from-purple-500/20 to-purple-600/20"
    },
    {
        icon: Heart,
        title: "Client-First",
        description: "Your success is our success. We tailor solutions to meet your unique business needs.",
        color: "from-rose-500/20 to-rose-600/20"
    },
    {
        icon: Globe,
        title: "Local Expertise",
        description: "Deep understanding of Saudi Arabia's business landscape, regulations, and culture.",
        color: "from-emerald-500/20 to-emerald-600/20"
    }
];

const stats = [
    { value: "500+", label: "Businesses Served", icon: Building2 },
    { value: "10+", label: "Years Experience", icon: Award },
    { value: "98%", label: "Client Satisfaction", icon: CheckCircle2 },
    { value: "50+", label: "Expert Team Members", icon: Users }
];

const team = [
    {
        name: "Mohammed Al-Rashid",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "15+ years in business consulting across the GCC region. Former McKinsey consultant.",
        linkedin: "#",
        specialties: ["Strategic Planning", "Business Development", "Government Relations"]
    },
    {
        name: "Sarah Ahmed",
        role: "Head of Operations",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
        bio: "Expert in streamlining business processes and compliance with 12+ years experience.",
        linkedin: "#",
        specialties: ["Process Optimization", "Compliance", "Team Leadership"]
    },
    {
        name: "Khalid Hassan",
        role: "Government Relations Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        bio: "Former government official with 20+ years of extensive regulatory expertise.",
        linkedin: "#",
        specialties: ["Regulatory Affairs", "Licensing", "Public Sector"]
    },
    {
        name: "Fatima Al-Salem",
        role: "HR & Recruitment Lead",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
        bio: "Specializes in talent acquisition and workforce management for Vision 2030 companies.",
        linkedin: "#",
        specialties: ["Talent Acquisition", "Workforce Planning", "Saudization"]
    }
];

const milestones = [
    { year: "2014", title: "Founded in Riyadh", description: "Started with a vision to simplify business services" },
    { year: "2016", title: "100+ Clients", description: "Reached our first major milestone" },
    { year: "2018", title: "Expanded Services", description: "Added accounting and legal services" },
    { year: "2020", title: "Digital Transformation", description: "Launched online client portal" },
    { year: "2023", title: "500+ Businesses", description: "Serving clients across all sectors" },
    { year: "2024", title: "AI-Powered Services", description: "Integrated AI for faster processing" }
];

export default function AboutPage() {
    return (
        <div className="pt-16">
                {/* Hero Section - Cinematic Style */}
                <section className="pt-32 pb-24 relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-60" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Trusted Since 2014
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
                                Empowering Businesses
                                <span className="bg-gradient-to-r from-primary via-primary to-purple-500 bg-clip-text text-transparent block mt-3">
                                    to Thrive in Saudi Arabia
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                We handle the complexities of operating in the Kingdom—HR, compliance,
                                government relations—so you can focus on what matters: <span className="text-foreground font-medium">growing your business</span>.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section - Modern Cards */}
                <section className="py-8 relative z-20 -mt-12">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                                    A Decade of Enabling Business Success
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Founded in 2014 by Mohammed Al-Rashid, Makin was born from a simple observation:
                                        businesses in Saudi Arabia were spending too much time on administrative hurdles
                                        instead of innovation and growth.
                                    </p>
                                    <p>
                                        What started as a small consultancy has grown into a comprehensive business
                                        services partner, helping over 500 companies navigate the complexities of
                                        operating in the Kingdom.
                                    </p>
                                    <p>
                                        Today, we're proud to be part of Saudi Arabia's Vision 2030 journey, helping
                                        both local entrepreneurs and international companies establish and scale their
                                        presence in one of the world's fastest-growing economies.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Timeline */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
                                <div className="space-y-6">
                                    {milestones.map((milestone, index) => (
                                        <motion.div
                                            key={milestone.year}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-20"
                                        >
                                            <div className="absolute left-0 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">{milestone.year}</span>
                                            </div>
                                            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                                                <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision - Split Design */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-card rounded-3xl p-8 md:p-10 border border-border relative overflow-hidden group hover:border-primary/30 transition-colors"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 border border-primary/20">
                                        <Target className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        To simplify business operations in Saudi Arabia by providing comprehensive
                                        HR, government relations, and accounting services that allow entrepreneurs
                                        and companies to focus on their core business and achieve sustainable growth.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-card rounded-3xl p-8 md:p-10 border border-border relative overflow-hidden group hover:border-primary/30 transition-colors"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 border border-purple-500/20">
                                        <Eye className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        To be the leading business services partner in the Kingdom, recognized
                                        for excellence, innovation, and unwavering commitment to our clients'
                                        success in alignment with Saudi Vision 2030.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section - Modern Grid */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Our Core Values</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                The principles that guide every decision we make
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-card rounded-2xl p-6 border border-border h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${value.color} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-5 border border-border group-hover:scale-110 transition-transform`}>
                                                <value.icon className="w-7 h-7 text-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section - Premium Cards with Photos */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">The People Behind Makin</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Meet Our Leadership</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                Experienced professionals with decades of combined expertise
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                        {/* Photo */}
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                                            {/* Social Links Overlay */}
                                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a
                                                    href={member.linkedin}
                                                    className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                                    aria-label={`${member.name}'s LinkedIn`}
                                                >
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                                <a
                                                    href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@makin.sa`}
                                                    className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                                    aria-label={`Email ${member.name}`}
                                                >
                                                    <Mail className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                                            <p className="text-primary font-medium mb-3">{member.role}</p>
                                            <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

                                            {/* Specialties */}
                                            <div className="flex flex-wrap gap-2">
                                                {member.specialties.map((specialty) => (
                                                    <span
                                                        key={specialty}
                                                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section - Gradient Card */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden"
                        >
                            {/* Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-600" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

                            <div className="relative p-10 md:p-16 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Ready to Partner with Us?
                                </h2>
                                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                                    Let's discuss how Makin can help your business thrive in Saudi Arabia.
                                    Get a free consultation today.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/get-started"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
                                    >
                                        Get Started Today
                                    </Link>
                                    <Link
                                        href="/#contact"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
    );
}
