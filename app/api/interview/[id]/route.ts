import { NextResponse } from "next/server";
import {
  getInterviewSession,
  saveInterviewSession,
  type InterviewSessionData,
} from "@/lib/interview-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getInterviewSession(id);

    if (!session) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("GET interview session error:", error);
    return NextResponse.json(
      { error: "Failed to load interview session" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { questions, jobTitle, jobDescription, interviewType } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Questions array is required" },
        { status: 400 },
      );
    }

    const session: InterviewSessionData = {
      id,
      questions,
      jobTitle,
      jobDescription,
      interviewType,
      createdAt: new Date().toISOString(),
    };

    await saveInterviewSession(session);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST interview session error:", error);
    return NextResponse.json(
      { error: "Failed to save interview session" },
      { status: 500 },
    );
  }
}
