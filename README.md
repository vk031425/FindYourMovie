# FindYourMovie

An AI-powered movie discovery platform that helps users find movies based on natural language descriptions instead of exact movie titles.

Users can search for movies using prompts like:

* "I want a mind-bending movie like Inception"
* "Show me emotional superhero movies"
* "Recommend some car racing movies"
* "I want something dark and psychological"

The application uses semantic search, vector embeddings, Retrieval-Augmented Generation (RAG), and an AI-powered chat assistant to provide personalized movie recommendations.

---

# Live Demo

URL: https://find-your-movie-eight.vercel.app/

---

# Features

## Semantic Movie Search

Instead of traditional keyword search, users can search using natural language descriptions.

Example:

> "A movie about time travel and love"

The system retrieves semantically similar movies even when the exact keywords are not present.

---

## AI-Powered Movie Explanations

Every search result includes an AI-generated explanation describing why the recommended movies match the user's request.

Example:

> "Interstellar is probably your best pick if you're looking for emotional science fiction with breathtaking visuals and a strong parent-child relationship."

---

## Conversational Movie Assistant

The application includes a chatbot capable of:

### SHOW_MOVIES

User:

> Show me horror movies

Action:

> Retrieves and displays matching movie cards.

---

### OPEN_MOVIE

User:

> Open the second movie

Action:

> Navigates directly to the selected movie details page.

---

### EXPLAIN_MOVIE

User:

> Is this movie emotional?

Action:

> Provides additional information about the currently selected movie without changing the movie list.

---

#  System Architecture

User Query

↓

Embedding Generation

(Xenova MiniLM)

↓

Astra DB Vector Search

↓

Top Matching Movies Retrieved

↓

Gemini AI

↓

Natural Language Response

↓

Frontend UI

---

#  AI / RAG Pipeline

This project follows a Retrieval-Augmented Generation (RAG) architecture.

### Step 1: Movie Dataset

Movie metadata was collected from TMDB.

Dataset size:

* Approximately 1000 movies

Stored metadata includes:

* Title
* Overview
* Genres
* Poster URL
* Backdrop URL
* Release Date
* Language
* Popularity
* Rating
* Vote Count

---

### Step 2: Embedding Generation

Embeddings are generated using:

```text
Xenova/all-MiniLM-L6-v2
```

through:

```javascript
@xenova/transformers
```

Each movie's searchable content is converted into a dense vector representation.

---

### Step 3: Vector Storage

Vectors are stored inside:

```text
DataStax Astra DB
```

using Astra's vector search capabilities.

This allows semantic similarity matching instead of keyword matching.

---

### Step 4: Retrieval

When a user submits a query:

1. Query embedding is generated.
2. Astra DB performs vector similarity search.
3. Top matching movies are returned.

---

### Step 5: Generation

Retrieved movies are passed to:

```text
Google Gemini 2.5 Flash
```

which generates:

* conversational responses
* movie explanations
* contextual chatbot replies

---

# Movie Storage & Data Pipeline

Before users can perform semantic movie search, the movie dataset must be collected, embedded, and stored inside the vector database.

The project includes a complete ingestion pipeline built specifically for this purpose.

## Data Source

Movie metadata was collected from TMDB (The Movie Database).

Dataset size:

* Approximately 1000 movies

Each movie contains:

* TMDB ID
* Title
* Overview
* Genres
* Release Date
* Language
* Popularity
* IMDb Rating
* Vote Count
* Poster URL
* Backdrop URL

---

## Step 1: Fetch Movie Data

Script:

```bash
node fetchMovies.js
```

Purpose:

* Downloads movie metadata from TMDB
* Cleans and structures the data
* Saves movie information for further processing

---

## Step 2: Create Astra DB Collection

Script:

```bash
node setupDB.js
```

Purpose:

* Creates the Astra DB collection
* Enables vector search capabilities
* Prepares the database for storing movie embeddings

---

## Step 3: Generate Searchable Text

To improve semantic retrieval, movie attributes are combined into a single searchable text field.

Example:

```text
Title: Interstellar

Genres: Science Fiction, Drama

Overview: A team of explorers travel through a wormhole in space...
```

This combined representation helps the embedding model understand:

* themes
* genres
* story elements
* emotions
* plot descriptions

instead of relying only on movie titles.

---

## Step 4: Generate Embeddings

Script:

```bash
node embedMovies.js
```

Model Used:

```text
Xenova/all-MiniLM-L6-v2
```

Library:

```javascript
@xenova/transformers
```

Purpose:

* Converts movie searchable text into dense vector embeddings
* Creates semantic representations of movies
* Prepares vectors for similarity search

