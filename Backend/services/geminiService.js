import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// GEMINI SETUP

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// GENERATE FRIENDLY AI RESPONSE

async function generateMovieExplanation(query, movies) {
  try {
    // FORMAT MOVIE CONTEXT

    const movieContext = movies
      .map((movie, index) => {
        return `
Movie ${index + 1}

Title: ${movie.title}

Genres: ${movie.genres}

Overview: ${movie.overview}
`;
      })
      .join("\n");

    // FRIENDLY CONVERSATIONAL PROMPT

    const prompt = `
You are FindYourMovie AI.

You are a friendly conversational movie assistant.

The user is chatting naturally with you.

USER MESSAGE:
"${query}"

RETRIEVED MOVIES:
${movieContext}

YOUR TASK:
- Reply naturally like a human.
- Keep response short.
- Maximum 3-5 sentences.
- Sound engaging and conversational.
- Mention only relevant movies.
- Do NOT explain every movie individually.
- Do NOT sound robotic or analytical.
- Do NOT create huge paragraphs.
- NEVER mention movies outside retrieved list.
- Use a friendly movie-lover tone.

GOOD RESPONSE EXAMPLE:
"Ford v Ferrari is probably your best pick if you want intense competitive racing drama 🏎️

Cars is more lighthearted and fun, while Drive has a darker thriller vibe."

BAD RESPONSE EXAMPLE:
"The following movies match the query because..."

Now generate the response.
`;

    // GEMINI RESPONSE

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response.trim();
  } catch (error) {
    console.log("Gemini Error:", error.message);

    // FALLBACK RESPONSE

    return `
I found some movies that match your vibe 🎬

You might enjoy ${
      movies[0]?.title || "these recommendations"
    } if you're looking for something similar to your request.
`;
  }
}

export default generateMovieExplanation;
