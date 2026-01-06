"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Upload, CheckCircle, FileText, Download, User, Settings, Shield, Sparkles, Zap, CloudUpload, Eye, EyeOff, CheckCircle2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { parseResumeAndSeed } from "./actions";

export default function ProfilePage() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [redactionEnabled, setRedactionEnabled] = useState(true);
    const [isImporting, setIsImporting] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateImport = async (type: string) => {
        setIsImporting(type);
        const toastId = toast.loading(`Connecting to ${type}...`);

        // Dynamic wait based on type
        await new Promise(r => setTimeout(r, 2500));

        toast.dismiss(toastId);
        toast.success(`Successfully imported architectural data from ${type}!`);
        setIsImporting(null);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            await parseResumeAndSeed(formData);
            toast.success("Resume parsed successfully! Your dashboard has been updated.");
        } catch (error) {
            toast.error("Failed to parse resume. Please try again.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Ingestion</h1>
                    <p className="text-slate-500 max-w-lg">Upload your resume or connect external accounts to generate your initial skill graph.</p>
                </div>
                <a
                    href="/demo_resume.txt"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100 font-bold text-sm hover:bg-sky-100 transition-colors"
                >
                    <FileText size={18} />
                    Download Test Resume
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Zone */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.docx,.json"
                    onChange={handleUpload}
                />
                <motion.div
                    className={cn(
                        "relative w-full aspect-square md:aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group",
                        isDragging ? "border-sky-500 bg-sky-50/50 shadow-lg shadow-sky-100 ring-4 ring-sky-100/50" : "border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/50",
                        isUploading && "opacity-50 pointer-events-none"
                    )}
                    onMouseEnter={() => setIsDragging(true)}
                    onMouseLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: isDragging ? 1.1 : 1 }}
                        className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300", isDragging ? "bg-sky-100" : "bg-slate-100")}
                    >
                        {isUploading ? (
                            <Sparkles className="w-8 h-8 text-sky-600 animate-spin" />
                        ) : (
                            <CloudUpload className={cn("w-8 h-8 transition-colors duration-300", isDragging ? "text-sky-600" : "text-slate-400")} />
                        )}
                    </motion.div>

                    <h3 className="text-xl font-bold text-slate-900 relative z-10">
                        {isUploading ? "Forging your profile..." : "Drop your Resume here"}
                    </h3>
                    <p className="text-slate-400 mt-2 text-sm relative z-10">
                        {isUploading ? "Sage AI is analyzing your architectural depth" : "PDF, DOCX, or JSON (Max 5MB)"}
                    </p>

                    {!isUploading && (
                        <div className="mt-8 flex gap-3 relative z-10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md shadow-slate-900/10"
                            >
                                Browse Files
                            </motion.button>
                        </div>
                    )}

                    {/* Background Animation pattern */}
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.1] pointer-events-none"
                        />
                    )}
                </motion.div>

                {/* Import Options */}
                <div className="space-y-6">
                    <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                    <FileText className="w-8 h-8 text-sky-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Experience the AI Forensic</h3>
                                    <p className="text-slate-500 text-sm">Download a curated resume to test our deep parsing capabilities.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="/demo_resume.txt"
                                    download
                                    className="px-6 py-3 bg-white text-sky-600 font-bold rounded-2xl hover:bg-sky-50 transition-all border border-sky-200 shadow-sm flex items-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    Full Stack Architect
                                </a>
                                <a
                                    href="/os_expert_resume.txt"
                                    download
                                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Zap size={16} className="text-yellow-400" />
                                    OS Specialist (India)
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <Github className="w-6 h-6 text-slate-900" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">GitHub Import</h3>
                                <p className="text-xs text-slate-500">Scrapes public repos for languages</p>
                            </div>
                            <button
                                onClick={() => simulateImport('GitHub')}
                                disabled={!!isImporting}
                                className="ml-auto px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50"
                            >
                                {isImporting === 'GitHub' ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="github.com/username"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                        />
                    </div>

                    <div className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <Linkedin className="w-6 h-6 text-indigo-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">LinkedIn Import</h3>
                                <p className="text-xs text-slate-500">Extracts work history & skills</p>
                            </div>
                            <button
                                onClick={() => simulateImport('LinkedIn')}
                                disabled={!!isImporting}
                                className="ml-auto px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isImporting === 'LinkedIn' ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                    </div>

                    {/* Privacy Toggle */}
                    <div className="bg-white rounded-3xl border border-border p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg transition-colors", redactionEnabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                {redactionEnabled ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Data Redaction</h3>
                                <p className="text-xs text-slate-500">Hide phone & address from AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setRedactionEnabled(!redactionEnabled)}
                            className={cn(
                                "w-12 h-7 rounded-full p-1 transition-colors relative",
                                redactionEnabled ? "bg-emerald-500" : "bg-slate-200"
                            )}
                        >
                            <motion.div
                                animate={{ x: redactionEnabled ? 20 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
