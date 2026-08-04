export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { processAndQueryPDF } from "@/lib/vectorstore";
import { runLangGraphAgent } from "@/lib/gemini-langgraph";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract PDF text -> Chunk -> Gemini Vector Embeddings -> Retrieval
    const { fullText, relevantChunks } = await processAndQueryPDF(
      buffer,
      jobDescription || "ATS Resume Score Strengths Improvements Missing Skills",
      7,
    );

    const contextText = relevantChunks.length > 0
      ? relevantChunks.join("\n\n--- CHUNK ---\n\n")
      : fullText;

    const systemPrompt = `
You are an expert ATS resume analyzer.
You analyze candidate resumes using vector-retrieved resume sections against job requirements.
You may search the web using your online browsing tool if needed to verify missing tech stacks or modern role expectations.

IMPORTANT: Return ONLY valid JSON adhering strictly to this schema:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "missingSkills": string[]
}
Do NOT include markdown formatting like \`\`\`json or explanatory text outside the JSON object.
`;

    const userMessage = jobDescription
      ? `Analyze this resume against the following job description:

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

RESUME RETRIEVED VECTOR CHUNKS:
${contextText.slice(0, 8000)}

Provide ATS score (0-100), key strengths, specific improvements, and missing skills.`
      : `Analyze this resume:

RESUME RETRIEVED VECTOR CHUNKS:
${contextText.slice(0, 8000)}

Provide ATS score (0-100), key strengths, specific improvements, and missing skills.`;

    const content = await runLangGraphAgent({
      systemPrompt,
      userMessage,
      temperature: 0.2,
    });

    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json\s*/g, "")
        .replace(/```\s*$/g, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/^```\s*/g, "")
        .replace(/```\s*$/g, "");
    }

    // Parse JSON safely
    let results;
    try {
      results = JSON.parse(cleanedContent);
    } catch {
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON output from AI agent.");
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error analyzing resume with Gemini LangGraph:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
