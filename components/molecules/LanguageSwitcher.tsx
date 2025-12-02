"use client";

import { useLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            aria-label="Switch Language"
        >
            <Globe className="w-4 h-4" />
            <span>{language === "en" ? "العربية" : "English"}</span>
        </button>
    );
}
