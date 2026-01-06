import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userSkills, skills } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SkillTree } from "@/components/features/growth/SkillTree";

export default async function TreePage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id));

    const userSkillsData = await db
        .select({
            name: skills.name,
        })
        .from(userSkills)
        .innerJoin(skills, eq(userSkills.skillId, skills.id))
        .where(eq(userSkills.userId, session.user.id));

    const insights = (userData?.careerInsights as any) || null;
    const userSkillNames = userSkillsData.map(s => s.name);
    const resources = insights?.recommendedResources || [];

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight">Skill Architecture</h1>
                    <p className="text-muted-foreground mt-2">Comprehensive mapping of your verified vs. target competencies.</p>
                </div>
                <div className="flex gap-4 mb-1">
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700 uppercase">Live Intelligence Active</span>
                    </div>
                </div>
            </header>

            <div className="bg-slate-900 rounded-[3rem] p-1 border border-slate-800 shadow-2xl overflow-hidden h-[800px]">
                <SkillTree
                    userSkills={userSkillNames}
                    recommendedResources={resources}
                />
            </div>
        </div>
    );
}
