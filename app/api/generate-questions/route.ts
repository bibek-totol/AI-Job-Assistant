import { NextResponse } from "next/server";
import { completeWithFallback } from "@/lib/openrouter";

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

    const prompt = `
Generate 15 ${interviewType} interview questions for a ${jobTitle} position.

Job Description:
${jobDescription.slice(0, 5000)}

The questions should be challenging, relevant, and cover various aspects of the role.
Return the response strictly as a JSON array of strings. Do not include any markdown formatting or additional text.
Example format: ["Question 1", "Question 2", ...]
`;

    const content = await completeWithFallback(
      "interviewQuestions",
      [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. You generate high-quality interview questions based on job descriptions. You always return responses in valid JSON format only.",
        },
        { role: "user", content: prompt },
      ],
      { temperature: 0.7 },
    );

    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let questions: string[];
    try {
      questions = JSON.parse(cleanContent);
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }
    } catch {
      questions = cleanContent
        .split("\n")
        .filter(
          (line) =>
            line.trim().length > 0 &&
            !line.startsWith("{") &&
            !line.startsWith("}"),
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
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 },
    );
  }
}
