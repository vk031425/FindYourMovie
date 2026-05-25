import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function fetchMovies() {

  let allMovies = [];

  try {

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

    console.log("Total Movies:", allMovies.length);

    console.log(allMovies[0]);

  } catch (error) {
    console.log(error.message);
  }
}

fetchMovies();