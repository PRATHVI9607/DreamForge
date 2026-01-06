"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userSkills, skills } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function fetchRealTimeJobs(query?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [userData] = await db.select().from(users).where(eq(users.id, session.user.id));
    const analysis = (userData?.professionalAnalysis as any);
    const targetRoles = analysis?.targetRoles || [];
    const currentRole = userData?.currentRole || "";
    const userLocation = userData?.location || "";
    const app_id = "c2c4030c";
    const app_key = "f0b879a27f8e0989152d7bcd442b40f6";

    try {
        // Construct Adzuna India Search URL
        const queryTerm = query || targetRoles[0] || currentRole || "Software Engineer";
        const locationTerm = userLocation || "India";
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=30&what=${encodeURIComponent(queryTerm)}&where=${encodeURIComponent(locationTerm)}&content-type=application/json`;

        const response = await fetch(adzunaUrl);
        if (!response.ok) throw new Error("Adzuna API Error");

        const data = await response.json();
        const rawJobs = data.results || [];

        const topJobs = rawJobs.map((j: any) => {
            let matchScore = 75;
            const title = j.title.toLowerCase();

            if (targetRoles.some((r: string) => title.includes(r.toLowerCase()))) matchScore += 15;
            if (currentRole && title.includes(currentRole.toLowerCase())) matchScore += 5;

            return {
                id: j.id,
                title: j.title.replace(/<\/?[^>]+(>|$)/g, ""), // Clean HTML tags
                company: j.company.display_name,
                location: j.location.display_name,
                salary: j.salary_min ? `₹${(j.salary_min / 100000).toFixed(1)}L+` : "Competitive",
                type: j.contract_type === "permanent" ? "Full-time" : "Contract",
                match: Math.min(99, matchScore),
                requirements: j.category.label.split(" ").slice(0, 3) || ["Systems", "Tech"],
                logo: j.company.display_name.charAt(0),
                color: "bg-indigo-600",
                url: j.redirect_url
            };
        });

        return { success: true, jobs: topJobs };
    } catch (error) {
        console.error("Job Fetch Failed:", error);
        return { success: false, jobs: [], error: "Could not fetch real-time jobs." };
    }
}
