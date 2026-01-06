"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Video, Timer, AlertCircle, Bot, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { analyzeInterviewPerformance } from "@/app/(dashboard)/interview/actions";

export function InterviewCoach() {
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    const questions = [
        "Tell me about a time you had a conflict with a coworker...",
        "Describe a complex architectural challenge you solved recently.",
        "How do you stay updated with rapidly evolving tech stacks?",
        "Explain the CAP theorem as if I were a junior developer."
    ];

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let current = "";
                for (let i = 0; i < event.results.length; i++) {
                    current += event.results[i][0].transcript;
                }
                setTranscript(current);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsRecording(false);
                if (event.error === 'not-allowed') {
                    toast.error("Microphone Access Denied", {
                        description: "Please enable microphone permissions in your browser settings to use the AI Coach."
                    });
                } else {
                    toast.error("Speech Recognition Error", {
                        description: "Something went wrong with the voice input. Please try again."
                    });
                }
            };
        }
    }, []);

    const toggleRecording = async () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            setIsLoading(true);

            // Call actual AI backend
            const result = await analyzeInterviewPerformance(transcript, questions[currentQuestionIndex]);
            if (result.success) {
                setFeedback(result.analysis);
                setHasRecorded(true);
            }
            setIsLoading(false);
        } else {
            setTranscript("");
            setHasRecorded(false);
            setIsRecording(true);
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Failed to start recognition", e);
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        AI Mock Interview
                    </h3>
                    <p className="text-xs text-slate-500">Practice your soft skills & delivery</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        disabled={isRecording || isLoading}
                        onClick={() => setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length)}
                        className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:text-sky-700 transition-colors disabled:opacity-50"
                    >
                        Switch Question
                    </button>
                    <div className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100">
                        <Timer size={14} />
                        01:59
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-slate-950 relative min-h-[400px]">
                {/* Simulated Waveform Overlay */}
                {isRecording && (
                    <div className="absolute top-0 left-0 right-0 h-1 flex gap-1 px-1">
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, Math.random() * 40 + 10, 4] }}
                                transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                                className="flex-1 bg-sky-400/30 rounded-full"
                            />
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-white text-center flex-col bg-slate-950/80 backdrop-blur-sm z-20">
                        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-6" />
                        <h4 className="text-xl font-bold">Analyzing Your Breakdown...</h4>
                        <p className="text-slate-400 text-sm mt-2">Sage is evaluating your architectural sentiment.</p>
                    </div>
                ) : !hasRecorded ? (
                    <>
                        {/* Camera Viewfinder (Simulated) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-slate-700 group">
                                <Video size={48} className="mx-auto mb-4 opacity-20 group-hover:opacity-40 transition-opacity" />
                                <p className="text-sm font-medium tracking-tight">Camera Feed Encrypted</p>
                                <p className="text-[10px] text-slate-800 mt-1 uppercase font-bold tracking-widest">Secure Tunnel Active</p>
                            </div>
                        </div>

                        {/* AI Avatar Overlay */}
                        <div className="absolute top-6 right-6 w-28 h-36 bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl overflow-hidden backdrop-blur-xl">
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-black">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center text-white">
                                            <Bot size={20} />
                                        </div>
                                    </div>
                                    {isRecording && <div className="absolute -inset-2 border-2 border-sky-400 rounded-full animate-ping opacity-20" />}
                                </div>
                            </div>
                        </div>

                        {/* Live Transcript Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">AI Interviewer:</p>
                            <p className="text-white text-xl font-bold leading-relaxed tracking-tight max-w-2xl mb-6">
                                "{questions[currentQuestionIndex]}"
                            </p>
                            {transcript && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-[10px] text-sky-400 font-bold uppercase mb-2">Live Transcript</p>
                                    <p className="text-slate-300 text-sm italic">"{transcript}..."</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center p-8 text-white text-center flex-col bg-slate-900 overflow-y-auto"
                    >
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={24} className="text-emerald-400" />
                        </div>
                        <h4 className="text-2xl font-bold mb-2">Interview Analysis Complete</h4>
                        <p className="text-slate-400 text-sm max-w-md mb-8">
                            {feedback.feedback}
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Confidence Rank</div>
                                <div className="text-sky-400 font-bold text-lg">Top {feedback.percentile}%</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Sentiment</div>
                                <div className="text-emerald-400 font-bold text-lg">{feedback.sentiment}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Delivery Pace</div>
                                <div className="text-white font-bold text-lg">{feedback.pace}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fillers</div>
                                <div className="text-rose-400 font-bold text-lg">{feedback.fillers} DETECTED</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setHasRecorded(false)}
                                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Practice Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-lg shadow-sm">😊</div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-lg shadow-sm">😐</div>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Neural Analysis</span>
                        <span className="text-[10px] text-emerald-500 font-bold">Live Stream Active</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {isRecording && (
                        <span className="text-xs font-bold text-rose-500 flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            RECORDING
                        </span>
                    )}
                    <button
                        onClick={toggleRecording}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95",
                            isRecording ? "bg-rose-500 text-white" : "bg-slate-900 text-white"
                        )}
                    >
                        {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic size={28} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
