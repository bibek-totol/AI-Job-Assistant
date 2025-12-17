import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Job Assistant",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are an AI Job Assistant. Help users with jobs, resumes, interviews, career guidance, and professional advice.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand that.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "AI service failed. Try again later." },
      { status: 500 }
    );
  }
}
