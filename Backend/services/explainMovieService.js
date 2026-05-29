import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// =========================
// FALLBACK EXPLANATION
// Used when Gemini is down
// Builds a decent response from movie data alone
// =========================

function buildFallbackExplanation(userMessage, movie) {
  const lower = userMessage.toLowerCase();

  const genres = movie.genres || "";
  const overview = movie.overview || "";
  const rating = movie.imdbRating ? `${movie.imdbRating}/10` : null;
  const year = movie.releaseDate ? movie.releaseDate.split("-")[0] : null;

  // EMOTIONAL / SAD / FEELING QUESTIONS
  if (
    lower.includes("emotional") ||
    lower.includes("sad") ||
    lower.includes("cry") ||
    lower.includes("feel")
  ) {
    const isEmotional =
      genres.toLowerCase().includes("drama") ||
      overview.toLowerCase().includes("loss") ||
      overview.toLowerCase().includes("sacrifice") ||
      overview.toLowerCase().includes("grief") ||
      overview.toLowerCase().includes("love");

    return isEmotional
      ? `Yes, ${movie.title} definitely has an emotional core 🎭 It deals with themes that can really hit you in the feels.`
      : `${movie.title} leans more towards ${genres} — it's more of a thrill ride than a tearjerker, but it still has its moments.`;
  }

  // GOOD / WORTH WATCHING QUESTIONS
  if (
    lower.includes("good") ||
    lower.includes("worth") ||
    lower.includes("should i") ||
    lower.includes("recommend")
  ) {
    return rating
      ? `${movie.title} holds a ${rating} on IMDb${year ? ` (${year})` : ""} — that's a solid score. If you're into ${genres}, it's definitely worth a watch! 🎬`
      : `${movie.title} is a ${genres} film${year ? ` from ${year}` : ""} — if that sounds like your vibe, give it a go! 🎬`;
  }

  // PLOT / STORY / ABOUT QUESTIONS
  if (
    lower.includes("about") ||
    lower.includes("plot") ||
    lower.includes("story") ||
    lower.includes("what is")
  ) {
    const shortOverview =
      overview.length > 200 ? overview.substring(0, 200) + "..." : overview;
    return `${movie.title} is a ${genres} film — ${shortOverview}`;
  }

  // GENERIC FALLBACK
  return `${movie.title} is a ${genres} film${year ? ` from ${year}` : ""}${rating ? `, rated ${rating} on IMDb` : ""}. ${overview.substring(0, 150)}${overview.length > 150 ? "..." : ""} 🎬`;
}

// =========================
// MAIN EXPLAIN FUNCTION
// =========================

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

IMDb Rating:
${movie.imdbRating || "N/A"}

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

    // GEMINI RESPONSE (with timeout)
    const geminiPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 15000),
    );

    const result = await Promise.race([geminiPromise, timeoutPromise]);

    return result.response.text().trim();
  } catch (error) {
    console.log(
      "Explain Movie — Gemini unavailable, using fallback:",
      error.message,
    );

    // FALLBACK: build response from movie data
    return buildFallbackExplanation(userMessage, movie);
  }
}
