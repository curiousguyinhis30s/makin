"use client";

import { useLanguage } from "@/lib/i18n";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-200 text-sm font-medium text-foreground"
            aria-label="Switch Language"
        >
            {language === "en" ? "AR" : "EN"}
        </button>
    );
}
