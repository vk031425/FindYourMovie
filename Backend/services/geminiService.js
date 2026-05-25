import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function generateMovieExplanation(query, movies) {

  try {

    const movieContext = movies.map((movie) => {

      return `
        Title: ${movie.title}
        Genres: ${movie.genres}
        Overview: ${movie.overview}
      `;

    }).join("\n");

    const prompt = `
      User Query:
      ${query}

      Recommended Movies:
      ${movieContext}

      Explain briefly why these movies match the user's request.
    `;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {

    console.log("Gemini Error:", error.message);

    // FALLBACK RESPONSE

    return `
      These movies were recommended because they share
      similar themes, genres, tone, and storytelling
      elements related to the user's query.
    `;
  }
}

export default generateMovieExplanation;