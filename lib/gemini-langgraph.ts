import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

/**
 * Instantiate Google AI Studio Gemini LLM model using LangChain
 */
export function getGeminiLLM(modelName = "gemini-3.1-flash-lite", temperature = 0.7) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY from Google AI Studio to your .env file.",
    );
  }

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: modelName,
    temperature,
  });
}

/**
 * Online Browsing Tool for LangGraph to fetch live web data
 */
export const onlineBrowsingTool = tool(
  async ({ query }: { query: string }) => {
    console.log(`[LangGraph Online Browsing] Searching web for: "${query}"`);
    const serpApiKey = process.env.SERPAPI_API_KEY;

    if (serpApiKey) {
      try {
        const response = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=10`,
        );
        if (response.ok) {
          const data = await response.json();
          const results = data.organic_results?.slice(0, 10).map(
            (r: { title: string; snippet?: string; link: string }) => ({
              title: r.title,
              snippet: r.snippet || "",
              link: r.link,
            }),
          );
          if (results && results.length > 0) {
            return JSON.stringify(results);
          }
        }
      } catch (err) {
        console.warn("[LangGraph Browsing Tool] SerpAPI search error:", err);
      }
    }

    // Fallback: DuckDuckGo HTML search snippet & link extraction
    try {
      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
      );
      if (response.ok) {
        const html = await response.text();
        const matches = [...html.matchAll(/<a class="result__snippet[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)];
        const results = matches.slice(0, 8).map((m) => ({
          link: m[1],
          snippet: m[2].replace(/<[^>]+>/g, "").trim(),
        }));
        if (results.length) {
          return JSON.stringify(results);
        }
      }
    } catch (err) {
      console.warn("[LangGraph Browsing Tool] DuckDuckGo fallback error:", err);
    }

    return "Web search completed. Proceed with relevant industry knowledge and current best practices.";
  },
  {
    name: "online_web_search",
    description:
      "Searches the web for live, up-to-date information, real-time market data, company details, skill requirements, or course listings.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the web"),
    }),
  },
);

/**
 * Creates a LangGraph ReAct agent for a specific model instance
 */
export function createGeminiBrowsingAgent(modelName = "gemini-3.1-flash-lite", temperature = 0.7) {
  const llm = getGeminiLLM(modelName, temperature);
  const tools = [onlineBrowsingTool];

  return createReactAgent({
    llm,
    tools,
  });
}

/**
 * Executes the LangGraph agent with system prompt and user input, with automatic fallback models
 */
export async function runLangGraphAgent({
  systemPrompt,
  userMessage,
  temperature = 0.7,
}: {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
}): Promise<string> {
  // Model priority sequence based on your Google AI Studio dashboard quotas
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[LangGraph Agent] Invoking agent with model: "${modelName}"`);
      const agent = createGeminiBrowsingAgent(modelName, temperature);

      const result = await agent.invoke({
        messages: [new SystemMessage(systemPrompt), new HumanMessage(userMessage)],
      });

      const lastMessage = result.messages[result.messages.length - 1];
      if (typeof lastMessage.content === "string") {
        return lastMessage.content;
      }
      return JSON.stringify(lastMessage.content);
    } catch (err: any) {
      console.warn(`[LangGraph Agent] Model "${modelName}" failed, trying fallback model... Reason:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(`All Gemini LangGraph models failed. Last error: ${lastError?.message || lastError}`);
}
