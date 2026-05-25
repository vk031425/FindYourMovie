import fs from "fs";
import csv from "csv-parser";

const movies = [];

fs.createReadStream("./data/movies.csv")
  .pipe(csv())
  .on("data", (data) => movies.push(data))
  .on("end", () => {
    console.log(movies[0]);
    console.log("Movies Loaded:", movies.length);
  });