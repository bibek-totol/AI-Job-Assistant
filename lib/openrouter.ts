import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/**
 * Free OpenRouter models per task — ordered by reliability under rate limits.
 * Popular models (DeepSeek, Qwen 80B) are listed later to avoid 429s.
 * OpenRouter tries each model in order when using the `models` array.
 */
export const OPENROUTER_MODELS = {
  interviewQuestions: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "openai/gpt-oss-20b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "google/gemma-3-27b-it:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "deepseek/deepseek-v4-flash:free",
  ],
  coverLetter: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "openai/gpt-oss-20b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "deepseek/deepseek-v4-flash:free",
  ],
  resumeAnalysis: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "openai/gpt-oss-20b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "deepseek/deepseek-v4-flash:free",
  ],
  courseKeywords: [
    "meta-llama/llama-3.2-3b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
  ],
  chat: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "openai/gpt-oss-20b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ],
} as const;

export type OpenRouterTask = keyof typeof OPENROUTER_MODELS;

type CompletionOptions = {
  temperature?: number;
  max_tokens?: number;
};

const MAX_RETRIES = 3;
const DEFAULT_RETRY_MS = 2000;
const BETWEEN_MODEL_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { status?: number; code?: number; message?: string };
  if (e.status === 429 || e.code === 429) return true;
  if (typeof e.message === "string" && e.message.includes("429")) return true;
  return false;
}

function getRetryAfterMs(error: unknown): number {
  if (!error || typeof error !== "object") return DEFAULT_RETRY_MS;
  const headers = (error as { headers?: Record<string, string> }).headers;
  if (headers) {
    const raw =
      headers["retry-after"] ??
      headers["Retry-After"] ??
      headers["x-ratelimit-reset"];
    if (raw) {
      const seconds = Number.parseInt(String(raw), 10);
      if (!Number.isNaN(seconds) && seconds > 0) {
        return Math.min(seconds * 1000, 60_000);
      }
    }
  }
  return DEFAULT_RETRY_MS;
}

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string; code?: number };
};

async function callOpenRouter(
  models: readonly string[],
  messages: ChatCompletionMessageParam[],
  options: CompletionOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const body = {
    models: [...models],
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
          "X-Title": "AI Job Assistant",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      const waitMs = retryAfter
        ? Math.min(Number.parseInt(retryAfter, 10) * 1000, 60_000)
        : DEFAULT_RETRY_MS * (attempt + 1);

      console.warn(
        `[openrouter] Rate limited (429). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
      );
      lastError = new Error(`429 Rate limited. Retry after ${waitMs}ms`);
      await sleep(waitMs);
      continue;
    }

    const data = (await response.json()) as OpenRouterResponse;

    if (!response.ok) {
      const msg =
        data.error?.message ||
        `OpenRouter error ${response.status}: ${response.statusText}`;
      lastError = new Error(msg);
      if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
        await sleep(DEFAULT_RETRY_MS * (attempt + 1));
        continue;
      }
      throw lastError;
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (content) {
      return content;
    }

    lastError = new Error("Empty response from OpenRouter");
  }

  throw lastError ?? new Error("OpenRouter request failed after retries");
}

/** Try models one-by-one (used when bundled routing still hits 429) */
async function callSingleModel(
  model: string,
  messages: ChatCompletionMessageParam[],
  options: CompletionOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        "X-Title": "AI Job Assistant",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens,
      }),
    },
  );

  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    const err = new Error("429 Rate limited") as Error & {
      status: number;
      headers: Record<string, string>;
    };
    err.status = 429;
    err.headers = retryAfter ? { "retry-after": retryAfter } : {};
    throw err;
  }

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        `OpenRouter ${response.status}: ${response.statusText}`,
    );
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenRouter");
  return content;
}

export async function completeWithFallback(
  task: OpenRouterTask,
  messages: ChatCompletionMessageParam[],
  options: CompletionOptions = {},
): Promise<string> {
  const models = OPENROUTER_MODELS[task];

  try {
    const content = await callOpenRouter(models, messages, options);
    console.log(`[openrouter] ${task} → routed (${models[0]}…)`);
    return content;
  } catch (bundledError) {
    console.warn(
      `[openrouter] ${task} bundled routing failed, trying models individually:`,
      bundledError,
    );
  }

  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const content = await callSingleModel(model, messages, options);
        console.log(`[openrouter] ${task} → ${model}`);
        return content;
      } catch (error) {
        lastError = error;
        console.error(`[openrouter] ${task} failed (${model}):`, error);

        if (isRateLimitError(error) && attempt === 0) {
          const waitMs = getRetryAfterMs(error);
          console.warn(`[openrouter] Waiting ${waitMs}ms before retry…`);
          await sleep(waitMs);
          continue;
        }
        break;
      }
    }
    await sleep(BETWEEN_MODEL_MS);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
        `All free models rate-limited for "${task}". Wait a minute and try again.`,
      );
}
