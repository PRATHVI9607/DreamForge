import { InterviewCoach } from "@/components/features/prep/InterviewCoach";

export default function InterviewPage() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto fade-in">
            <header>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">AI Interview Coach</h1>
                <p className="text-muted-foreground mt-2">Refine your delivery with our persona-based simulator.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl min-h-[600px]">
                <InterviewCoach />
            </div>
        </div>
    );
}
