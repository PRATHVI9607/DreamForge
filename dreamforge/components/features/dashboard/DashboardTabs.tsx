"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Network } from "lucide-react";
import { SkillTree } from "@/components/features/growth/SkillTree";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardTabsProps {
    overview: React.ReactNode;
    hasSkills: boolean;
    userSkills?: string[];
    recommendedResources?: any[];
}

export function DashboardTabs({ overview, hasSkills, userSkills = [], recommendedResources = [] }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "tree">("overview");

    return (
        <div className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-inner">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm",
                        activeTab === "overview"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <LayoutDashboard size={18} />
                    System Overview
                </button>
                <button
                    onClick={() => setActiveTab("tree")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm",
                        activeTab === "tree"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Network size={18} />
                    Skill Constellation
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {overview}
                    </motion.div>
                ) : (
                    <motion.div
                        key="tree"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[700px]"
                    >
                        {hasSkills ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Interactive Skill Constellation</h3>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-lg text-sky-600 text-xs font-bold border border-sky-100 italic">
                                            LIVE PERSPECTIVE
                                        </div>
                                    </div>
                                </div>
                                <SkillTree
                                    userSkills={userSkills}
                                    recommendedResources={recommendedResources}
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                    <Network size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">No Data Detected</h3>
                                <p className="text-slate-400 mt-2 max-w-xs">Upload your resume in the Profile section to seed your unique skill constellation.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
