import { NextResponse } from "next/server";
import { runLangGraphAgent } from "@/lib/gemini-langgraph";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { reply: "Please enter a message." },
        { status: 400 },
      );
    }

    const systemPrompt = `You are an intelligent AI Job Assistant powered by Google Gemini and LangGraph.
You help users with job searches, resume tips, interview preparation, career guidance, and professional advice.
You have access to an online browsing tool (online_web_search). Use it whenever a user asks for up-to-date real-world information, specific company details, salary trends, or current industry news.
Be concise, practical, engaging, and accurate.`;

    const reply = await runLangGraphAgent({
      systemPrompt,
      userMessage: message,
      temperature: 0.7,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error with Gemini LangGraph:", error);
    return NextResponse.json(
      { reply: "AI service encountered an issue. Please try again." },
      { status: 500 },
    );
  }
}
