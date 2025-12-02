"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Palette,
    Type,
    Layout,
    Square,
    Zap,
    Code,
    Copy,
    Check,
    Sun,
    Moon,
    ArrowRight,
    Users,
    Shield,
    Star
} from "lucide-react";
import { useTheme } from "next-themes";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

const colors = [
    { name: "Primary", variable: "--primary", class: "bg-primary", hex: "#B9FF66" },
    { name: "Primary Foreground", variable: "--primary-foreground", class: "bg-primary-foreground", hex: "#0A0A0A" },
    { name: "Background", variable: "--background", class: "bg-background", hex: "#FAFAFA / #0A0A0A" },
    { name: "Foreground", variable: "--foreground", class: "bg-foreground", hex: "#0A0A0A / #FAFAFA" },
    { name: "Card", variable: "--card", class: "bg-card", hex: "#FFFFFF / #111111" },
    { name: "Secondary", variable: "--secondary", class: "bg-secondary", hex: "#F5F5F5 / #1A1A1A" },
    { name: "Muted", variable: "--muted", class: "bg-muted", hex: "#F5F5F5 / #262626" },
    { name: "Border", variable: "--border", class: "bg-border", hex: "#E5E5E5 / #262626" },
];

const typography = [
    { name: "Display", class: "text-6xl font-bold", sample: "Make Your Business Feel at Home" },
    { name: "Heading 1", class: "text-4xl font-bold", sample: "Premier Business Solutions" },
    { name: "Heading 2", class: "text-3xl font-bold", sample: "Our Services" },
    { name: "Heading 3", class: "text-2xl font-semibold", sample: "HR & Recruitment" },
    { name: "Heading 4", class: "text-xl font-semibold", sample: "Feature Title" },
    { name: "Body Large", class: "text-lg", sample: "We provide comprehensive business services..." },
    { name: "Body", class: "text-base", sample: "Standard body text for paragraphs and content." },
    { name: "Small", class: "text-sm", sample: "Secondary information and captions" },
    { name: "Extra Small", class: "text-xs", sample: "Labels and metadata" },
];

const spacing = [
    { name: "xs", value: "4px", class: "p-1" },
    { name: "sm", value: "8px", class: "p-2" },
    { name: "md", value: "16px", class: "p-4" },
    { name: "lg", value: "24px", class: "p-6" },
    { name: "xl", value: "32px", class: "p-8" },
    { name: "2xl", value: "48px", class: "p-12" },
    { name: "3xl", value: "64px", class: "p-16" },
];

