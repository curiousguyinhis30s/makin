"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Shield, Paperclip, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Message {
    id: string;
    content: string;
    createdAt: string;
    isStaff: boolean;
    user?: {
        name: string;
        role?: string;
    };
}

interface MessageThreadProps {
    requestId: string;
    messages: Message[];
    onSendMessage: (content: string) => Promise<void>;
    isLoading?: boolean;
    disabled?: boolean;
}

export function MessageThread({
    requestId,
    messages,
    onSendMessage,
    isLoading = false,
    disabled = false,
}: MessageThreadProps) {
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { error: showError } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = newMessage.trim();

        if (!content || isSending || disabled) return;

        setIsSending(true);
        try {
            await onSendMessage(content);
            setNewMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (err) {
            showError("Failed to send message", "Please try again");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);

        // Auto-resize
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                            <Send className="w-5 h-5 text-muted-foreground/50 rotate-45" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`flex gap-3 ${message.isStaff ? "" : "flex-row-reverse"}`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                                        message.isStaff
                                            ? "bg-primary/10 text-primary"
                                            : "bg-secondary text-foreground"
                                    }`}
                                >
                                    {message.isStaff ? (
                                        <Shield className="w-4 h-4" />
                                    ) : (
                                        <User className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Message bubble */}
                                <div
                                    className={`flex-1 max-w-[80%] ${
                                        message.isStaff ? "" : "text-right"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-foreground">
                                            {message.user?.name || (message.isStaff ? "Support Team" : "You")}
                                        </span>
                                        {message.isStaff && message.user?.role && (
                                            <span className="text-xs text-muted-foreground">
                                                ({message.user.role})
                                            </span>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {formatTime(message.createdAt)}
                                        </span>
                                    </div>
                                    <div
                                        className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                                            message.isStaff
                                                ? "bg-secondary text-foreground rounded-tl-sm"
                                                : "bg-primary text-primary-foreground rounded-tr-sm"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="border-t border-border p-4 bg-card/50"
            >
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            placeholder={disabled ? "Messaging is disabled" : "Type your message..."}
                            disabled={isSending || disabled}
                            rows={1}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            style={{ maxHeight: "120px" }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending || disabled}
                        className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </form>
        </div>
    );
}

function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
