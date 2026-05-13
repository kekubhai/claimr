"use server";

import { GoogleGenAI, Type } from "@google/genai";

export interface BountyData {
  title: string;
  description: string;
  amount: string;
  unit: string;
  endDate: string;
}

type BountyAnalysis = {
  score: number;
  verdict: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  remarks: string[];
};

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({});
}

function parseBountyAnalysis(text: string): BountyAnalysis {
  const parsed = JSON.parse(text) as Partial<BountyAnalysis>;
  const score = Number(parsed.score);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error("Gemini returned an invalid score");
  }
  if (!["EXCELLENT", "GOOD", "FAIR", "POOR"].includes(parsed.verdict ?? "")) {
    throw new Error("Gemini returned an invalid verdict");
  }
  if (!Array.isArray(parsed.remarks) || parsed.remarks.some((remark) => typeof remark !== "string")) {
    throw new Error("Gemini returned invalid remarks");
  }

  return {
    score: Math.round(score),
    verdict: parsed.verdict as BountyAnalysis["verdict"],
    remarks: parsed.remarks.map((remark) => remark.trim()).filter(Boolean),
  };
}

export async function upliftBounty(bounty: BountyData) {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `You are a bounty quality analyst for a Web3/tech bounty platform. Analyse the following bounty and rate its quality.

    Title: ${bounty.title}
    Description: ${bounty.description}
    Reward: ${bounty.amount} ${bounty.unit}
    End Date: ${bounty.endDate}
    
    Score based on: clarity of scope (25 pts), reward competitiveness vs market (25 pts), description quality (25 pts), deadline reasonableness (25 pts). Keep each remark under 10 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Quality score from 0 to 100",
            },
            verdict: {
              type: Type.STRING,
              enum: ["EXCELLENT", "GOOD", "FAIR", "POOR"],
              description: "Overall verdict",
            },
            remarks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of brief improvement suggestions",
            },
          },
          required: ["score", "verdict", "remarks"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response returned from Gemini");
    }

    return parseBountyAnalysis(response.text);
  } catch (error) {
    console.error("Bounty analysis failed:", error);
    throw new Error("BOUNTY_ANALYSIS_FAILED");
  }
}