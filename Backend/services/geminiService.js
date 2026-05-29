import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// =========================
// FALLBACK RESPONSE
// Used when Gemini is down
// Builds a clean response from movie data alone
// =========================

function buildFallbackSearchResponse(query, movies) {
  if (!movies || movies.length === 0) {
    return "I couldn't find any movies matching that. Try a different search! 🎬";
  }

  const lower = query.toLowerCase();

  // Pick the most relevant intro line based on query keywords
  let intro = "Here are some movies you might enjoy 🎬";

  if (lower.includes("action"))
    intro = "Here are some action-packed picks for you 💥";
  else if (lower.includes("horror") || lower.includes("scary"))
    intro = "These ones should give you a good scare 👻";
  else if (lower.includes("comedy") || lower.includes("funny"))
    intro = "These should get you laughing 😄";
  else if (
    lower.includes("sad") ||
    lower.includes("emotional") ||
    lower.includes("cry")
  )
    intro = "These ones might hit you right in the feels 🥺";
  else if (
    lower.includes("romantic") ||
    lower.includes("romance") ||
    lower.includes("love")
  )
    intro = "Here are some great picks for a movie night ❤️";
  else if (lower.includes("animated") || lower.includes("animation"))
    intro = "Here are some great animated films 🎨";
  else if (lower.includes("superhero"))
    intro = "Suiting up — here are your superhero picks 🦸";

  // List top 3 movies cleanly
  const topMovies = movies.slice(0, 3);
  const movieLines = topMovies
    .map((m) => {
      const year = m.releaseDate ? m.releaseDate.split("-")[0] : null;
      const rating = m.imdbRating ? ` · ⭐ ${m.imdbRating}` : "";
      return `**${m.title}**${year ? ` (${year})` : ""}${rating} — ${m.genres}`;
    })
    .join("\n\n");

  return `${intro}\n\n${movieLines}`;
}

// =========================
// MAIN FUNCTION
// =========================

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

    // GEMINI RESPONSE (with timeout)
    const geminiPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 15000),
    );

    const result = await Promise.race([geminiPromise, timeoutPromise]);
    return result.response.text().trim();
  } catch (error) {
    console.log("Gemini Service — unavailable, using fallback:", error.message);

    // FALLBACK: build response from movie data
    return buildFallbackSearchResponse(query, movies);
  }
}

export default generateMovieExplanation;
