"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function dailyCheckIn() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

    // Simple leveling logic: 1000 XP per level
    const newXp = (user.xp ?? 0) + 100;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await db.update(users).set({
        xp: newXp,
        level: newLevel,
        streak: (user.streak ?? 0) + 1,
    }).where(eq(users.id, session.user.id));

    revalidatePath("/dashboard");
    return { success: true, xpGained: 100 };
}
