import getEmbedding from "./embeddingService.js";

import generateMovieExplanation from "./geminiService.js";

import detectMovieIntent from "./movieIntentService.js";

import explainMovie from "./explainMovieService.js";

export default async function processChatMessage({
  message,
  conversation = {},
  collection,
}) {
  try {
    // CURRENT MOVIES
    const currentMovies = conversation.currentMovies || [];

    // LAST MOVIE (for follow-up context)
    const lastMovieId = conversation.lastMovieId || null;

    // DETECT MOVIE INTENT
    const intent = await detectMovieIntent(message, currentMovies, lastMovieId);

    // =========================
    // EXPLAIN MOVIE
    // =========================

    if (intent.type === "EXPLAIN_MOVIE") {
      const explanation = await explainMovie(message, intent.movie);

      return {
        success: true,

        message: explanation,

        // IMPORTANT:
        // DO NOT RETURN MOVIES

        movies: [],

        action: {
          type: "EXPLAIN_MOVIE",

          movieId: intent.movie.tmdbId,
        },
      };
    }

    // =========================
    // OPEN MOVIE
    // =========================

    if (intent.type === "OPEN_MOVIE") {
      return {
        success: true,

        message: `Opening ${intent.movie.title} 🎬`,

        // IMPORTANT:
        // DO NOT RETURN MOVIES

        movies: [],

        action: {
          type: "OPEN_MOVIE",

          movieId: intent.movie.tmdbId,
        },
      };
    }

    // =========================
    // SEARCH MOVIES
    // =========================

    // GENERATE EMBEDDING
    const queryEmbedding = await getEmbedding(message);

    // VECTOR SEARCH
    const results = await collection.find(
      {},
      {
        sort: {
          $vector: queryEmbedding,
        },

        limit: 10,
      },
    );

    // CONVERT TO ARRAY
    const movies = await results.toArray();

    // GENERATE FRIENDLY AI RESPONSE
    // (geminiService handles its own fallback internally)
    const aiMessage = await generateMovieExplanation(message, movies);

    // FINAL RESPONSE
    return {
      success: true,

      message: aiMessage,

      // ONLY SEARCH RETURNS MOVIES
      movies,

      action: {
        type: "SHOW_MOVIES",
      },
    };
  } catch (error) {
    console.log("Chat Service Error:", error);

    return {
      success: false,

      message: "Hmm, something went wrong on my end 🎬 Try asking again in a moment!",

      movies: [],

      action: {
        type: "NONE",
      },
    };
  }
}
