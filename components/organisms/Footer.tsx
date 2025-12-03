"use client";

import { useLanguage } from "@/lib/i18n";
import { Linkedin, Mail, Phone, MapPin, ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    const { t } = useLanguage();

    const services = [
        { name: t("services.hr.title"), href: "/services/hr" },
        { name: t("services.gov.title"), href: "/services/government" },
        { name: t("services.acc.title"), href: "/services/accounting" },
        { name: t("services.legal.title"), href: "/services/legal" },
    ];

    const company = [
        { name: t("nav.about"), href: "/about" },
        { name: t("nav.pricing"), href: "/#pricing" },
        { name: t("nav.contact"), href: "/#contact" },
        { name: "Careers", href: "#" },
    ];

    return (
        <footer className="bg-secondary text-secondary-foreground">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                <span className="text-xl font-bold text-primary-foreground">M</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Makin</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {t("footer.desc")}
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://linkedin.com/company/makin-sa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:info@makin.sa"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">{t("nav.services")}</h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link
                                        href={service.href}
                                        className="text-gray-400 hover:text-primary text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        {service.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">Company</h4>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-primary text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        {item.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">{t("footer.contactUs")}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Building2 className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-400">King Fahd Road, Al Olaya</p>
                                    <p className="text-gray-400">Riyadh 12211, Saudi Arabia</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <a href="tel:+966112345678" className="text-sm text-gray-400 hover:text-primary transition-colors">
                                    +966 11 234 5678
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <a href="mailto:info@makin.sa" className="text-sm text-gray-400 hover:text-primary transition-colors">
                                    info@makin.sa
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-10 border-t border-gray-800">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-semibold text-white mb-1">Stay Updated</h4>
                            <p className="text-sm text-gray-400">Get the latest news on regulations and business insights.</p>
                        </div>
                        <div className="flex w-full lg:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 lg:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary text-sm"
                            />
                            <button className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} {t("footer.rights")}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                {t("footer.privacy")}
                            </Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                {t("footer.terms")}
                            </Link>
                            <span className="text-gray-700">CR: 1010XXXXXX</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
