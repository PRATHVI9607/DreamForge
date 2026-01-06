"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userSkills, skills } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function parseResumeAndSeed(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("resume") as File;
    if (!file) throw new Error("No file uploaded");

    // In a real production app, we'd use a PDF parser here.
    // For this demonstration, we read the text and pass it to Llama 3.3
    const text = await file.text();
    const resumePreview = text.slice(0, 2000); // Limit context

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert Career Architect AI. Analyze the provided resume.
                    Return a JSON object with:
                    1. "level": integer (1-2: Junior, 3-4: Mid, 5-6: Senior, 7-8: Staff/Lead, 9-10: Principal/Architect)
                    2. "currentRole": (string)
                    3. "location": (string)
                    4. "skills": Array of { name, category, proficiency(1-10) }
                    5. "analysis": { 
                        "strengths": string[],
                        "weaknesses": string[] (Specific technologies they lack),
                        "marketPosition": string
                    }
                    6. "nextSteps": {
                        "immediate": string,
                        "strategic": string,
                        "targetRoles": string[],
                        "recommendedResources": Array of { title, url, type: "video" | "doc" | "tutorial" } 
                        (MUST be free. Prioritize: YouTube tutorials, Official Documentation, MDN, or FreeCodeCamp. 
                        Example URL: "https://developer.mozilla.org/en-US/docs/Web/JavaScript")
                    7. "matchScore": (integer 0-100)
                    Only return the raw JSON.`
                },
                {
                    role: "user",
                    content: `Analyze this resume: ${resumePreview}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content || "{}");

        // 1. Update User Profile with Deep Analysis
        await db.update(users).set({
            matchScore: analysis.matchScore || 0,
            level: analysis.level || 1,
            xp: (analysis.level || 1) * 1000,
            currentRole: analysis.currentRole || "Professional",
            location: analysis.location || "Remote", // New field
            professionalAnalysis: analysis.analysis,
            careerInsights: analysis.nextSteps,
        }).where(eq(users.id, session.user.id));

        // 2. Seed/Update Skills
        if (analysis.skills && Array.isArray(analysis.skills)) {
            for (const s of analysis.skills) {
                let [existingSkill] = await db.select().from(skills).where(eq(skills.name, s.name));
                let skillId;

                if (!existingSkill) {
                    const [newSkill] = await db.insert(skills).values({
                        name: s.name,
                        category: s.category || "core",
                        level: 1
                    }).returning();
                    skillId = newSkill.id;
                } else {
                    skillId = existingSkill.id;
                }

                await db.insert(userSkills).values({
                    userId: session.user.id,
                    skillId: skillId,
                    proficiency: s.proficiency || 5,
                    verified: 1
                }).onConflictDoUpdate({
                    target: [userSkills.userId, userSkills.skillId],
                    set: { proficiency: s.proficiency || 5 }
                });
            }
        }

        revalidatePath("/dashboard");
        revalidatePath("/tree");
        revalidatePath("/profile");
        return { success: true, analysis };
    } catch (error) {
        console.error("Analysis Failed:", error);
        throw new Error("AI analysis failed. Please try again.");
    }
}
