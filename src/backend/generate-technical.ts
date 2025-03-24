import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Missing OpenAI API Key.");
const openai = new OpenAI({ apiKey });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { formattedText } = req.body;
  if (!formattedText) return res.status(400).json({ error: "Missing input" });

  try {
    const response = await openai.chat.completions.create({
      "model": "gpt-4",
      "messages": [
        {
          "role": "system",
          "content": "You are a **cybersecurity analyst** who specializes in **business risk management**. Your goal is to provide **clear, actionable security recommendations** that help non-technical business leaders **understand and prioritize security**. Extract only security measures relevant to **Technical Controls** from the provided report. \n\nCategories to include:\n- Network Security\n- Endpoint Security\n- Application Security\n\nFor each measure, include:\n1. Security Measure Title\n2. Category\n3. Subcategory\n4. Essential Actions (only necessary steps, remove redundant ones)\n5. Business Risks if ignored\n\nStrictly exclude introduction, final takeaways, or any unrelated security measures."
        },
        { "role": "user", "content": formattedText }
      ],
      "temperature": 0.7
    
    });
    const botResponse = response.choices[0]?.message?.content || "No response generated.";
    return res.status(200).json({ bot: botResponse });
  } catch (error: any) {
    console.error("Technical Error:", error.message || error);
    return res.status(500).json({ error: "Technical response failed." });
  }
} 