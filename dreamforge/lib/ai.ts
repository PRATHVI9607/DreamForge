import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined");
}

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function getGapAnalysis(currentSkills: string[], targetRole: string) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert career coach AI. concise JSON response only."
                },
                {
                    role: "user",
                    content: `Analyze the gap between these skills: ${currentSkills.join(", ")} and the requirements for a ${targetRole}. Return a JSON object with a list of 3 missing skills.`
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (e) {
        console.error("AI Error:", e);
        return { error: "Failed to generate analysis" };
    }
}
