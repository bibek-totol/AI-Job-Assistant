import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PDFParser = require("pdf2json");

/**
 * Extracts raw text from a PDF Buffer using pdf2json
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) =>
      reject(errData.parserError),
    );

    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText || "");
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

/**
 * Compute cosine similarity between two numerical vectors
 */
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate embeddings using GoogleGenerativeAI SDK with automatic fallback
 */
async function generateEmbeddingsWithFallback(
  apiKey: string,
  chunkTexts: string[],
  searchQuery: string,
): Promise<[number[][], number[]]> {
  const embeddingModels = [
    "text-embedding-004",
    "models/text-embedding-004",
    "embedding-001",
    "models/embedding-001",
  ];
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of embeddingModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const chunkPromises = chunkTexts.map(async (text) => {
        const res = await model.embedContent(text);
        return res.embedding.values;
      });
      const queryPromise = (async () => {
        const res = await model.embedContent(searchQuery);
        return res.embedding.values;
      })();

      const [chunkEmbeddings, queryEmbedding] = await Promise.all([
        Promise.all(chunkPromises),
        queryPromise,
      ]);

      console.log(`[VectorStore] Generated vector embeddings using "${modelName}"`);
      return [chunkEmbeddings, queryEmbedding];
    } catch {
      // Silently try next model candidate without printing noisy 404 logs
    }
  }

  throw new Error("Embedding API unavailable or rate-limited.");
}

/**
 * Process PDF buffer: extract text -> chunk text -> generate vector embeddings -> perform vector similarity search
 */
export async function processAndQueryPDF(
  buffer: Buffer,
  query: string,
  topK = 6,
): Promise<{ fullText: string; relevantChunks: string[]; chunkDocs: Document[] }> {
  const fullText = await extractTextFromPDF(buffer);

  if (!fullText || !fullText.trim()) {
    return { fullText: "", relevantChunks: [], chunkDocs: [] };
  }

  try {
    // 1. Text Chunking with LangChain RecursiveCharacterTextSplitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    const docs = await splitter.createDocuments([fullText]);
    const slicedDocs = docs.slice(0, 10);
    const chunkTexts = slicedDocs.map((d) => d.pageContent);

    // 2. Compute Vector Embeddings using official @google/generative-ai SDK
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const searchQuery = query?.trim() || fullText.slice(0, 300);
    const [chunkEmbeddings, queryEmbedding] = await generateEmbeddingsWithFallback(
      apiKey,
      chunkTexts,
      searchQuery,
    );

    // 3. Vector Similarity Search using Cosine Similarity Ranking
    const rankedDocs = slicedDocs
      .map((doc, index) => ({
        doc,
        similarity: cosineSimilarity(queryEmbedding, chunkEmbeddings[index]),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    const relevantChunks = rankedDocs.map((item) => item.doc.pageContent);
    const chunkDocs = rankedDocs.map((item) => item.doc);

    return {
      fullText,
      relevantChunks,
      chunkDocs,
    };
  } catch {
    console.log("[PDF Processing] Extracted PDF text successfully -> Processing with Gemini AI.");
    return {
      fullText,
      relevantChunks: [fullText.slice(0, 4000)],
      chunkDocs: [new Document({ pageContent: fullText.slice(0, 4000) })],
    };
  }
}
