"use server";

import {   GoogleGenAI, type Schema } from "@google/genai";
const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({});

export interface BountyData {
  title: string;
  description: string;
  amount: string;
  unit: string;
  endDate: string;
}

export interface BountyAnalysis {
  score: number;
  verdict: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  remarks: string[];
}

// const responseSchema: Schema = {
//   type: SchemaType.OBJECT,
//   properties: {
//     score: { type: Sc.NUMBER, description: "Quality score from 0 to 100" },
//     verdict: {
      
//       format: "enum",
//       enum: ["EXCELLENT", "GOOD", "FAIR", "POOR"],
//       description: "Overall verdict",
//     },
  
//   },
//   required: ["score", "verdict", "remarks"],
// };

export async function upliftBounty(bounty: BountyData): Promise<string | undefined> {
  const model = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are a bounty quality analyst for a Web3/tech bounty platform. Analyse the following bounty and rate its quality compared to current market standards.

Bounty Details:
- Title: ${bounty.title}
- Description: ${bounty.description}
- Reward: ${bounty.amount} ${bounty.unit}
- End Date: ${bounty.endDate}

Score based on: clarity of scope (25 pts), reward competitiveness vs market (25 pts), description quality (25 pts), deadline reasonableness (25 pts). Keep each remark under 10 words.`,
  
     
    
  });

  

  const result=model.text
 
   
  
  return result;
}
