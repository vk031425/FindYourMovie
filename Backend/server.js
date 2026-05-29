import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./services/astraClient.js";
import getEmbedding from "./services/embeddingService.js";
import generateMovieExplanation from "./services/geminiService.js";
import processChatMessage from "./services/chatService.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());

const collection = db.collection("movies");

// SEMANTIC SEARCH API

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    // VALIDATION

    if (!query) {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    console.log("User Query:", query);

    // GENERATE QUERY EMBEDDING

    const queryEmbedding = await getEmbedding(query);

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

    // CONVERT CURSOR TO ARRAY

    const movies = await results.toArray();

    // GENERATE AI EXPLANATION

    const explanation = await generateMovieExplanation(query, movies);

    // FINAL RESPONSE

    res.json({
      query,
      explanation,
      totalResults: movies.length,
      movies,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// AI CHAT API

app.post("/chat", async (req, res) => {
  try {
    const { message, conversation } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("Chat Message:", message);

    // PROCESS CHAT

    const response = await processChatMessage({
      message,
      conversation,
      collection,
    });

    res.json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// HEALTH CHECK

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FindYourMovie API Running",
  });
});

// START SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
