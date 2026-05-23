export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { completeWithFallback } from "@/lib/openrouter";

const PDFParser = require("pdf2json");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resumeText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) =>
        reject(errData.parserError),
      );
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.parseBuffer(buffer);
    });

    const content = await completeWithFallback(
      "resumeAnalysis",
      [
        {
          role: "system",
          content: `
You are an ATS resume analyzer.
Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "missingSkills": string[]
}
          `,
        },
        {
          role: "user",
          content: jobDescription
            ? `Analyze this resume against the following job description:\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 5000)}\n\nRESUME:\n${resumeText.slice(0, 10000)}\n\nProvide ATS score, strengths, improvements, and missing skills specifically for this job.`
            : `Analyze this resume:\n\n${resumeText.slice(0, 10000)}`,
        },
      ],
      { temperature: 0.3 },
    );

    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/```\s*/g, "")
        .replace(/```\s*$/g, "");
    }

    const results = JSON.parse(cleanedContent);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
