"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bug, X, Terminal, Database, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function DebugAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // Intercept console logs for display
        const originalLog = console.log;
        console.log = (...args) => {
            setLogs(prev => [...prev.slice(-19), `LOG: ${args.map(String).join(' ')}`]);
            originalLog(...args);
        };
        return () => {
            console.log = originalLog;
        };
    }, []);

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="h-10 bg-slate-950 flex items-center justify-between px-4 border-b border-slate-800">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <Bug size={14} /> Debug Console
                            </span>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Current Context</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Terminal size={10} /> Path</div>
                                        <div className="text-xs font-mono text-sky-400 truncate" title={pathname}>{pathname}</div>
                                    </div>
                                    <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Cpu size={10} /> Env</div>
                                        <div className="text-xs font-mono text-emerald-400">development</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Recent Logs</div>
                                <div className="bg-black/50 rounded-lg p-2 font-mono text-[10px] h-32 overflow-y-auto custom-scrollbar space-y-1">
                                    {logs.length === 0 && <span className="text-slate-600 italic">No logs captured...</span>}
                                    {logs.map((log, i) => (
                                        <div key={i} className="text-slate-300 border-b border-white/5 pb-1 last:border-0">{log}</div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => { console.log("Test log entry " + Date.now()); }} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors border border-slate-700">
                                Emit Test Log
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110",
                    isOpen ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-400 border border-slate-700"
                )}
            >
                <Bug size={18} />
            </button>
        </div>
    )
}
