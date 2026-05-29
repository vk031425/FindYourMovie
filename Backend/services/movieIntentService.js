import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// =========================
// HARDCODED FALLBACK INTENT
// Used when Gemini is down
// =========================

function detectIntentFallback(message, currentMovies = [], lastMovieId = null) {
  const lower = message.toLowerCase();

  // EXPLAIN WORDS
  const explainWords = [
    "explain",
    "emotional",
    "sad",
    "scary",
    "good",
    "worth",
    "what is it about",
    "tell me more",
    "interesting",
    "why",
    "review",
    "plot",
    "story",
    "about",
    "describe",
    "how is",
    "is it",
    "recommend",
    "should i",
    "opinion",
  ];

  // OPEN WORDS
  const openWords = ["open", "watch", "select", "show me", "take me", "go to"];

  // GENERAL QUESTION WORDS (prefer search over title match)
  const generalWords = [
    "any",
    "which",
    "best",
    "most",
    "all",
    "list",
    "find",
    "are there",
    "is there",
    "movies like",
  ];

  const isGeneral = generalWords.some((w) => lower.includes(w));
  const isExplain = explainWords.some((w) => lower.includes(w));
  const isOpen = openWords.some((w) => lower.includes(w));

  // NUMBER WORDS
  const numberWords = {
    first: 0,
    second: 1,
    third: 2,
    fourth: 3,
    fifth: 4,
    sixth: 5,
    seventh: 6,
    eighth: 7,
    ninth: 8,
    tenth: 9,
  };

  // RESOLVE BY POSITION
  for (const numWord in numberWords) {
    if (lower.includes(numWord)) {
      const movie = currentMovies[numberWords[numWord]];
      if (movie) {
        return {
          type: isExplain ? "EXPLAIN_MOVIE" : "OPEN_MOVIE",
          movie,
        };
      }
    }
  }

  // RESOLVE BY "movie 2" PATTERN
  const movieNumberMatch = lower.match(/movie\s+(\d+)/i);
  if (movieNumberMatch) {
    const movie = currentMovies[parseInt(movieNumberMatch[1]) - 1];
    if (movie) {
      return {
        type: isExplain ? "EXPLAIN_MOVIE" : "OPEN_MOVIE",
        movie,
      };
    }
  }

  // THIS ONE / THAT ONE
  if (lower.includes("this one") || lower.includes("that one")) {
    if (currentMovies[0]) {
      return {
        type: isExplain ? "EXPLAIN_MOVIE" : "OPEN_MOVIE",
        movie: currentMovies[0],
      };
    }
  }

  // FOLLOW-UP USING LAST MOVIE
  const followUpWords = [
    "why",
    "how",
    "what about",
    "elaborate",
    "and",
    "but",
    "so",
    "you think",
    "do you",
  ];
  const isFollowUp = followUpWords.some((w) => lower.includes(w));

  if (lastMovieId && isFollowUp) {
    const lastMovie = currentMovies.find((m) => m.tmdbId === lastMovieId);
    if (lastMovie) {
      return { type: "EXPLAIN_MOVIE", movie: lastMovie };
    }
  }

  // TITLE MATCHING (only if not a general question)
  if (!isGeneral) {
    for (const movie of currentMovies) {
      const movieTitle = movie.title.toLowerCase();

      if (lower.includes(movieTitle)) {
        return {
          type: isOpen
            ? "OPEN_MOVIE"
            : isExplain
              ? "EXPLAIN_MOVIE"
              : "OPEN_MOVIE",
          movie,
        };
      }

      const titleWords = movieTitle
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .filter((w) => w.length > 3);

      const matched = titleWords.filter((w) => lower.includes(w));
      const required = titleWords.length === 1 ? 1 : 2;

      if (titleWords.length > 0 && matched.length >= required) {
        return {
          type: isOpen
            ? "OPEN_MOVIE"
            : isExplain
              ? "EXPLAIN_MOVIE"
              : "OPEN_MOVIE",
          movie,
        };
      }
    }
  }

  return { type: "SEARCH_MOVIES" };
}

// =========================
// MAIN INTENT DETECTION
// Tries Gemini first, falls back to hardcoded logic
// =========================

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

    // GEMINI RESPONSE (with timeout)
    const geminiPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 15000),
    );

    const result = await Promise.race([geminiPromise, timeoutPromise]);
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
      console.log("Intent JSON parse failed — using fallback");
      return detectIntentFallback(message, currentMovies, lastMovieId);
    }

    // FIND MOVIE
    const movie = currentMovies.find((m) => m.tmdbId === parsed.tmdbId) || null;

    // INVALID MOVIE
    if (
      (parsed.type === "EXPLAIN_MOVIE" || parsed.type === "OPEN_MOVIE") &&
      !movie
    ) {
      return { type: "SEARCH_MOVIES" };
    }

    // FINAL
    return {
      type: parsed.type,
      movie,
    };
  } catch (error) {
    console.log(
      "Intent Detection — Gemini unavailable, using fallback:",
      error.message,
    );

    // FALLBACK TO HARDCODED LOGIC
    return detectIntentFallback(message, currentMovies, lastMovieId);
  }
}
