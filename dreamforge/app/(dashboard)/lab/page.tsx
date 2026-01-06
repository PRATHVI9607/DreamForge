"use client";

import { FlaskConical, Beaker, Zap, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { WhatIfSim } from "./WhatIfSim";

export default function LabPage() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto fade-in">
            <header>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">Design Lab</h1>
                <p className="text-muted-foreground mt-2">Experimental features and what-if simulators.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="md:col-span-2 p-10 bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform border border-sky-500/20">
                            <Zap size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">Architecture What-If Simulator</h3>
                            <p className="text-slate-400">Project your trajectory based on skill acquisition and time.</p>
                        </div>
                    </div>

                    <WhatIfSim />
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Beaker size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">A/B Career Branching</h3>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 p-3 bg-sky-50 rounded-xl border border-sky-100">
                            <p className="text-[10px] font-bold text-sky-600 uppercase mb-1">Track A</p>
                            <p className="text-xs font-bold text-slate-700">Individual Contributor</p>
                        </div>
                        <div className="flex-1 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Track B</p>
                            <p className="text-xs font-bold text-slate-700">Engineering Manager</p>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/10">
                        Compare Tracks
                    </button>
                </div>
            </div>

            <div className="mt-12 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                <h2 className="text-3xl font-bold mb-4 relative z-10">Sage AI Integration</h2>
                <p className="max-w-xl mx-auto text-slate-400 mb-8 relative z-10 italic">
                    "The Lab is where we forge the future. Every simulation brings you closer to your optimal self."
                </p>
                <Link href="/dashboard" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 relative z-10">
                    <LayoutDashboard size={20} />
                    Back to Hub
                </Link>
            </div>
        </div>
    );
}
