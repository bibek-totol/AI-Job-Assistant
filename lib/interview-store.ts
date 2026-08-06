import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface InterviewSessionData {
  id: string;
  questions: string[];
  jobTitle?: string;
  jobDescription?: string;
  interviewType?: string;
  createdAt: string;
}

// Global in-memory cache for serverless environments (Vercel)
const globalForSessions = globalThis as unknown as {
  interviewSessionsCache?: Map<string, InterviewSessionData>;
};

const sessionCache =
  globalForSessions.interviewSessionsCache ?? new Map<string, InterviewSessionData>();
if (!globalForSessions.interviewSessionsCache) {
  globalForSessions.interviewSessionsCache = sessionCache;
}

function getStorageDir(): string {
  // Use /tmp directory on Vercel / Serverless environments where process.cwd() is read-only
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "data", "interviews");
  }
  return path.join(process.cwd(), "data", "interviews");
}

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
  sessionCache.set(safeId, data);

  try {
    const dataDir = getStorageDir();
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      path.join(dataDir, `${safeId}.json`),
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.warn("[interview-store] File storage skipped, saved in-memory cache:", err);
  }
}

export async function getInterviewSession(
  id: string,
): Promise<InterviewSessionData | null> {
  const safeId = sanitizeId(id);

  if (sessionCache.has(safeId)) {
    return sessionCache.get(safeId)!;
  }

  try {
    const dataDir = getStorageDir();
    const content = await fs.readFile(
      path.join(dataDir, `${safeId}.json`),
      "utf-8",
    );
    const data = JSON.parse(content) as InterviewSessionData;
    sessionCache.set(safeId, data);
    return data;
  } catch {
    return null;
  }
}
