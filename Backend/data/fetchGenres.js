import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function fetchGenres() {

  try {

    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const genres = response.data.genres;

    const genreMap = {};

    genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });

    fs.writeFileSync(
      "./data/genres.json",
      JSON.stringify(genreMap, null, 2)
    );

    console.log("Genres saved successfully!");

  } catch (error) {

    console.log(error.message);
  }
}

fetchGenres();