export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { processAndQueryPDF } from "@/lib/vectorstore";
import { runLangGraphAgent } from "@/lib/gemini-langgraph";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "No job description provided" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract PDF text -> Chunk -> Gemini Vector Embeddings -> Retrieval
    const { fullText, relevantChunks } = await processAndQueryPDF(
      buffer,
      jobDescription,
      7,
    );

    const contextText =
      relevantChunks.length > 0
        ? relevantChunks.join("\n\n--- VECTOR RETRIEVED CHUNK ---\n\n")
        : fullText;

    const systemPrompt = `You are a professional cover letter writer.
Your task is to create a compelling, personalized cover letter based on vector-embedded resume chunks and the job description provided.
You have access to an online browsing tool if you need to look up company context or industry standards.

The cover letter should:
- Be professional, persuasive, and engaging
- Highlight relevant skills and experiences from the resume chunks that match the job requirements
- Demonstrate enthusiasm for the position
- Be concise (around 300-400 words)
- Follow standard business letter format
- Use the candidate's name from the resume if available, otherwise use [Your Name]

Return ONLY the cover letter text. Do not include markdown code block syntax.`;

    const userMessage = `Generate a professional cover letter based on the following:

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

RETRIEVED RESUME VECTOR CHUNKS:
${contextText.slice(0, 8000)}

Please write a tailored cover letter for this job application.`;

    const coverLetter = await runLangGraphAgent({
      systemPrompt,
      userMessage,
      temperature: 0.7,
    });

    return NextResponse.json({
      coverLetter: coverLetter.trim(),
    });
  } catch (error) {
    console.error("Error generating cover letter with Gemini LangGraph:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  }
}
