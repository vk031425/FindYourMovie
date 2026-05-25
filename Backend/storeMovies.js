import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

import db from "./services/astraClient.js";
import getEmbedding from "./services/embeddingService.js";

dotenv.config();

// LOAD GENRE MAP

const genreMap = JSON.parse(
  fs.readFileSync("./data/genres.json", "utf-8")
);

async function storeMovies() {

  try {

    const collection = db.collection("movies");

    let allMovies = [];

    // FETCH MOVIES

    for (let page = 1; page <= 50; page++) {

      console.log(`Fetching page ${page}...`);

      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }
      );

      allMovies.push(...response.data.results);
    }

    console.log(`Movies fetched: ${allMovies.length}`);

    // STORE MOVIES

    for (const movie of allMovies) {

      try {

        // CONVERT GENRE IDS → NAMES

        const genreNames = movie.genre_ids
          .map((id) => genreMap[id])
          .filter(Boolean)
          .join(", ");

        // CREATE SEARCHABLE TEXT

        const searchableText = `
          Title: ${movie.title}

          Genres: ${genreNames}

          Overview: ${movie.overview}
        `;

        console.log(`Generating embedding for: ${movie.title}`);

        // GENERATE EMBEDDING

        const embedding = await getEmbedding(searchableText);

        // STORE IN ASTRA DB

        await collection.insertOne({

          tmdbId: movie.id,

          title: movie.title,

          overview: movie.overview,

          genres: genreNames,

          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,

          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,

          imdbRating: movie.vote_average,

          voteCount: movie.vote_count,

          popularity: movie.popularity,

          releaseDate: movie.release_date,

          language: movie.original_language,

          searchableText,

          $vector: embedding,

        });

        console.log(`${movie.title} stored successfully`);

      } catch (movieError) {

        console.log(
          `Error storing movie: ${movie.title}`
        );

        console.log(movieError.message);
      }
    }

    console.log("All movies stored successfully!");

  } catch (error) {

    console.log(error.message);
  }
}

storeMovies();