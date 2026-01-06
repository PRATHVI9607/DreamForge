"use server";

import { auth } from "@/lib/auth";
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeInterviewPerformance(transcript: string, question: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an elite Tech Interview Architect. Analyze the following interview transcript for the question: "${question}".
                    
                    Return a JSON object with:
                    1. "percentile": integer (5-99, how they rank against peers)
                    2. "pace": "Perfect" | "Fast" | "Steady" | "Deliberate"
                    3. "fillers": integer (count of 'um', 'uh', 'like', etc. detected in text)
                    4. "sentiment": "Decisive" | "Strategic" | "Collaborative" | "Analytical"
                    5. "feedback": (string, 150-200 chars focusing on architectural depth)
                    6. "strengths": string[] (2-3 items)
                    7. "improvements": string[] (2-3 items)
                    
                    Strictly return raw JSON.`
                },
                {
                    role: "user",
                    content: `Transcript: ${transcript}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content || "{}");
        return { success: true, analysis };
    } catch (error) {
        console.error("Interview Analysis Failed:", error);
        return { success: false, error: "Failed to parse interview data." };
    }
}
