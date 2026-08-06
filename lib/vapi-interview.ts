import Vapi from "@vapi-ai/web";
import DailyIframe from "@daily-co/daily-js";
import type { AssistantOverrides } from "@vapi-ai/web/dist/api";

// Intercept DailyIframe.createCallObject to prevent Vapi SDK from attempting Krisp noise-cancellation worklet setup
if (typeof window !== "undefined") {
  const originalCreateCallObject = DailyIframe.createCallObject;
  if (originalCreateCallObject && !(originalCreateCallObject as any).__isPatched) {
    const patchedCreateCallObject = function (properties?: any) {
      const callObject = originalCreateCallObject.call(DailyIframe, properties);
      if (callObject && typeof callObject.updateInputSettings === "function") {
        const originalUpdateInputSettings = callObject.updateInputSettings.bind(callObject);
        callObject.updateInputSettings = async function (settings: any) {
          if (settings?.audio?.processor?.type === "noise-cancellation") {
            return originalUpdateInputSettings({
              ...settings,
              audio: {
                ...settings?.audio,
                processor: {
                  type: "none",
                },
              },
            });
          }
          return originalUpdateInputSettings(settings);
        };
      }
      return callObject;
    };
    (patchedCreateCallObject as any).__isPatched = true;
    DailyIframe.createCallObject = patchedCreateCallObject;
  }
}

let activeClient: Vapi | null = null;
let cachedVapiClient: Vapi | null = null;
let cachedApiKey: string | null = null;
let stopPromise: Promise<void> | null = null;
let vapiLock: Promise<void> = Promise.resolve();

const DAILY_DESTROY_DELAY_MS = 200;

function withVapiLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = vapiLock.then(fn, fn);
  vapiLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Destroy any leftover Daily call object (e.g. after HMR or Strict Mode double-mount) */
