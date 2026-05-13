// src/app/bounties/evaluateSolution.ts
"use server";

import { GoogleGenAI, Type } from "@google/genai";

type EvaluationResult = {
  score: number;
  remarks: string;
};

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({});
}

function parseEvaluationResponse(text: string): EvaluationResult {
  const parsed = JSON.parse(text) as Partial<EvaluationResult>;
  const score = Number(parsed.score);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error("Gemini returned an invalid score");
  }
  if (typeof parsed.remarks !== "string" || !parsed.remarks.trim()) {
    throw new Error("Gemini returned invalid remarks");
  }

  return {
    score: Math.round(score),
    remarks: parsed.remarks.trim(),
  };
}

export async function evaluateProof(
  bounty: { title: string; description: string },
  proof: string
) {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `You are an expert technical evaluator for a Web3 bounty platform. 
      Evaluate the following submission against the bounty requirements.
      
      Bounty Title: ${bounty.title}
      Bounty Description: ${bounty.description}
      Hunter's Proof (Link/Explanation): ${proof}
      
      Analyze how well this proof satisfies the requirements. Provide a score out of 100, and a short remark (under 15 words) explaining the score. If the proof is just a random link or nonsense, score it low.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Score from 0 to 100" },
            remarks: { type: Type.STRING, description: "Brief justification under 15 words" },
          },
          required: ["score", "remarks"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response returned from Gemini");
    }

    return parseEvaluationResponse(response.text);
  } catch (error: unknown) {
    console.error("Evaluation Error:", error);
    const message = error instanceof Error ? error.message : "";
    const status = typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: number }).status
      : undefined;

    throw new Error(
      status === 429 || message.includes("Quota")
        ? "RATE_LIMIT_EXCEEDED"
        : "EVALUATION_FAILED"
    );
  }
}