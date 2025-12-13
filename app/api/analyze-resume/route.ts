export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const PDFParser = require("pdf2json");

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Resume Checker",
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const jobDescription = formData.get('jobDescription') as string || '';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert PDF to text
        const buffer = Buffer.from(await file.arrayBuffer());

        const resumeText = await new Promise<string>((resolve, reject) => {
            const pdfParser = new PDFParser(null, 1);

            pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                resolve(pdfParser.getRawTextContent());
            });

            pdfParser.parseBuffer(buffer);
        });

        // Call OpenRouter
        const completion = await openai.chat.completions.create({
            model: 'google/gemma-3-27b-it:free',
            messages: [
                {
                    role: 'system',
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
                    role: 'user',
                    content: jobDescription
                        ? `Analyze this resume against the following job description:\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 5000)}\n\nRESUME:\n${resumeText.slice(0, 10000)}\n\nProvide ATS score, strengths, improvements, and missing skills specifically for this job.`
                        : `Analyze this resume:\n\n${resumeText.slice(0, 10000)}`,
                },
            ],
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('Empty AI response');

        console.log('Raw AI response:', content);

        // Strip markdown code fences if present
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith('```json')) {
            cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        } else if (cleanedContent.startsWith('```')) {
            cleanedContent = cleanedContent.replace(/```\s*/g, '').replace(/```\s*$/g, '');
        }

        let results;
        try {
            results = JSON.parse(cleanedContent);
            console.log('Parsed results:', results);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            console.error('Cleaned content:', cleanedContent);
            throw new Error('Invalid JSON from AI');
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        return NextResponse.json(
            { error: 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}