async function destroyOrphanDailyCall(): Promise<void> {
  try {
    const daily = DailyIframe.getCallInstance();
    if (!daily) return;

    const destroyed =
      typeof daily.isDestroyed === "function" ? daily.isDestroyed() : false;
    if (!destroyed) {
      await daily.destroy();
    }
  } catch (err) {
    console.warn("[vapi] orphan Daily cleanup:", err);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSafeString(val: unknown): string {
  if (typeof val === "string") return val;
  if (val instanceof Error) return val.message;
  if (typeof val === "object" && val !== null) {
    try {
      const record = val as Record<string, unknown>;
      if (typeof record.message === "string") return record.message;
      if (typeof record.error === "string") return record.error;
      if (record.error && typeof record.error === "object") {
        const nested = record.error as Record<string, unknown>;
        if (typeof nested.message === "string") return nested.message;
      }
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val ?? "");
}

function getOrCreateVapiClient(apiKey: string): Vapi {
  if (cachedVapiClient && cachedApiKey === apiKey) {
    return cachedVapiClient;
  }

  cachedVapiClient = new Vapi(
    apiKey,
    undefined,
    { avoidEval: true, micAudioMode: "speech" } as any,
    {
      allowMultipleCallInstances: true,
      audioSource: true,
      startAudioOff: false,
    } as { audioSource?: boolean; startAudioOff?: boolean },
  );

  cachedApiKey = apiKey;
  return cachedVapiClient;
}

/** Extract a readable message from Vapi SDK error payloads */
export function formatVapiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (!error || typeof error !== "object") {
    return "Unknown Vapi error";
  }

  return getSafeString(error) || "Vapi call failed. Check your assistant ID and dashboard configuration.";
}

export function buildInterviewSystemPrompt(
  questions: string[],
  candidateName?: string,
  jobTitle?: string,
): string {
  const questionList =
    questions.length > 0
      ? questions.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "Ask relevant behavioral and technical questions for the role.";

  const nameLine = candidateName
    ? `The candidate's name is ${candidateName}. Greet them by name.`
    : "";

  const roleLine = jobTitle
    ? `You are interviewing for the ${jobTitle} position.`
    : "You are conducting a professional job interview.";

  return `${roleLine}
${nameLine}

Rules:
- Ask ONE question at a time from the list below, in order
- Wait for the candidate to finish before moving on
- Ask brief follow-ups when answers are unclear
- Keep a warm, professional tone
- After all questions, thank the candidate and wrap up
- If the candidate is silent, politely ask "Are you still there?" — never end the call yourself
- Give the candidate time to think (up to 30 seconds) before prompting again

Questions (ask in order):
${questionList}`;
}

/**
 * Overrides safe for POST /call/web — do NOT send `model` without `provider` + `model`
 * or Vapi returns 400 validation failed.
 */
export function buildAssistantOverrides(
  questions: string[],
  candidateName?: string,
  jobTitle?: string,
): AssistantOverrides {
  const systemPrompt = buildInterviewSystemPrompt(
    questions,
    candidateName,
    jobTitle,
  );
  const greetingName = candidateName ? ` ${candidateName}` : "";
  const questionText = questions
    .map((q, i) => `${i + 1}. ${q}`)
    .join("\n");

  const overrides: AssistantOverrides = {
    firstMessage: `Hello${greetingName}! Welcome to your AI interview. When you're ready to begin, please say "I'm ready" out loud so I know your microphone is working.`,
    firstMessageMode: "assistant-speaks-first",
    maxDurationSeconds: 3600,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    variableValues: {
      candidateName: candidateName || "Candidate",
      jobTitle: jobTitle || "the open role",
      interviewQuestions: questionText || "General interview questions",
      systemPrompt,
    },
  };

  const provider = process.env.NEXT_PUBLIC_VAPI_MODEL_PROVIDER;
  const modelId = process.env.NEXT_PUBLIC_VAPI_MODEL;

  if (provider === "openai" && modelId) {
    overrides.model = {
      provider: "openai",
      model: modelId,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
    } as NonNullable<AssistantOverrides["model"]>;
  }

  return overrides;
}

export async function stopVapiSession(): Promise<void> {
  if (stopPromise) {
    await stopPromise;
    return;
  }

  stopPromise = (async () => {
    const instance = activeClient;
    activeClient = null;

    if (instance) {
      try {
        instance.removeAllListeners();
        await instance.stop();
      } catch (err) {
        console.warn("[vapi] stop error:", err);
      }
    }

    await destroyOrphanDailyCall();
    await sleep(DAILY_DESTROY_DELAY_MS);
  })();

  try {
    await stopPromise;
  } finally {
    stopPromise = null;
  }
}

export type VapiEventHandlers = {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: unknown) => void;
  onMessage?: (message: unknown) => void;
  /** Injected after call-start when model override is not used */
  systemPrompt?: string;
};

export async function startVapiSession(
  apiKey: string,
  assistantId: string,
  overrides: AssistantOverrides,
  handlers: VapiEventHandlers = {},
): Promise<Vapi> {
  return withVapiLock(async () => {
    await stopVapiSession();

    const vapi = getOrCreateVapiClient(apiKey);
    vapi.removeAllListeners();
    activeClient = vapi;

    let lastStartError: string | null = null;

    vapi.on("call-start", () => {
      const prompt = handlers.systemPrompt;
      const hasModelOverride = Boolean(
        overrides.model &&
          typeof overrides.model === "object" &&
          "provider" in overrides.model,
      );

      if (prompt && !hasModelOverride) {
        try {
          vapi.send({
            type: "add-message",
            message: { role: "system", content: prompt },
            triggerResponseEnabled: false,
          });
        } catch (err) {
          console.warn("[vapi] Could not inject system prompt:", err);
        }
      }

      handlers.onCallStart?.();
      try {
        const daily = vapi.getDailyCallObject();
        if (daily) {
          vapi.setMuted(false);
        }
      } catch {
        // ignore
      }
    });

    vapi.on("call-end", () => handlers.onCallEnd?.());
    vapi.on("speech-start", () => handlers.onSpeechStart?.());
    vapi.on("speech-end", () => handlers.onSpeechEnd?.());
    vapi.on("message", (message) => handlers.onMessage?.(message));

    vapi.on("error", (error) => {
      const errorMsg = getSafeString(error);
      const typed = error as { type?: string } | null;

      // Suppress Krisp worklet module loading abort errors & nonfatal audio processor errors
      if (
        errorMsg.includes("KrispSDK") ||
        errorMsg.includes("worklet") ||
        errorMsg.includes("WORKLET_NOT_SUPPORTED") ||
        errorMsg.includes("krisp filter") ||
        typed?.type === "audio-processor-error" ||
        typed?.type === "audio-processing-setup-error"
      ) {
        console.warn("[vapi] Suppressed non-fatal noise filter event:", errorMsg);
        return;
      }

      if (typed?.type === "start-method-error") {
        lastStartError = formatVapiError(error);
        return;
      }
      if (typed?.type === "daily-call-object-creation-error") {
        lastStartError = formatVapiError(error);
        return;
      }
      // Daily emits this when the meeting room closes after a normal hang-up
      if (typed?.type === "daily-error") {
        return;
      }
      handlers.onError?.(error);
    });

    vapi.on("call-start-failed", (event) => {
      lastStartError =
        typeof event?.error === "string"
          ? event.error
          : formatVapiError(event?.error ?? event);
      handlers.onError?.(new Error(lastStartError));
    });

    try {
      const call = await vapi.start(assistantId, overrides);

      if (!call) {
        await destroyOrphanDailyCall();
        throw new Error(
          lastStartError ||
            "Vapi rejected the call. Verify NEXT_PUBLIC_VAPI_ASSISTANT_ID in the Vapi dashboard.",
        );
      }

      return vapi;
    } catch (error) {
      activeClient = null;
      vapi.removeAllListeners();
      try {
        await vapi.stop();
      } catch {
        // ignore
      }
      await destroyOrphanDailyCall();
      throw error instanceof Error
        ? error
        : new Error(formatVapiError(error));
    }
  });
}

export function getActiveVapiClient(): Vapi | null {
  return activeClient;
}

