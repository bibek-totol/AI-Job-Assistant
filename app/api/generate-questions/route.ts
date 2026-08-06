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

    let content = "";
    try {
      content = await runLangGraphAgent({
        systemPrompt,
        userMessage,
        temperature: 0.7,
      });
    } catch (agentErr) {
      console.warn("Gemini LangGraph agent failed or rate-limited, using intelligent fallback generator:", agentErr);
    }

    let questions: string[] = [];

    if (content) {
      const cleanContent = content
        .replace(/^```json\s*/g, "")
        .replace(/^```\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      try {
        questions = JSON.parse(cleanContent);
        if (!Array.isArray(questions)) {
          const match = cleanContent.match(/\[[\s\S]*\]/);
          if (match) {
            questions = JSON.parse(match[0]);
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
    }

    // Dynamic Role-Specific Fallback Questions if LLM call fails
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      questions = [
        `Can you walk me through your background and experience as a ${jobTitle}?`,
        `What key technical skills and tools do you use for ${jobTitle} projects?`,
        `How do you handle complex technical requirements in a ${interviewType} environment?`,
        `Can you describe a challenging bug or issue you encountered recently and how you resolved it?`,
        `How do you approach code quality, testing, and system performance optimization?`,
        `Tell me about a time you had to deliver a critical project under a tight deadline.`,
        `How do you collaborate with cross-functional teams, product managers, and design teams?`,
        `What strategies do you use when learning new technologies or frameworks required for a project?`,
        `Describe your workflow for designing scalable systems or application architectures.`,
        `How do you prioritize competing tasks and technical debt in a fast-paced environment?`,
        `Can you give an example of a technical decision you made that significantly impacted a project?`,
        `How do you ensure security, data integrity, and best practices in your implementation?`,
        `What steps do you take when troubleshooting production issues or system outages?`,
        `How do you handle constructive feedback or technical disagreements within your team?`,
        `Where do you see your technical leadership and skills growing over the next 2-3 years?`,
      ];
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
