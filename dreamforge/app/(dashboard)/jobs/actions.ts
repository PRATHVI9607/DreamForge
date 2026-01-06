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
    const userLocation = userData?.location || "Remote";

    try {
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
        const data = await response.json();
        let rawJobs = data.data || [];

        // Regional Filtering Logic
        if (userLocation && userLocation.toLowerCase() !== "remote") {
            const regionalJobs = rawJobs.filter((j: any) =>
                j.location.toLowerCase().includes(userLocation.toLowerCase())
            );
            // If we have regional jobs, prioritize them
            if (regionalJobs.length > 0) {
                rawJobs = [...regionalJobs, ...rawJobs.filter((j: any) => !regionalJobs.includes(j))];
            }
        }

        const filteredJobs = query
            ? rawJobs.filter((j: any) =>
                j.title.toLowerCase().includes(query.toLowerCase()) ||
                j.company_name.toLowerCase().includes(query.toLowerCase())
            )
            : rawJobs;

        const topJobs = filteredJobs.slice(0, 30).map((j: any) => {
            // Primitive but real-time matching logic
            let matchScore = 70;
            const title = j.title.toLowerCase();
            const jobLoc = j.location.toLowerCase();

            if (targetRoles.some((r: string) => title.includes(r.toLowerCase()))) matchScore += 15;
            if (currentRole && title.includes(currentRole.toLowerCase())) matchScore += 5;
            if (j.remote) matchScore += 5;

            // Regional Match Boost
            if (userLocation && jobLoc.includes(userLocation.toLowerCase())) {
                matchScore += 10;
            }

            return {
                id: j.slug,
                title: j.title,
                company: j.company_name,
                location: j.location,
                salary: j.salary || "Competitive",
                type: j.remote ? "Remote" : "On-site",
                match: Math.min(99, matchScore),
                requirements: j.tags || ["System Design", "Distributed Systems"],
                logo: j.company_name.charAt(0),
                color: "bg-slate-900",
                url: j.url
            };
        });

        return { success: true, jobs: topJobs };
    } catch (error) {
        console.error("Job Fetch Failed:", error);
        return { success: false, jobs: [], error: "Could not fetch real-time jobs." };
    }
}
