"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const testimonials = [
    {
        name: "David Miller",
        role: "CEO, Future Tech",
        content: "Makin transformed our HR operations. Their team is professional, efficient, and truly understands the local market.",
        rating: 5,
    },
    {
        name: "Sarah Johnson",
        role: "Director, Global Innovations",
        content: "Setting up our regional headquarters in Riyadh was seamless thanks to Makin's government relations experts.",
        rating: 5,
    },
    {
        name: "Robert Chen",
        role: "Founder, Chen Logistics",
        content: "The accounting services provided are top-notch. Accurate, timely, and compliant with all ZATCA regulations.",
        rating: 5,
    },
    {
        name: "Jessica Davis",
        role: "HR Manager, Creative Solutions",
        content: "We saved 40% of our administrative time using Makin's platform. Highly recommended for any growing business.",
        rating: 5,
    },
    {
        name: "James Wilson",
        role: "VP, TechFlow",
        content: "Excellent support for international companies entering the Saudi market. They made the complex simple.",
        rating: 5,
    },
];

export default function Testimonials() {
    const { t, direction } = useLanguage();

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t("testimonials.title")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("testimonials.subtitle")}
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max"
                    animate={{
                        x: direction === "rtl" ? [0, 1000] : [0, -1000], // Adjust values based on content width approx or use percentage if container width known
                    }}
                    style={{
                        x: 0, // Initial state
                    }}
                // We use a more robust CSS-based marquee or calculated framer motion for perfect loop.
                // For simplicity and robustness with unknown width, let's use a percentage based approach on a duplicated list.
                >
                    <MarqueeContent testimonials={testimonials} direction={direction} />
                </motion.div>
            </div>
        </section>
    );
}

function MarqueeContent({ testimonials, direction }: { testimonials: any[], direction: string }) {
    // Duplicating list 4 times to ensure it fills wide screens and loops smoothly
    const list = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <motion.div
            className="flex gap-8"
            animate={{
                x: direction === "rtl" ? ["-50%", "0%"] : ["0%", "-50%"],
            }}
            transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {list.map((testimonial, index) => (
                <div
                    key={index}
                    className="w-[350px] md:w-[400px] flex-shrink-0 p-8 rounded-3xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                    <Quote className="absolute top-8 right-8 w-8 h-8 text-primary/20" />

                    <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                    </div>

                    <p className="text-foreground mb-6 leading-relaxed line-clamp-4">
                        "{testimonial.content}"
                    </p>

                    <div>
                        <div className="font-bold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
