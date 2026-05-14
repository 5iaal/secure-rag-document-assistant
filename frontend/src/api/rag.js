import { apiRequest } from "./client";

export async function askQuestion(question, topK = 4) {
  return apiRequest("/rag/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      top_k: topK,
    }),
  });
}