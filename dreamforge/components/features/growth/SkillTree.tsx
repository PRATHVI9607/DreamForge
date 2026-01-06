"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Lock, Star, Zap } from "lucide-react";

// Mock Data for the Tree
interface Skill {
    id: string;
    x: number;
    y: number;
    label: string;
    level: number;
    status: 'unlocked' | 'locked';
    category: string;
    courses?: string[];
}

interface Connection {
    from: string;
    to: string;
}

// Comprehensive Mock Data for the Tree
const defaultSkills: Skill[] = [
    // CORE (Center)
    { id: "core-1", x: 500, y: 400, label: "Logic", level: 5, status: "unlocked", category: "core", courses: ["Discrete Math for CS", "Critical Thinking 101"] },
    { id: "core-2", x: 500, y: 250, label: "Algorithms", level: 3, status: "unlocked", category: "core", courses: ["Data Structures & Algorithms Specialization", "LeetCode patterns"] },
    { id: "core-3", x: 650, y: 400, label: "Systems", level: 4, status: "locked", category: "core", courses: ["Operating Systems: Three Easy Pieces"] },
    { id: "core-4", x: 500, y: 550, label: "Compilers", level: 2, status: "locked", category: "core", courses: ["Stanford CS143"] },

    // FRONTEND (Left Quadrant)
    { id: "fe-1", x: 300, y: 350, label: "React", level: 8, status: "unlocked", category: "frontend", courses: ["React - The Complete Guide", "Epic React"] },
    { id: "fe-2", x: 200, y: 250, label: "Next.js", level: 6, status: "unlocked", category: "frontend", courses: ["Next.js App Router Masterclass"] },
    { id: "fe-3", x: 150, y: 350, label: "Tailwind", level: 9, status: "unlocked", category: "frontend", courses: ["Tailwind Mastery"] },
    { id: "fe-4", x: 100, y: 200, label: "Three.js", level: 4, status: "locked", category: "frontend", courses: ["Three.js Journey"] },
    { id: "fe-5", x: 50, y: 300, label: "WebGL", level: 2, status: "locked", category: "frontend" },

    // BACKEND (Right Quadrant)
    { id: "be-1", x: 700, y: 350, label: "Node.js", level: 7, status: "unlocked", category: "backend", courses: ["Distributed Systems with Node"] },
    { id: "be-2", x: 800, y: 250, label: "Postgres", level: 4, status: "unlocked", category: "backend", courses: ["SQL Mastery"] },
    { id: "be-3", x: 850, y: 350, label: "Redis", level: 5, status: "unlocked", category: "backend" },
    { id: "be-4", x: 900, y: 200, label: "Go", level: 3, status: "locked", category: "backend", courses: ["Go Programming: Zero to Hero"] },
    { id: "be-5", x: 950, y: 300, label: "Rust", level: 2, status: "locked", category: "backend", courses: ["Rust Programming for Systems"] },

    // CLOUD / DEVOPS (Bottom Right)
    { id: "cloud-1", x: 700, y: 550, label: "Docker", level: 6, status: "unlocked", category: "cloud" },
    { id: "cloud-2", x: 800, y: 650, label: "Kubernetes", level: 3, status: "locked", category: "cloud" },
    { id: "cloud-3", x: 900, y: 550, label: "AWS", level: 5, status: "unlocked", category: "cloud" },
    { id: "cloud-4", x: 950, y: 650, label: "Terraform", level: 4, status: "locked", category: "cloud" },

    // AI & DATA (Top Left)
    { id: "ai-1", x: 300, y: 150, label: "Python", level: 7, status: "unlocked", category: "ai" },
    { id: "ai-2", x: 150, y: 100, label: "PyTorch", level: 2, status: "locked", category: "ai" },
    { id: "ai-3", x: 100, y: 50, label: "TensorFlow", level: 1, status: "locked", category: "ai" },
    { id: "ai-4", x: 400, y: 50, label: "LLMs", level: 5, status: "unlocked", category: "ai" },
];

