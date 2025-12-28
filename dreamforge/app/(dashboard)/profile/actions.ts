"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userSkills, skills } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function parseResumeAndSeed(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // In a real app, we'd use a PDF parser + LLM here.
    // For now, we simulate a deep AI analysis.

    // 1. Initial Match Score bump
    await db.update(users).set({
        matchScore: 65, // Significant jump after resume upload
        level: 3,
        xp: 1500,
        currentRole: "Full Stack Developer",
    }).where(eq(users.id, session.user.id));

    // 2. Clear old skills for this demo and seed new ones
    // (In reality, we'd merge)

    const coreSkills = [
        { name: "React", category: "frontend", proficiency: 8 },
        { name: "Next.js", category: "frontend", proficiency: 6 },
        { name: "Node.js", category: "backend", proficiency: 7 },
        { name: "PostgreSQL", category: "backend", proficiency: 5 },
        { name: "TypeScript", category: "core", proficiency: 9 },
    ];

    for (const s of coreSkills) {
        // Find or create skill
        let [existingSkill] = await db.select().from(skills).where(eq(skills.name, s.name));

        let skillId;
        if (!existingSkill) {
            const [newSkill] = await db.insert(skills).values({
                name: s.name,
                category: s.category,
                level: 1
            }).returning();
            skillId = newSkill.id;
        } else {
            skillId = existingSkill.id;
        }

        // Connect to user
        await db.insert(userSkills).values({
            userId: session.user.id,
            skillId: skillId,
            proficiency: s.proficiency,
            verified: 1
        }).onConflictDoUpdate({
            target: [userSkills.userId, userSkills.skillId], // Need unique constraint for this to work perfectly, but let's just insert for now
            set: { proficiency: s.proficiency }
        });
    }

    revalidatePath("/dashboard");
    revalidatePath("/tree");
    return { success: true };
}
