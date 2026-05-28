import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export default async function detectMovieIntent(
  message,
  currentMovies = [],
  lastMovieId = null,
) {
  try {
    // LAST MOVIE

    const lastMovie =
      currentMovies.find((m) => m.tmdbId === lastMovieId) || null;

    // SIMPLIFIED MOVIE LIST

    const simplifiedMovies = currentMovies.map((movie, index) => ({
      number: index + 1,

      tmdbId: movie.tmdbId,

      title: movie.title,
    }));

    // PROMPT

    const prompt = `
You are an intent detection engine for a movie assistant app.

Your task is to classify the user's intent.

Possible intents:

1. SEARCH_MOVIES
- User wants movie recommendations
- User wants discovery
- User is browsing movies

2. EXPLAIN_MOVIE
- User wants details/opinion/review/emotional tone/story explanation
- User asks follow-up question about a movie

3. OPEN_MOVIE
- User clearly wants to open/select/watch a movie page

-----------------------------------

Current movies shown to user:

${JSON.stringify(simplifiedMovies, null, 2)}

-----------------------------------

Last movie user discussed:

${
  lastMovie
    ? JSON.stringify(
        {
          tmdbId: lastMovie.tmdbId,

          title: lastMovie.title,
        },
        null,
        2,
      )
    : "None"
}

-----------------------------------

User message:

"${message}"

-----------------------------------

Important Rules:

- "Is this movie emotional?"
→ EXPLAIN_MOVIE

- "Tell me more about this"
→ EXPLAIN_MOVIE

- "Open this movie"
→ OPEN_MOVIE

- "Show superhero movies"
→ SEARCH_MOVIES

- "Show Interstellar"
→ OPEN_MOVIE IF Interstellar exists in current movies
Otherwise SEARCH_MOVIES

- If user says:
"first movie"
"second one"
"movie 3"
"this one"
"that movie"
Then resolve from current movies.

- If user asks follow-up question and last movie exists:
Use EXPLAIN_MOVIE with lastMovie.

- NEVER hallucinate movie ids.

-----------------------------------

Respond ONLY valid JSON.

Format:

{
  "type": "SEARCH_MOVIES" | "EXPLAIN_MOVIE" | "OPEN_MOVIE",
  "tmdbId": number | null,
  "reason": "short reason"
}
`;

    // GEMINI RESPONSE

    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    // CLEAN JSON RESPONSE

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      return {
        type: "SEARCH_MOVIES",
      };
    }

    // FIND MOVIE

    const movie = currentMovies.find((m) => m.tmdbId === parsed.tmdbId) || null;

    // INVALID MOVIE

    if (
      (parsed.type === "EXPLAIN_MOVIE" || parsed.type === "OPEN_MOVIE") &&
      !movie
    ) {
      return {
        type: "SEARCH_MOVIES",
      };
    }

    // FINAL

    return {
      type: parsed.type,

      movie,
    };
  } catch (error) {
    console.log("Intent Detection Error:", error.message);

    return {
      type: "SEARCH_MOVIES",
    };
  }
}
