"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Sparkles, Target } from "lucide-react";

export function WhatIfSim() {
    const [years, setYears] = useState(2);
    const [skillFocus, setSkillFocus] = useState("AI/ML");

    // Simple projection logic
    const baseSalary = 120000;
    const yearMultiplier = 1 + (years * 0.15);
    const skillMultiplier = skillFocus === "AI/ML" ? 1.4 : skillFocus === "Cloud" ? 1.25 : 1.1;
    const projectedSalary = Math.round(baseSalary * yearMultiplier * skillMultiplier);
    const projectedLevel = Math.min(10, 3 + years + (skillFocus === "AI/ML" ? 1 : 0));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-4">Time Horizon: {years} Years</label>
                        <input
                            type="range"
                            min="1" max="10"
                            value={years}
                            onChange={(e) => setYears(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Now</span>
                            <span>2y</span>
                            <span>5y</span>
                            <span>10y</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-4">Specialization Focus</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["Frontend", "Cloud", "AI/ML"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSkillFocus(s)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${skillFocus === s
                                            ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-900/40"
                                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <h4 className="text-sky-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={14} />
                        Projection Result
                    </h4>

                    <div className="space-y-6">
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase mb-1">Projected Salary</p>
                            <div className="text-4xl font-bold text-white tracking-tight">
                                ${projectedSalary.toLocaleString()}
                                <span className="text-emerald-400 text-sm ml-2 font-medium">+{Math.round((projectedSalary / baseSalary - 1) * 100)}%</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Est. Level</p>
                                <p className="text-xl font-bold text-white">Lvl {projectedLevel}</p>
                            </div>
                            <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Market Match</p>
                                <p className="text-xl font-bold text-white">94%</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                                <Sparkles size={16} />
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                "Focusing on <span className="text-white font-bold">{skillFocus}</span> while architectural depth grows over <span className="text-white font-bold">{years} years</span> puts you in the top 5% of earners."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-900/20 flex items-center justify-center gap-2 group">
                Save Simulation to Career Path
                <Target size={18} className="group-hover:scale-125 transition-transform" />
            </button>
        </div>
    );
}
