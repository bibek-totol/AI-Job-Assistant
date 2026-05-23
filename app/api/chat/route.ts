import { NextResponse } from "next/server";
import { completeWithFallback } from "@/lib/openrouter";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { reply: "Please enter a message." },
        { status: 400 },
      );
    }

    const reply = await completeWithFallback(
      "chat",
      [
        {
          role: "system",
          content:
            "You are an AI Job Assistant. Help users with jobs, resumes, interviews, career guidance, and professional advice. Be concise, practical, and up to date with modern hiring practices.",
        },
        { role: "user", content: message },
      ],
      { temperature: 0.7, max_tokens: 800 },
    );

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "AI service failed. Try again later." },
      { status: 500 },
    );
  }
}
