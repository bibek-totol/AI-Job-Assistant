import { NextResponse } from "next/server";
import { runLangGraphAgent } from "@/lib/gemini-langgraph";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobTitle, jobDescription, interviewType } = body;

    if (!jobTitle || !jobDescription || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const systemPrompt = `You are an expert technical and behavioral interviewer.
You generate high-quality interview questions tailored for specific roles and job descriptions.
You have access to an online browsing tool if you need to look up role-specific technical requirements or company culture.

Return response strictly as a JSON array of strings:
["Question 1", "Question 2", ...]
Do NOT include markdown formatting or extra text outside the JSON array.`;

    const userMessage = `Generate 15 ${interviewType} interview questions for a ${jobTitle} position.

Job Description:
${jobDescription.slice(0, 4000)}

The questions should be challenging, relevant, and cover various aspects of the role. Return ONLY a JSON array of strings.`;

    const content = await runLangGraphAgent({
      systemPrompt,
      userMessage,
      temperature: 0.7,
    });

    const cleanContent = content
      .replace(/^```json\s*/g, "")
      .replace(/^```\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    let questions: string[];
    try {
      questions = JSON.parse(cleanContent);
      if (!Array.isArray(questions)) {
        const match = cleanContent.match(/\[[\s\S]*\]/);
        if (match) {
          questions = JSON.parse(match[0]);
        } else {
          throw new Error("Response is not an array");
        }
      }
    } catch {
      questions = cleanContent
        .split("\n")
        .filter(
          (line) =>
            line.trim().length > 0 &&
            !line.startsWith("{") &&
            !line.startsWith("}") &&
            !line.startsWith("[") &&
            !line.startsWith("]"),
        )
        .map((line) =>
          line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").trim(),
        )
        .filter((line) => line.length > 10);
    }

    if (!questions?.length) {
      throw new Error("No valid questions generated");
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions with Gemini LangGraph:", error);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 },
    );
  }
}