---

## Step 5: Store Movies in Astra DB

Script:

```bash
node storeMovies.js
```

Purpose:

* Inserts movie metadata into Astra DB
* Stores generated embeddings
* Creates the searchable movie collection used by the application

Example document:

```json
{
  "tmdbId": 157336,
  "title": "Interstellar",
  "overview": "...",
  "genres": "...",
  "poster": "...",
  "backdrop": "...",
  "searchableText": "...",
  "$vector": [...]
}
```

---

## Storage Architecture

```text
TMDB Dataset
      │
      ▼
fetchMovies.js
      │
      ▼
Raw Movie Data
      │
      ▼
embedMovies.js
      │
      ▼
MiniLM Embeddings
      │
      ▼
storeMovies.js
      │
      ▼
Astra DB Vector Collection
      │
      ▼
Semantic Search API
```

---

## Why Vector Search?

Traditional keyword search would require users to know exact movie titles or keywords.

With vector search, users can search naturally:

```text
Show me emotional superhero movies

Recommend a movie like Inception

I want a dark psychological thriller

Suggest some car racing movies
```

The query is converted into an embedding and matched against movie embeddings stored in Astra DB, allowing retrieval based on meaning rather than exact words.


# 🛠️ Tech Stack

## Frontend

* React
* React Router
* Axios
* Vite
* CSS

---

## Backend

* Node.js
* Express.js
* Astra DB
* Gemini AI
* Xenova Transformers

---

## AI / ML

* RAG Architecture
* Vector Embeddings
* Semantic Search
* Gemini 2.5 Flash
* MiniLM Embeddings

---

#  Project Structure

## Frontend

```text
Frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
```

## Backend

```text
Backend/
├── services/
│   ├── astraClient.js
│   ├── embeddingService.js
│   ├── geminiService.js
│   ├── chatService.js
│   ├── movieIntentService.js
│   └── explainMovieService.js
│
├── server.js
├── fetchMovies.js
├── storeMovies.js
├── embedMovies.js
└── setupDB.js
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repo-url>
```

---

## 2. Backend Setup

```bash
cd Backend

npm install
```

Create:

```env
GEMINI_API_KEY=your_key

ASTRA_DB_APPLICATION_TOKEN=your_token

ASTRA_DB_API_ENDPOINT=your_endpoint

FRONTEND_URL=http://localhost:5173
```

Run:

```bash
npm start
```

---

## 3. Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

# Testing Strategy

The application was tested using:

## Search Testing

Queries such as:

* horror movies
* racing movies
* emotional movies
* superhero movies

Verified:

* relevant retrieval
* semantic matching
* AI explanation quality

---

## Chat Testing

Tested all supported actions:

### SHOW_MOVIES

```text
Show me comedy movies
```

---

### OPEN_MOVIE

```text
Open first movie
Open Cars 3
```

---

### EXPLAIN_MOVIE

```text
Is this movie emotional?
Tell me more about this movie
```

---

### SHOW_SIMILAR_MOVIES

```text
Show similar movies
```

---

## UI Testing

Verified:

* Movie details navigation
* Search state persistence
* Responsive layouts
* Mobile usability
* Error handling

---

# Assumptions Made During Development

1. Users generally refer to movies currently visible on screen.

2. Context is maintained through the chatbot conversation state.

3. AI responses should remain concise and conversational.

4. Retrieved movies are considered the source of truth and Gemini should not hallucinate movie recommendations outside retrieved results.

5. Movie recommendations are limited to movies available in the database.

---

#  Known Limitations

1. Dataset currently contains approximately 1000 movies.

2. Gemini API free-tier quotas may limit chatbot functionality.

3. Conversational memory is session-based.

4. Similar movie recommendations currently rely on semantic similarity rather than collaborative filtering.

---

# Future Enhancements

## Authentication

* User accounts
* Saved watchlists
* Search history

---

## Advanced Recommendations

* Personalized recommendations
* Collaborative filtering
* Hybrid recommendation systems

---

## Streaming Integration

Show where users can watch:

* Netflix
* Prime Video
* Disney+
* HBO

---

## Better Conversational Memory

Support references like:

```text
Open the third one

Show another like that

What about the previous movie?
```

---

## Larger Movie Dataset

Expand from 1000 movies to:

* 10,000+
* Full TMDB catalog

---

## Analytics Dashboard

Track:

* Popular searches
* User engagement
* Recommendation performance

---

# Author

Vinay Kumar

B.Tech, IIT Delhi

Passionate about AI, Game Development, Full Stack Development, and Building AI-Powered Products.
