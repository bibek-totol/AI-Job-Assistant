export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const PDFParser = require("pdf2json");

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Cover Letter Generator",
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const jobDescription = formData.get('jobDescription') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!jobDescription) {
            return NextResponse.json({ error: 'No job description provided' }, { status: 400 });
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

        // Call OpenRouter with Llama model
        const completion = await openai.chat.completions.create({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional cover letter writer. 
Your task is to create a compelling, personalized cover letter based on the candidate's resume and the job description provided.

The cover letter should:
- Be professional and engaging
- Highlight relevant skills and experiences from the resume that match the job requirements
- Demonstrate enthusiasm for the position
- Be concise (around 300-400 words)
- Follow a standard business letter format
- Use the candidate's name from the resume if available, otherwise use [Your Name]
- Address specific requirements mentioned in the job description
- Show how the candidate's experience aligns with the role

Return ONLY the cover letter text, no additional formatting or markdown.`,
                },
                {
                    role: 'user',
                    content: `Generate a professional cover letter based on the following:

JOB DESCRIPTION:
${jobDescription.slice(0, 5000)}

CANDIDATE'S RESUME:
${resumeText.slice(0, 10000)}

Please create a tailored cover letter for this job application.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const coverLetter = completion.choices[0].message.content;

        if (!coverLetter) {
            throw new Error('Empty AI response');
        }

        console.log('Generated cover letter successfully');

        return NextResponse.json({
            coverLetter: coverLetter.trim()
        });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}
