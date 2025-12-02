"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Chatbot() {
    const { t, direction } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
        { role: "bot", text: "Hello! 👋 I'm Makin's AI assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInput("");
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    const getBotResponse = (text: string) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes("register") || lowerText.includes("sign up")) {
            return "You can create an account by clicking the 'Get Started' button in the top right corner, or visiting /register.";
        }
        if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("plan")) {
            return "We offer three main packages: Starter (SAR 2,500/mo), Growth (SAR 5,000/mo), and Enterprise (Custom). Check out our Pricing section for more details!";
        }
        if (lowerText.includes("service") || lowerText.includes("offer")) {
            return "We provide HR Management, Government Relations (GRO), Accounting, and Legal services to help your business thrive in Saudi Arabia.";
        }
        if (lowerText.includes("contact") || lowerText.includes("support")) {
            return "You can reach our support team via the Contact form below, or email us directly at support@makin.sa.";
        }
        return "I'm not sure about that yet. Would you like to speak to a human agent? You can use the Contact form below.";
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        dir={direction}
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-full">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Makin AI</h3>
                                <p className="text-xs text-primary-foreground/80">Always here to help</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-secondary text-foreground rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-secondary text-foreground rounded-2xl rounded-bl-none p-3 text-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce delay-100" />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-card border-t border-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-secondary/50 border border-border rounded-full px-4 py-2 text-sm text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
