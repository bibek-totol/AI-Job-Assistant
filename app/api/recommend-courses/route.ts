export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { completeWithFallback } from "@/lib/openrouter";

const PDFParser = require("pdf2json");

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

    let searchQuery = "";

    if (jobGoal) {
      searchQuery = `best online courses for ${jobGoal} available in ${country}`;
    } else if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const resumeText = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on(
          "pdfParser_dataError",
          (errData: { parserError: Error }) => reject(errData.parserError),
        );
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });

      try {
        const keywords = await completeWithFallback(
          "courseKeywords",
          [
            {
              role: "system",
              content:
                "Extract the top 5 technical skills or professional keywords from the resume text. Return only the keywords separated by spaces. Do not include any other text.",
            },
            {
              role: "user",
              content: resumeText.slice(0, 5000),
            },
          ],
          { temperature: 0.2, max_tokens: 100 },
        );

        console.log("Extracted keywords:", keywords);

        searchQuery = keywords
          ? `best online courses for ${keywords} available in ${country}`
          : `top rated professional skill development courses in ${country}`;
      } catch (error) {
        console.error("Error extracting keywords:", error);
        searchQuery = `top rated professional skill development courses in ${country}`;
      }
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error("SERPAPI_API_KEY is missing");
      throw new Error("Server configuration error");
    }

    console.log(`Searching for: ${searchQuery}`);

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&num=15`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from SerpApi");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const courses =
      data.organic_results?.map(
        (result: {
          title: string;
          source?: string;
          link: string;
          snippet?: string;
        }) => ({
          title: result.title,
          platform:
            result.source ||
            new URL(result.link).hostname.replace("www.", ""),
          duration: "Self-paced",
          reason:
            result.snippet || "Recommended based on your search criteria.",
          platformUrl: result.link,
          difficultyLevel: "Intermediate",
        }),
      ) || [];

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error recommending courses:", error);
    return NextResponse.json(
      { error: "Failed to recommend courses" },
      { status: 500 },
    );
  }
}
