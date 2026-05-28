import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export default async function explainMovie(userMessage, movie) {
  try {
    const prompt = `
You are a friendly movie expert.

The user is asking about this movie:

Title:
${movie.title}

Overview:
${movie.overview}

Genres:
${movie.genres}

User Question:
${userMessage}

TASK:
- Reply conversationally
- Keep response short
- Sound natural and human
- Maximum 4 sentences
- Focus ONLY on answering the user's question
- Do NOT summarize entire movie unnecessarily
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (error) {
    console.log(error);

    return `
${movie.title} is definitely an interesting movie 🎬
`;
  }
}
