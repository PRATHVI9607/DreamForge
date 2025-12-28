"use client";

import { useState } from "react";
import { Mic, Video, Timer, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function InterviewCoach() {
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">AI Mock Interview</h3>
                    <p className="text-xs text-slate-500">Practice your soft skills</p>
                </div>
                <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold flex items-center gap-1">
                    <Timer size={12} />
                    02:00
                </div>
            </div>

            <div className="flex-1 bg-slate-900 relative">
                {/* Camera Viewfinder (Simulated) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                        <Video size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Camera Preview Disabled</p>
                    </div>
                </div>

                {/* AI Avatar Overlay */}
                <div className="absolute top-4 right-4 w-24 h-32 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-indigo-500" />
                        </div>
                    </div>
                </div>

                {/* Live Transcript Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                    <p className="text-white/80 text-lg font-medium leading-relaxed">
                        "Tell me about a time you had a conflict with a coworker..."
                    </p>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">😊</div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">😐</div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Analysis Pending</span>
                </div>

                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                        isRecording ? "bg-rose-500 text-white animate-pulse" : "bg-slate-900 text-white"
                    )}
                >
                    <Mic size={24} />
                </button>
            </div>
        </div>
    )
}
