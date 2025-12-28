import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { auth } from "@/lib/auth";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { messages, context } = await req.json();

        const systemPrompt = `You are Sage, a career architect AI for the DreamForge DTL platform. 
        Your goal is to help users accelerate their career growth through AI-driven insights.
        User Context: ${JSON.stringify(context || {})}
        Be professional, insightful, and encouraging. Give specific advice on skills, resume optimization, and interview preparation.
        Current User Level: ${context?.level || 1}. Match Score: ${context?.matchScore || 0}%.
        Keep responses concise and formatted with markdown if helpful.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return NextResponse.json({
            message: completion.choices[0].message.content
        });
    } catch (error: any) {
        console.error("AI Chat error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
