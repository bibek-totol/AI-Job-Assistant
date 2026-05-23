import { promises as fs } from "fs";
import path from "path";

export interface InterviewSessionData {
  id: string;
  questions: string[];
  jobTitle?: string;
  jobDescription?: string;
  interviewType?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "interviews");

function sanitizeId(id: string): string {
  if (!/^[a-z0-9]+$/i.test(id)) {
    throw new Error("Invalid interview ID");
  }
  return id;
}

export async function saveInterviewSession(
  data: InterviewSessionData,
): Promise<void> {
  const safeId = sanitizeId(data.id);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${safeId}.json`),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

export async function getInterviewSession(
  id: string,
): Promise<InterviewSessionData | null> {
  const safeId = sanitizeId(id);
  try {
    const content = await fs.readFile(
      path.join(DATA_DIR, `${safeId}.json`),
      "utf-8",
    );
    return JSON.parse(content) as InterviewSessionData;
  } catch {
    return null;
  }
}
