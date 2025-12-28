import { FlaskConical, Beaker, Zap, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function LabPage() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto fade-in">
            <header>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">Design Lab</h1>
                <p className="text-muted-foreground mt-2">Experimental features and what-if simulators.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-sky-600 group-hover:scale-110 transition-transform">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">What-If Simulator</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Project your career 5 years into the future. See how acquiring "Cloud Architecture" changes your market value score.
                    </p>
                    <button className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Beaker size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">A/B Career Branching</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Compare two different career trajectories side-by-side. Management vs. IC track analysis.
                    </p>
                    <button className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                        Coming Soon
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
