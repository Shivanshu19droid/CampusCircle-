import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const client = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

//export const geminiModel = client.getGenerativeModel({ model: "gemini-1.5-flash" });

export const callForBio = async function (input) {
  const { role, experience, skills, highlights } = input;

  const prompt = `
Write a professional, LinkedIn-style bio.
Role: ${role}
Experience: ${experience}
Skills: ${skills}
Highlights: ${highlights}

Tone: engaging, professional, inspiring.
Length: 2-3 sentences., return a single response only, brief enough to be on the bio so that it highlights the users portfolio at a glance -- short yet impactful. Maximum allowed length is 200 characters
  `;

  // Use `generate` instead of `responses.create`
  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  // Access the generated text
  const bio = result.text;

  return bio;
};