export default function StyleGuidePage() {
    const { theme, setTheme } = useTheme();
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const copyToClipboard = (text: string, name: string) => {
        navigator.clipboard.writeText(text);
        setCopiedColor(name);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-medium text-foreground/70 mb-6">
                                <Palette className="w-4 h-4" />
                                Design System v1.0
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Makin Design System
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                A comprehensive guide to the visual language, components, and patterns
                                used throughout the Makin platform.
                            </p>
                        </motion.div>

                        {/* Theme Toggle */}
                        <div className="mt-8 flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Theme:</span>
                            <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`p-2 rounded-md transition-colors ${theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                        }`}
                                >
                                    <Sun className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`p-2 rounded-md transition-colors ${theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                        }`}
                                >
                                    <Moon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Color Palette</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {colors.map((color) => (
                                <div
                                    key={color.name}
                                    className="group cursor-pointer"
                                    onClick={() => copyToClipboard(color.variable, color.name)}
                                >
                                    <div className={`h-24 rounded-t-xl ${color.class} border border-border border-b-0`} />
                                    <div className="p-4 bg-card border border-border rounded-b-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-foreground text-sm">{color.name}</span>
                                            {copiedColor === color.name ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                        <code className="text-xs text-muted-foreground">{color.variable}</code>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-card rounded-xl border border-border">
                            <h3 className="font-semibold text-foreground mb-3">Usage Guidelines</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• <strong className="text-foreground">Primary (Lime Green)</strong>: CTAs, highlights, interactive elements, brand accents</li>
                                <li>• <strong className="text-foreground">Foreground/Background</strong>: Main content colors, automatically adapt to theme</li>
                                <li>• <strong className="text-foreground">Muted</strong>: Secondary text, disabled states, subtle backgrounds</li>
                                <li>• <strong className="text-foreground">Border</strong>: Dividers, card borders, input borders</li>
                            </ul>
                        </div>
                    </section>

                    {/* Typography */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Type className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Typography</h2>
                        </div>

                        <div className="space-y-6">
                            {typography.map((type) => (
                                <div
                                    key={type.name}
                                    className="p-6 bg-card rounded-xl border border-border"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">{type.name}</span>
                                        <code className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{type.class}</code>
                                    </div>
                                    <p className={`${type.class} text-foreground`}>{type.sample}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-card rounded-xl border border-border">
                            <h3 className="font-semibold text-foreground mb-3">Font Family</h3>
                            <p className="text-muted-foreground mb-4">
                                Makin uses <strong className="text-foreground">Inter</strong> as the primary typeface for its
                                excellent readability and modern aesthetic.
                            </p>
                            <code className="text-sm bg-secondary px-3 py-2 rounded block">
                                font-family: &apos;Inter&apos;, system-ui, sans-serif;
                            </code>
                        </div>
                    </section>

                    {/* Spacing */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Layout className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Spacing Scale</h2>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {spacing.map((space) => (
                                <div key={space.name} className="text-center">
                                    <div className={`${space.class} bg-primary/20 border-2 border-primary border-dashed rounded-lg mb-2`}>
                                        <div className="w-8 h-8 bg-primary rounded" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground block">{space.name}</span>
                                    <span className="text-xs text-muted-foreground">{space.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Buttons */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Square className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Buttons</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Primary Button</h3>
                                <button className="btn-primary mb-4">
                                    Get Started <ArrowRight className="w-4 h-4 inline ml-2" />
                                </button>
                                <code className="text-xs bg-secondary px-3 py-2 rounded block text-muted-foreground">
                                    className=&quot;btn-primary&quot;
                                </code>
                            </div>

                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Outline Button</h3>
                                <button className="btn-outline mb-4">
                                    Learn More
                                </button>
                                <code className="text-xs bg-secondary px-3 py-2 rounded block text-muted-foreground">
                                    className=&quot;btn-outline&quot;
                                </code>
                            </div>

                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Ghost Button</h3>
                                <button className="px-6 py-3 text-foreground hover:bg-secondary rounded-xl transition-colors mb-4">
                                    Cancel
                                </button>
                                <code className="text-xs bg-secondary px-3 py-2 rounded block text-muted-foreground">
                                    hover:bg-secondary rounded-xl
                                </code>
                            </div>

                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Disabled State</h3>
                                <button className="btn-primary opacity-50 cursor-not-allowed mb-4" disabled>
                                    Processing...
                                </button>
                                <code className="text-xs bg-secondary px-3 py-2 rounded block text-muted-foreground">
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                </code>
                            </div>
                        </div>
                    </section>

                    {/* Cards */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Layout className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Cards</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Standard Card</h3>
                                <p className="text-sm text-muted-foreground">Basic card with icon, title, and description.</p>
                            </div>

                            <div className="glass-panel rounded-2xl p-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Glass Panel</h3>
                                <p className="text-sm text-muted-foreground">Frosted glass effect for elevated content.</p>
                            </div>

                            <div className="nano-border-gradient p-[1px] rounded-2xl">
                                <div className="bg-card rounded-2xl p-6 h-full">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Star className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Gradient Border</h3>
                                    <p className="text-sm text-muted-foreground">Special card with animated gradient border.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Badges */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Badges & Pills</h2>
                        </div>

                        <div className="flex flex-wrap gap-4 p-6 bg-card rounded-xl border border-border">
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                Primary
                            </span>
                            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                                Secondary
                            </span>
                            <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-medium rounded-full border border-green-500/20">
                                Success
                            </span>
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 text-sm font-medium rounded-full border border-yellow-500/20">
                                Warning
                            </span>
                            <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm font-medium rounded-full border border-red-500/20">
                                Error
                            </span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-sm font-medium rounded-full border border-blue-500/20">
                                Info
                            </span>
                        </div>
                    </section>

                    {/* Animation */}
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Animations</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Pulse Animation</h3>
                                <div className="flex items-center gap-4">
                                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                    <code className="text-xs text-muted-foreground">animate-pulse</code>
                                </div>
                            </div>

                            <div className="p-6 bg-card rounded-xl border border-border">
                                <h3 className="font-semibold text-foreground mb-4">Hover Scale</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-xl hover:scale-110 transition-transform cursor-pointer" />
                                    <code className="text-xs text-muted-foreground">hover:scale-110 transition-transform</code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Code Block */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Code className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">CSS Variables</h2>
                        </div>

                        <div className="p-6 bg-[#1a1a1a] rounded-xl overflow-x-auto">
                            <pre className="text-sm text-gray-300">
                                <code>{`:root {
  --primary: 74 100% 69%;
  --primary-foreground: 0 0% 4%;
  --background: 0 0% 98%;
  --foreground: 0 0% 4%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 4%;
  --secondary: 0 0% 96%;
  --muted: 0 0% 96%;
  --border: 0 0% 90%;
  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --card: 0 0% 7%;
  --secondary: 0 0% 10%;
  --muted: 0 0% 15%;
  --border: 0 0% 15%;
}`}</code>
                            </pre>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
