import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="w-20 h-20 bg-sky-500 rounded-3xl rotate-3 mb-8 shadow-2xl shadow-sky-500/20 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white rounded-full" />
        </div>

        <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Dream<span className="text-sky-500">Forge</span>
        </h1>

        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          Architect your career with AI-driven insights. Visualize your path, clear your gaps, and accelerate your growth.
        </p>

        <Link
          href="/dashboard"
          className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/10 active:scale-95 inline-block"
        >
          Launch Platform
        </Link>

        <div className="mt-12 flex gap-8 text-sm text-slate-400 font-medium">
          <span>Growth Hub</span>
          <span>•</span>
          <span>Career Map</span>
          <span>•</span>
          <span>AI Coach</span>
        </div>
      </div>
    </main>
  );
}
