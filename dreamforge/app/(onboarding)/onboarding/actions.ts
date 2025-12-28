"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveOnboardingData(data: {
    fullName?: string;
    bio?: string;
    experienceLevel?: string;
    targetRole?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await db.update(users).set({
        name: data.fullName,
        currentRole: data.experienceLevel,
        targetRole: data.targetRole,
        // Assume simple progression for onboarding completion
        matchScore: data.targetRole ? 15 : 0,
        level: 2,
        xp: 100,
        goals: { bio: data.bio }
    }).where(eq(users.id, session.user.id));

    revalidatePath("/dashboard");
    return { success: true };
}
