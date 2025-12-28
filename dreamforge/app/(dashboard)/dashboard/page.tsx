import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ArrowUpRight, Flame, Trophy, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillTree } from "@/components/features/growth/SkillTree";
import { SageChat } from "@/components/features/ai/SageChat";
import Link from "next/link";
import { CheckInButton } from "./CheckInButton";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id));

    // Fallbacks for fresh users
    const matchScore = userData?.matchScore ?? 0;
    const level = userData?.level ?? 1;
    const xp = userData?.xp ?? 0;
    const streak = userData?.streak ?? 0;
    const targetRole = userData?.targetRole ?? "Not Set";

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto relative z-10 fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight">Growth Hub</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {matchScore > 0 ? "Your trajectory is optimal, Pioneer." : "Welcome to the Forge. Complete onboarding to start your journey."}
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
                    trend={matchScore > 0 ? "+0%" : "Neutral"}
                    trendType={matchScore > 0 ? "positive" : "neutral"}
                    icon={<Target className="w-6 h-6 text-sky-600" />}
                    iconBg="bg-sky-50"
                />
                <StatCard
                    title="Current Level"
                    value={`Lvl ${level}`}
                    trend={`${xp} XP Total`}
                    trendType="neutral"
                    icon={<Trophy className="w-6 h-6 text-indigo-600" />}
                    iconBg="bg-indigo-50"
                />
                <StatCard
                    title="Target Role"
                    value={targetRole}
                    trend="Market alignment active"
                    trendType="positive"
                    icon={<ArrowUpRight className="w-6 h-6 text-emerald-600" />}
                    iconBg="bg-emerald-50"
                />
            </div>

            {/* Dashboard Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 min-h-[500px] bg-white rounded-3xl border border-border/50 shadow-sm p-8 relative overflow-hidden group hover:shadow-md transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-800">Skill Orb Constellation</h3>
                        <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">Expand View</button>
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

                <div className="min-h-[500px] bg-white rounded-3xl border border-border/50 shadow-sm p-8 flex flex-col hover:shadow-md transition-all duration-500">
                    <h3 className="text-xl font-bold mb-6 text-slate-800">Gap Prescriptive List</h3>
                    <div className="flex-1 space-y-4">
                        {matchScore > 0 ? (
                            <>
                                <GapItem
                                    skill="Next.js Server Actions"
                                    impact="+8% Match"
                                    progress={45}
                                    colorClass="bg-sky-500"
                                />
                                <GapItem
                                    skill="Postgres Optimization"
                                    impact="+5% Match"
                                    progress={30}
                                    colorClass="bg-indigo-500"
                                />
                                <GapItem
                                    skill="System Design"
                                    impact="+7% Match"
                                    progress={15}
                                    colorClass="bg-emerald-500"
                                />
                                <GapItem
                                    skill="AWS Lambda"
                                    impact="+4% Match"
                                    progress={0}
                                    colorClass="bg-orange-500"
                                />
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <Target className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm text-slate-400">Analysis pending profile completion.</p>
                            </div>
                        )}
                    </div>
                    {matchScore > 0 ? (
                        <CheckInButton />
                    ) : (
                        <Link
                            href="/onboarding"
                            className="w-full py-4 mt-6 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 text-center block"
                        >
                            Begin Onboarding
                        </Link>
                    )}
                </div>
            </div>
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
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all cursor-pointer group">
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-700 group-hover:text-sky-700 transition-colors">{skill}</span>
                <span className="text-xs font-bold text-sky-600 bg-sky-100/50 px-2 py-1 rounded-lg">{impact}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", colorClass)} style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}
