"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock responses for now (would be connected to Groq)
const MOCK_BOT_RESPONSES = [
    "That's a great question! Based on your current profile, focusing on AWS Lambda would increase your market match by 15%.",
    "I've analyzed your resume - your 'System Design' section could use more quantifiable metrics.",
    "Try using the STAR method for that interview answer: Situation, Task, Action, Result.",
];

export function SageChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hello! I'm Sage, your career architect. How can I help you accelerate your growth today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.text
                    }))
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { role: 'bot', text: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my creative forge. Please try again." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "An error occurred. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence mode="wait">
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="h-16 bg-slate-900 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Sage AI</h3>
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button onClick={() => setIsMinimized(true)} className="hover:text-white transition-colors"><Minimize2 size={16} /></button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors"><X size={16} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-sky-500 text-white rounded-br-none"
                                            : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-slate-100 pb-4">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500/20 text-sm font-medium"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 rounded-lg text-white hover:bg-slate-800 transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                <button className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                                    Analyze my resume
                                </button>
                                <button className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                                    Suggest a project
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 relative z-50",
                    isOpen && !isMinimized ? "bg-slate-800 text-slate-400 rotate-90" : "bg-gradient-to-tr from-sky-600 to-indigo-600 text-white"
                )}
            >
                {isOpen && !isMinimized ? <X size={24} /> : <Bot size={28} />}

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="w-full h-full rounded-full animate-ping bg-red-500 absolute opacity-50" />
                    </span>
                )}
            </motion.button>
        </div>
    );
}
