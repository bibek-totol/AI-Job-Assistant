import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
        const body = await request.json();
        const { jobTitle, jobDescription, interviewType } = body;

        if (!jobTitle || !jobDescription || !interviewType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
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

        const models = [
            'meta-llama/llama-3.3-70b-instruct:free',
            'google/gemini-2.0-flash-exp:free',
            'google/gemini-2.0-flash-thinking-exp:free'
        ];

        let content = null;
        let lastError = null;

        for (const model of models) {
            try {
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert technical interviewer. You generate high-quality interview questions based on job descriptions. You always return responses in valid JSON format.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                });

                content = completion.choices[0].message.content;
                if (content) break; // Success
            } catch (error) {
                console.error(`Error with model ${model}:`, error);
                lastError = error;
                continue; // Try next model
            }
        }

        if (!content) {
            throw lastError || new Error('All models failed to generate response');
        }

        // Clean up the response if it contains markdown code blocks
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(cleanContent);
        } catch (e) {
            console.error('Failed to parse JSON:', content);
            // Fallback: try to split by newlines if JSON parsing fails
            questions = cleanContent.split('\n').filter(line => line.trim().length > 0);
        }

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json(
            { error: 'Failed to generate questions' },
            { status: 500 }
        );
    }
}
