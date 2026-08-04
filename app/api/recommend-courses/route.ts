export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { processAndQueryPDF } from "@/lib/vectorstore";
import { runLangGraphAgent } from "@/lib/gemini-langgraph";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobGoal = (formData.get("jobGoal") as string) || "";
    const country = (formData.get("country") as string) || "";

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 },
      );
    }

    if (!file && !jobGoal) {
      return NextResponse.json(
        { error: "Either resume file or career goals is required" },
        { status: 400 },
      );
    }

    let resumeContext = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // PDF text extraction -> Chunking -> Vector Embeddings -> Retrieval
      const { fullText, relevantChunks } = await processAndQueryPDF(
        buffer,
        jobGoal || "technical skills framework programming tools certifications missing skills",
        6,
      );
      resumeContext = relevantChunks.length > 0
        ? relevantChunks.join("\n\n")
        : fullText.slice(0, 4000);
    }

    const searchQueryGoal = jobGoal || "software engineering cloud devops tech skills";

    const systemPrompt = `You are an expert career and education advisor.
Your goal is to recommend real, highly relevant online and regional training courses tailored specifically for a candidate located in ${country}.

CRITICAL INSTRUCTIONS:
1. MANDATORY SEARCH: You MUST use the online_web_search tool to perform a web search for live course options. Search specifically for "${searchQueryGoal} course in ${country}" or related training queries.
2. DYNAMIC DISCOVERY: Let the web search results dynamically determine the courses, platforms, academies, and training providers. Do not rely on fixed or hardcoded platform lists. Discover both top local/regional providers in ${country} and global platforms dynamically from search results.
3. DYNAMIC COUNT: Return a dynamic list of relevant courses based on live search results, up to 15 courses max (minimum 1 to 15 courses).
4. ACCURATE URLs: Ensure platformUrl contains valid links to the platform or course webpage discovered from web search.

Return ONLY a valid JSON object with the key "courses" containing an array of course objects matching this schema:
{
  "courses": [
    {
      "title": string,
      "platform": string,
      "duration": string,
      "reason": string,
      "platformUrl": string,
      "difficultyLevel": "Beginner" | "Intermediate" | "Advanced"
    }
  ]
}
Do NOT wrap in markdown code blocks like \`\`\`json. Return pure JSON only.`;

    const userMessage = `Perform a web search using online_web_search for "${searchQueryGoal} course in ${country}".
Dynamically recommend up to 15 top relevant courses based on real search results for someone located in ${country}.

${jobGoal ? `TARGET CAREER GOAL / ROLE:\n${jobGoal}\n` : ""}
${resumeContext ? `CANDIDATE RESUME HIGHLIGHTS:\n${resumeContext}\n` : ""}

Return valid JSON with key "courses" containing an array of course items (up to 15 items max).`;

    const agentOutput = await runLangGraphAgent({
      systemPrompt,
      userMessage,
      temperature: 0.3,
    });

    let cleaned = agentOutput.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/g, "").replace(/```\s*$/g, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/g, "").replace(/```\s*$/g, "");
    }

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON returned from AI course recommender.");
      }
    }

    const courses = result.courses || [];
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error recommending courses with Gemini LangGraph:", error);
    return NextResponse.json(
      { error: "Failed to recommend courses" },
      { status: 500 },
    );
  }
}
