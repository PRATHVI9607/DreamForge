import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userSkills, skills } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ArrowUpRight, Flame, Trophy, Target, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillTree } from "@/components/features/growth/SkillTree";
import { SageChat } from "@/components/features/ai/SageChat";
import Link from "next/link";
import { CheckInButton } from "./CheckInButton";
import { DashboardTabs } from "@/components/features/dashboard/DashboardTabs";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id));

    // Fetch user's skills for the constellation
    const userSkillsData = await db
        .select({
            name: skills.name,
            category: skills.category
        })
        .from(userSkills)
        .innerJoin(skills, eq(userSkills.skillId, skills.id))
        .where(eq(userSkills.userId, session.user.id));

    // Fallbacks for fresh users
    const matchScore = userData?.matchScore ?? 0;
    const level = userData?.level ?? 1;
    const xp = userData?.xp ?? 0;
    const streak = userData?.streak ?? 0;
    const targetRole = userData?.targetRole ?? "Not Set";
    const analysis = (userData?.professionalAnalysis as any) || null;
    const insights = (userData?.careerInsights as any) || null;

    const userSkillNames = userSkillsData.map(s => s.name);
    const resources = insights?.recommendedResources || [];

    // Helper for Level Names
    const getLevelName = (lvl: number) => {
        if (lvl <= 2) return "Aspiring";
        if (lvl <= 4) return "Professional";
        if (lvl <= 6) return "Senior";
        if (lvl <= 8) return "Principal";
        return "Architect";
    };

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto relative z-10 fade-in pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight">Growth Hub</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {matchScore >
                            0 ? `Your trajectory is aligned for ${getLevelName(level + 1)} status.`
                            : "Welcome to the Forge. Complete onboarding to start your journey."}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-default">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                        <span className="font-bold text-slate-700">{streak} Day Streak</span>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Match Score"
                    value={`${matchScore}%`}
                    trend={analysis?.marketPosition || "Analyzing..."}
                    trendType={matchScore > 60 ? "positive" : "neutral"}
                    icon={<Target className="w-6 h-6 text-sky-600" />}
                    iconBg="bg-sky-50"
                />
                <StatCard
                    title="Current Level"
                    value={`Lvl ${level}`}
                    trend={getLevelName(level)}
                    trendType="positive"
                    icon={<Trophy className="w-6 h-6 text-indigo-600" />}
                    iconBg="bg-indigo-50"
                />
                <StatCard
                    title="Target Role"
                    value={targetRole === "Not Set" ? (analysis?.targetRoles?.[0] || "Not Set") : targetRole}
                    trend="Market alignment active"
                    trendType="positive"
                    icon={<ArrowUpRight className="w-6 h-6 text-emerald-600" />}
                    iconBg="bg-emerald-50"
                />
            </div>

            <DashboardTabs
                hasSkills={matchScore > 0}
                userSkills={userSkillNames}
                recommendedResources={resources}
                overview={
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Skill Tree Card */}
                            <div className="min-h-[500px] bg-white rounded-3xl border border-border/50 shadow-sm p-8 relative overflow-hidden group hover:shadow-md transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h3 className="text-xl font-bold text-slate-800">Skill Orb Constellation</h3>
                                    <Link href="/tree" className="text-sm font-semibold text-sky-600 hover:text-sky-700">Expand View</Link>
                                </div>
                                <div className="w-full h-[600px] border-slate-100 rounded-2xl bg-slate-50 relative z-10 overflow-hidden flex items-center justify-center">
                                    {matchScore > 0 ? (
                                        <SkillTree />
                                    ) : (
                                        <div className="text-center p-8">
                                            <Sparkles className="w-12 h-12 text-sky-300 mx-auto mb-4" />
                                            <p className="text-slate-400 font-medium">Complete onboarding to generate your skill orb constellation.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Strategic Insight */}
                            {matchScore > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
                                        <h4 className="text-sky-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Zap size={14} className="fill-sky-400" />
                                            Strategic Next Steps
                                        </h4>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Immediate (Weekly)</p>
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">{insights?.immediate || "Fetching AI guidance..."}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Strategic (6 Month)</p>
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">{insights?.strategic || "Analyzing market trends..."}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col">
                                        <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Verified Core Strengths</h4>
                                        <div className="flex flex-wrap gap-2.5 mb-8">
                                            {analysis?.strengths?.map((s: string, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-100 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {s}
                                                </span>
                                            )) || "Analyzing..."}
                                        </div>
                                        <div className="mt-auto space-y-3">
                                            <p className="text-xs text-slate-500 font-medium italic">"Your architectural depth in Distributed Systems stands out."</p>
                                            <Link href="/jobs" className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all text-sm group">
                                                Discover Regional Matches
                                                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Activity Section */}
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">System Reliability & Uptime</h3>
                                <div className="h-32 flex items-end gap-1 px-2">
                                    {[...Array(40)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex-1 rounded-full transition-all duration-500",
                                                i > 30 ? "bg-slate-100 h-8" : "bg-emerald-400 h-16 hover:h-24"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span>30 days ago</span>
                                    <span className="text-emerald-500">99.9% Operational</span>
                                    <span>Today</span>
                                </div>
                            </div>
                        </div>

                        {/* Gap List Column */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col hover:shadow-md transition-all duration-500 min-h-[500px]">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">Gap Prescriptive List</h3>
                                <div className="flex-1 space-y-4">
                                    {matchScore > 0 ? (
                                        <>
                                            {analysis?.weaknesses?.map((w: string, i: number) => (
                                                <GapItem
                                                    key={i}
                                                    skill={w}
                                                    impact={`+${Math.floor(Math.random() * 5) + 3}% Match`}
                                                    progress={Math.floor(Math.random() * 40) + 10}
                                                    colorClass={i % 2 === 0 ? "bg-sky-500" : "bg-indigo-500"}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div className="text-center py-20">
                                            <Target className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                            <p className="text-sm text-slate-400 font-medium">Analysis pending profile completion.</p>
                                        </div>
                                    )}
                                </div>
                                {matchScore > 0 ? (
                                    <CheckInButton />
                                ) : (
                                    <Link
                                        href="/profile"
                                        className="w-full py-4 mt-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 text-center block"
                                    >
                                        Begin Onboarding
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                }
            />
            <SageChat />
        </div>
    )
}

function StatCard({ title, value, trend, trendType, icon, iconBg }: any) {
    return (
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 hover:border-sky-100 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-4 rounded-2xl transition-colors", iconBg)}>
                    {icon}
                </div>
                {trendType === 'positive' && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                        {trend}
                    </span>
                )}
                {trendType === 'neutral' && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                        {trend}
                    </span>
                )}
                {trendType === 'negative' && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
            <div className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">{value}</div>
        </div>
    )
}

function GapItem({ skill, impact, progress, colorClass }: any) {
    return (
        <Link href="/tree">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all cursor-pointer group relative">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-slate-700 group-hover:text-sky-700 transition-colors">{skill}</span>
                    <span className="text-xs font-bold text-sky-600 bg-sky-100/50 px-2 py-1 rounded-lg">{impact}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", colorClass)} style={{ width: `${progress}%` }} />
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={12} className="text-sky-400" />
                </div>
            </div>
        </Link>
    )
}