const defaultConnections: Connection[] = [
    { from: "core-1", to: "core-2" }, { from: "core-1", to: "core-3" }, { from: "core-1", to: "core-4" },
    { from: "core-2", to: "fe-1" }, { from: "core-2", to: "be-1" }, { from: "core-2", to: "ai-1" },
    { from: "fe-1", to: "fe-2" }, { from: "fe-1", to: "fe-3" }, { from: "fe-2", to: "fe-4" }, { from: "fe-4", to: "fe-5" },
    { from: "be-1", to: "be-2" }, { from: "be-1", to: "be-3" }, { from: "be-3", to: "be-4" }, { from: "be-4", to: "be-5" },
    { from: "core-4", to: "cloud-1" }, { from: "cloud-1", to: "cloud-2" }, { from: "cloud-1", to: "cloud-3" }, { from: "cloud-3", to: "cloud-4" },
    { from: "ai-1", to: "ai-2" }, { from: "ai-2", to: "ai-3" }, { from: "ai-1", to: "ai-4" },
];

export function SkillTree({
    initialSkills = defaultSkills,
    initialConnections = defaultConnections,
    userSkills = [],
    recommendedResources = []
}: {
    initialSkills?: Skill[],
    initialConnections?: Connection[],
    userSkills?: string[],
    recommendedResources?: any[]
}) {
    const [mounted, setMounted] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [skillsMap] = useState<Skill[]>(() => {
        return initialSkills.map(s => ({
            ...s,
            status: userSkills.some(us => us.toLowerCase().includes(s.label.toLowerCase())) ? 'unlocked' : 'locked'
        }));
    });
    const [connectionsMap] = useState<Connection[]>(initialConnections);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[600px] bg-slate-900 rounded-3xl animate-pulse" />;

    const selectedSkillData = skillsMap.find(s => s.id === selectedSkill);

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
                            {connectionsMap.map((conn, i) => {
                                const start = skillsMap.find(s => s.id === conn.from)!;
                                const end = skillsMap.find(s => s.id === conn.to)!;
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

                        {skillsMap.map((skill) => (
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
                                        skill.category === 'backend' ? 'bg-emerald-500' :
                                            skill.category === 'cloud' ? 'bg-orange-500' :
                                                skill.category === 'ai' ? 'bg-purple-500' : 'bg-indigo-500'
                                )} />

                                {/* Orb Body */}
                                <div className={cn(
                                    "relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110",
                                    skill.status === 'locked' ? "bg-slate-800 border-slate-700" : "bg-slate-900 border-white/20"
                                )}>
                                    {skill.status === 'locked' ? (
                                        <div className="relative">
                                            <Lock size={20} className="text-slate-600" />
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                        </div>
                                    ) : (
                                        <span className={cn(
                                            "font-bold text-lg",
                                            skill.category === 'frontend' ? 'text-sky-400' :
                                                skill.category === 'backend' ? 'text-emerald-400' :
                                                    skill.category === 'cloud' ? 'text-orange-400' :
                                                        skill.category === 'ai' ? 'text-purple-400' : 'text-indigo-400'
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
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedSkillData?.label}</h2>
                                {selectedSkillData?.status === 'locked' && (
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-400/10 px-2 py-0.5 rounded">Gap Identified</span>
                                )}
                            </div>
                            <button onClick={() => setSelectedSkill(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Proficiency Range</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} className="opacity-30" />
                                        <Star size={16} className="opacity-30" />
                                    </div>
                                    <span className="text-white font-bold">Lvl {selectedSkillData?.level || 1}</span>
                                </div>
                            </div>

                            {/* Recommended Courses Section */}
                            <div className="space-y-3">
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Free Strategic Resources</div>
                                {(recommendedResources.length > 0 ? recommendedResources : (selectedSkillData?.courses || [])).map((resource: any, idx: number) => {
                                    const title = typeof resource === 'string' ? resource : resource.title;
                                    const url = typeof resource === 'string' ? `https://www.youtube.com/results?search_query=${encodeURIComponent(resource)}` : resource.url;

                                    return (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group/course"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300 group-hover/course:text-white transition-colors">{title}</span>
                                                {resource.type && <span className="text-[10px] text-slate-500 uppercase">{resource.type}</span>}
                                            </div>
                                            <Zap size={14} className="text-yellow-500 opacity-50 group-hover/course:opacity-100 transition-opacity" />
                                        </a>
                                    );
                                })}
                            </div>

                            <button className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-900/20">
                                Mastery Roadmap
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
