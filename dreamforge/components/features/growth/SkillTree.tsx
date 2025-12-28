"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Star, Zap } from "lucide-react";

// Mock Data for the Tree
const skills = [
    { id: "core-1", x: 400, y: 300, label: "Logic", level: 5, status: "unlocked", category: "core" },
    { id: "core-2", x: 600, y: 300, label: "Algorithms", level: 3, status: "locked", category: "core" },
    { id: "fe-1", x: 400, y: 150, label: "React", level: 8, status: "unlocked", category: "frontend" },
    { id: "fe-2", x: 600, y: 100, label: "Next.js", level: 6, status: "locked", category: "frontend" },
    { id: "be-1", x: 400, y: 450, label: "Node.js", level: 4, status: "unlocked", category: "backend" },
    { id: "be-2", x: 600, y: 500, label: "Postgres", level: 2, status: "locked", category: "backend" },
];

const connections = [
    { from: "core-1", to: "core-2" },
    { from: "core-1", to: "fe-1" },
    { from: "fe-1", to: "fe-2" },
    { from: "core-1", to: "be-1" },
    { from: "be-1", to: "be-2" },
];

export function SkillTree() {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
            <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Zap className="text-yellow-400 fill-yellow-400" size={16} />
                    Skill Constellation
                </h3>
                <p className="text-xs text-slate-400">Pan & Zoom to explore</p>
            </div>

            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={2}
                centerOnInit
            >
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <div className="w-[1000px] h-[800px] relative bg-[url('/grid.svg')] bg-opacity-5">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {connections.map((conn, i) => {
                                const start = skills.find(s => s.id === conn.from)!;
                                const end = skills.find(s => s.id === conn.to)!;
                                return (
                                    <motion.line
                                        key={i}
                                        x1={start.x} y1={start.y}
                                        x2={end.x} y2={end.y}
                                        stroke="#334155"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                    />
                                )
                            })}
                        </svg>

                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{ left: skill.x, top: skill.y }}
                                onClick={() => setSelectedSkill(skill.id)}
                            >
                                {/* Orb Glow */}
                                <div className={cn(
                                    "absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-300",
                                    skill.category === 'frontend' ? 'bg-sky-500' :
                                        skill.category === 'backend' ? 'bg-emerald-500' : 'bg-indigo-500'
                                )} />

                                {/* Orb Body */}
                                <div className={cn(
                                    "relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110",
                                    skill.status === 'locked' ? "bg-slate-800 border-slate-700" : "bg-slate-900 border-white/20"
                                )}>
                                    {skill.status === 'locked' ? (
                                        <Lock size={20} className="text-slate-600" />
                                    ) : (
                                        <span className={cn(
                                            "font-bold text-lg",
                                            skill.category === 'frontend' ? 'text-sky-400' :
                                                skill.category === 'backend' ? 'text-emerald-400' : 'text-indigo-400'
                                        )}>{skill.level}</span>
                                    )}

                                    {/* Pulse Ring */}
                                    {skill.status === 'unlocked' && (
                                        <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
                                    )}
                                </div>

                                <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center w-32">
                                    <div className="text-white font-bold text-sm shadow-black drop-shadow-md">{skill.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TransformComponent>
            </TransformWrapper>

            {/* Info Panel */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-6 z-20"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-white">{skills.find(s => s.id === selectedSkill)?.label}</h2>
                            <button onClick={() => setSelectedSkill(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Proficiency</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} className="opacity-30" />
                                        <Star size={16} className="opacity-30" />
                                    </div>
                                    <span className="text-white font-bold">Lvl {skills.find(s => s.id === selectedSkill)?.level}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-900/20">
                                View Learning Path
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
