export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const PDFParser = require("pdf2json");

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Job Assistant",
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const jobGoal = formData.get('jobGoal') as string || '';
        const country = formData.get('country') as string || '';

        if (!country) {
            return NextResponse.json({ error: 'Country is required' }, { status: 400 });
        }

        if (!file && !jobGoal) {
            return NextResponse.json({ error: 'Either resume file or career goals is required' }, { status: 400 });
        }

        let searchQuery = '';

        // Prioritize jobGoal for the search query as it's more direct
        if (jobGoal) {
            searchQuery = `best online courses for ${jobGoal} available in ${country}`;
        } else if (file) {
            // Parse PDF to get text
            const buffer = Buffer.from(await file.arrayBuffer());
            const resumeText = await new Promise<string>((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                    resolve(pdfParser.getRawTextContent());
                });
                pdfParser.parseBuffer(buffer);
            });

            // Extract keywords using AI
            try {
                const completion = await openai.chat.completions.create({
                    model: 'google/gemma-3-27b-it:free',
                    messages: [
                        {
                            role: 'system',
                            content: 'Extract the top 5 technical skills or professional keywords from the resume text. Return only the keywords separated by spaces. Do not include any other text.'
                        },
                        {
                            role: 'user',
                            content: resumeText.slice(0, 5000)
                        }
                    ]
                });

                const keywords = completion.choices[0].message.content?.trim();
                console.log('Extracted keywords:', keywords);

                if (keywords) {
                    searchQuery = `best online courses for ${keywords} available in ${country}`;
                } else {
                    searchQuery = `top rated professional skill development courses in ${country}`;
                }
            } catch (error) {
                console.error('Error extracting keywords:', error);
                searchQuery = `top rated professional skill development courses in ${country}`;
            }
        }

        const apiKey = process.env.SERPAPI_API_KEY;
        if (!apiKey) {
            console.error('SERPAPI_API_KEY is missing');
            throw new Error('Server configuration error');
        }

        console.log(`Searching for: ${searchQuery}`);

        const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&num=15`);

        if (!response.ok) {
            throw new Error('Failed to fetch from SerpApi');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const courses = data.organic_results?.map((result: any) => ({
            title: result.title,
            platform: result.source || new URL(result.link).hostname.replace('www.', ''),
            duration: 'Self-paced',
            reason: result.snippet || 'Recommended based on your search criteria.',
            platformUrl: result.link,
            difficultyLevel: 'Intermediate'
        })) || [];

        return NextResponse.json({ courses });

    } catch (error) {
        console.error('Error recommending courses:', error);
        return NextResponse.json(
            { error: 'Failed to recommend courses' },
            { status: 500 }
        );
    }
}
