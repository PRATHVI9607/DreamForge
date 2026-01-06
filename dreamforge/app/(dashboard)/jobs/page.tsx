"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchRealTimeJobs } from "./actions";

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            const res = await fetchRealTimeJobs();
            if (res.success) {
                setJobs(res.jobs);
            }
            setIsLoading(false);
        };
        loadJobs();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[600px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Forging real-time opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto fade-in pb-20">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">Opportunity Forge</h1>
                    <p className="text-muted-foreground mt-2">AI-matched roles based on your current skill constellation.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full border border-sky-100 shadow-sm text-sky-700 font-bold text-[10px] uppercase tracking-widest">
                        <Sparkles size={12} className="text-sky-500 animate-pulse" />
                        Industry Live Data
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm text-emerald-700 font-bold text-sm">
                        <ShieldCheck size={16} />
                        Identity Verified
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job List */}
                <div className="lg:col-span-2 space-y-4">
                    {jobs.map((job: any, idx: number) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedJob(job)}
                            className={cn(
                                "p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden",
                                selectedJob?.id === job.id
                                    ? "bg-white border-sky-200 shadow-xl shadow-sky-100/50 ring-2 ring-sky-50"
                                    : "bg-white border-slate-100 hover:border-sky-200 hover:shadow-lg shadow-sm"
                            )}
                        >
                            <div className="flex gap-6 items-start">
                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg", job.color)}>
                                    {job.logo}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                                            <p className="text-slate-500 font-medium">{job.company}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-bold border border-sky-100">
                                                <Zap size={12} className="fill-sky-600" />
                                                {job.match}% AI Match
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">Posted 2d ago</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-slate-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign size={16} className="text-slate-400" />
                                            {job.salary}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={16} className="text-slate-400" />
                                            {job.type}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {job.requirements.slice(0, 3).map((req: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
                                                {req}
                                            </span>
                                        ))}
                                        {job.requirements.length > 3 && (
                                            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold border border-slate-100">
                                                +{job.requirements.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Insights Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-8 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 animate-pulse" />

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Sparkles className="text-sky-400" />
                                Growth Insights
                            </h3>

                            {selectedJob ? (
                                <div className="space-y-8 fade-in">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">Target Match</p>
                                        <div className="text-5xl font-bold text-white tracking-tight">{selectedJob.match}%</div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Skill Gaps</h4>
                                            <div className="space-y-2">
                                                <p className="text-sm text-slate-300">You need to master <span className="text-white font-bold">"Distributed Systems"</span> to reach 100%.</p>
                                                <button className="text-xs font-bold text-sky-500 hover:underline">Add to Learning Plan</button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Market Value</h4>
                                            <p className="text-sm text-slate-300">This role represents a <span className="text-emerald-400 font-bold">+22% increase</span> over market average for your current level.</p>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn">
                                        Apply via DreamForge
                                        <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <Trophy className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 font-medium">Select a role to view deep architecture alignment & salary insights.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
