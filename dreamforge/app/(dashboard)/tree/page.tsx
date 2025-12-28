import { SkillTree } from "@/components/features/growth/SkillTree";

export default function TreePage() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto fade-in">
            <header>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">Skill Orb Constellation</h1>
                <p className="text-muted-foreground mt-2">Deep-dive into your architectural competencies.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-xl overflow-hidden h-[800px]">
                <SkillTree />
            </div>
        </div>
    );
}
