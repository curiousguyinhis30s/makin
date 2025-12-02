"use client";

import { useLanguage } from "@/lib/i18n";
import { Linkedin, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-secondary text-secondary-foreground py-16 mt-20 rounded-t-[2rem] mx-4 lg:mx-8 mb-4 lg:mb-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary text-black rounded-lg flex items-center justify-center font-bold text-xl">
                            M
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Makin</span>
                    </div>

                    <div className="flex gap-4">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-t border-gray-800 pt-12">
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="bg-primary text-black px-2 py-1 rounded inline-block font-bold mb-4">Contact us:</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li>Email: hello@makin.sa</li>
                            <li>Phone: +966 11 123 4567</li>
                            <li>Address: Riyadh, Saudi Arabia</li>
                        </ul>
                    </div>

                    <div className="bg-[#292A32] p-8 rounded-2xl col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
                        />
                        <button className="w-full md:w-auto bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                            Subscribe to news
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <div>&copy; {new Date().getFullYear()} Makin. All Rights Reserved.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
                        <a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
