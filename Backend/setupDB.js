import db from "./services/astraClient.js";

async function setupDB() {
  try {
    const collection = await db.createCollection("movies", {
      vector: {
        dimension: 384,
        metric: "cosine",
      },
    });

    console.log("Movies collection created!");
  } catch (error) {
    console.log(error.message);
  }
}

setupDB();