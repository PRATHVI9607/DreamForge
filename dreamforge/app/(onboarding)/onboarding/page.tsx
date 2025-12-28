"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight, Upload, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "./actions";

// Step Schemas
const bioSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    bio: z.string().min(10, "Tell us a bit more about yourself"),
    experienceLevel: z.string().min(1, "Experience level is required"),
});

const steps = [
    { id: 1, title: "Bio & Goals", desc: "Let's get to know you" },
    { id: 2, title: "Ingestion", desc: "Upload your history" },
    { id: 3, title: "Validation", desc: "AI Analysis" },
    { id: 4, title: "Target Role", desc: "Set your objective" },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const router = useRouter();

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleFinish = async (targetRole: string) => {
        const finalData = { ...formData, targetRole };

        try {
            await saveOnboardingData(finalData);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#6366f1', '#ffffff'] // Sky, Indigo, White
            });

            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            console.error("Failed to save onboarding:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-100 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-3xl z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step) => (
                            <div key={step.id} className={cn("text-xs font-bold uppercase tracking-wider transition-colors", currentStep >= step.id ? "text-sky-600" : "text-slate-400")}>
                                {step.title}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                            className="h-full bg-sky-500 rounded-full"
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Card Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <StepBio key="step1" onNext={(data) => { setFormData({ ...formData, ...data }); nextStep(); }} />
                        )}
                        {currentStep === 2 && (
                            <StepIngestion key="step2" onNext={() => nextStep()} />
                        )}
                        {currentStep === 3 && (
                            <StepParsing key="step3" onNext={() => nextStep()} />
                        )}
                        {currentStep === 4 && (
                            <StepTarget key="step4" onFinish={(selected) => handleFinish(selected)} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StepBio({ onNext }: { onNext: (data: any) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(bioSchema)
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 1: The Basics</h2>
            <p className="text-slate-500 mb-8">Tell us about your starting point.</p>

            <form onSubmit={handleSubmit(onNext)} className="space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input {...register("fullName")} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" placeholder="e.g. Alex Chen" />
                    {errors.fullName && <span className="text-red-500 text-xs">{(errors.fullName as any).message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Short Bio</label>
                    <textarea {...register("bio")} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none h-24" placeholder="I'm a passionate developer looking to..." />
                    {errors.bio && <span className="text-red-500 text-xs">{(errors.bio as any).message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                        {["Student", "Junior", "Mid", "Senior", "Lead"].map((level) => (
                            <label key={level} className="cursor-pointer">
                                <input type="radio" value={level} {...register("experienceLevel")} className="peer hidden" />
                                <div className="p-3 text-center text-sm font-medium rounded-xl bg-slate-50 border border-slate-200 peer-checked:bg-sky-500 peer-checked:text-white peer-checked:border-sky-500 hover:bg-slate-100 transition-all">
                                    {level}
                                </div>
                            </label>
                        ))}
                    </div>
                    {errors.experienceLevel && <span className="text-red-500 text-xs">{(errors.experienceLevel as any).message}</span>}
                </div>

                <div className="mt-auto pt-8 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95">
                        Next Step <ChevronRight size={16} />
                    </button>
                </div>
            </form>
        </motion.div>
    )
}

function StepIngestion({ onNext }: { onNext: () => void }) {
    const [dragging, setDragging] = useState(false);

    // Mock upload delay
    const handleUpload = () => {
        setTimeout(onNext, 1500);
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 2: Resume Ingestion</h2>
            <p className="text-slate-500 mb-8">Upload your CV to auto-generate your skill tree.</p>

            <div
                className={cn(
                    "flex-1 border-3 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-all duration-300",
                    dragging ? "border-sky-500 bg-sky-50/20" : "border-slate-200 bg-slate-50/30"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(); }}
            >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Upload className={cn("w-10 h-10 transition-colors", dragging ? "text-sky-500" : "text-slate-300")} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Drag & Drop Resume</h3>
                <p className="text-sm text-slate-400 mt-2">or click to browse (PDF, DOCX)</p>

                <button
                    onClick={handleUpload}
                    className="mt-8 px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:border-sky-300 text-slate-600 shadow-sm"
                >
                    Select File
                </button>
            </div>

            <div className="flex justify-between mt-8 items-center">
                <button onClick={onNext} className="text-sm text-slate-400 hover:text-slate-600 font-medium">Skip for now</button>
            </div>
        </motion.div>
    )
}

import { useEffect } from "react";

function StepParsing({ onNext }: { onNext: () => void }) {
    // Simulate AI parsing delay
    useEffect(() => {
        const timer = setTimeout(onNext, 3000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
        >
            <div className="mb-8 relative">
                <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-sky-500 opactiy-50" />
                </div>
                {/* Orbital Spinner */}
                <div className="absolute inset-0 border-4 border-sky-200 border-t-transparent rounded-full animate-spin" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Profile...</h2>
            <div className="space-y-2 mt-4">
                <SkeletonRow width="w-64" />
                <SkeletonRow width="w-48" />
                <SkeletonRow width="w-56" />
            </div>

            <p className="text-sm text-slate-400 mt-8">Extracting skills from "Resume_2025.pdf"</p>
        </motion.div>
    )
}

function SkeletonRow({ width }: { width: string }) {
    return (
        <div className={`h-4 ${width} bg-slate-100 rounded-full mx-auto overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-shimmer" />
        </div>
    )
}

function StepTarget({ onFinish }: { onFinish: (role: string) => void }) {
    const [selected, setSelected] = useState<string | null>(null);
    const roles = ["Frontend Engineer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer", "Product Manager", "UX Designer"];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 4: Target Role</h2>
            <p className="text-slate-500 mb-6">What is your dream job?</p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {roles.map((role) => (
                    <div
                        key={role}
                        onClick={() => setSelected(role)}
                        className={cn(
                            "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]",
                            selected === role ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500" : "border-slate-100 bg-white hover:border-sky-200"
                        )}
                    >
                        <span className={cn("font-medium", selected === role ? "text-sky-900" : "text-slate-700")}>{role}</span>
                        {selected === role && <CheckCircle2 className="w-5 h-5 text-sky-500" />}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => onFinish(selected!)}
                    disabled={!selected}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Enter DreamForge <Sparkles size={16} />
                </button>
            </div>
        </motion.div>
    )
}
