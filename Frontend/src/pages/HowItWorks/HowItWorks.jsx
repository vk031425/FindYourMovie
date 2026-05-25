import React from 'react'

import Navbar from '../../components/Navbar'

import './HowItWorks.css'

export default function HowItWorks() {

  return (

    <div className="how-it-works">

      {/* NAVBAR */}

      <Navbar />

      {/* HERO */}

      <section className="how-it-works__hero">

        <div className="how-it-works__hero-content">

          <h1>
            How FindYourMovie Works
          </h1>

          <p>
            Discover how AI, semantic search,
            vector embeddings, and retrieval
            systems work together to provide
            intelligent movie recommendations.
          </p>

        </div>

      </section>

      {/* CONTENT */}

      <main className="how-it-works__container">

        {/* SECTION 1 */}

        <section className="how-it-works__section">

          <div className="how-it-works__number">
            01
          </div>

          <div className="how-it-works__info">

            <h2>
              Natural Language Search
            </h2>

            <p>
              Instead of searching movies by
              genre filters alone, users can
              search naturally using prompts
              like:
            </p>

            <div className="how-it-works__examples">

              <span>
                “Mind-bending sci-fi movies”
              </span>

              <span>
                “Dark psychological thrillers”
              </span>

              <span>
                “Emotional space movies”
              </span>

            </div>

          </div>

        </section>

        {/* SECTION 2 */}

        <section className="how-it-works__section">

          <div className="how-it-works__number">
            02
          </div>

          <div className="how-it-works__info">

            <h2>
              Semantic Embeddings
            </h2>

            <p>
              User queries and movie metadata
              are converted into vector
              embeddings using AI embedding
              models.
            </p>

            <p>
              These embeddings capture
              semantic meaning rather than
              simple keyword matching.
            </p>

          </div>

        </section>

        {/* SECTION 3 */}

        <section className="how-it-works__section">

          <div className="how-it-works__number">
            03
          </div>

          <div className="how-it-works__info">

            <h2>
              Vector Similarity Search
            </h2>

            <p>
              Movie embeddings are stored in
              Astra DB vector database.
            </p>

            <p>
              When users search, the system
              performs semantic similarity
              search to retrieve movies that
              closely match the intent,
              themes, tone, and storytelling
              style of the query.
            </p>

          </div>

        </section>

        {/* SECTION 4 */}

        <section className="how-it-works__section">

          <div className="how-it-works__number">
            04
          </div>

          <div className="how-it-works__info">

            <h2>
              AI Recommendation Reasoning
            </h2>

            <p>
              Gemini AI analyzes the retrieved
              movies and generates contextual
              explanations describing why the
              recommendations match the user’s
              request.
            </p>

            <div className="how-it-works__quote">

              “These films explore emotional
              isolation, existential themes,
              and philosophical storytelling
              similar to Interstellar.”

            </div>

          </div>

        </section>

        {/* ARCHITECTURE FLOW */}

        <section className="how-it-works__architecture">

          <h2>
            AI Recommendation Pipeline
          </h2>

          <div className="how-it-works__flow">

            <div className="how-it-works__flow-card">
              User Query
            </div>

            <div className="how-it-works__arrow">
              ↓
            </div>

            <div className="how-it-works__flow-card">
              Embedding Generation
            </div>

            <div className="how-it-works__arrow">
              ↓
            </div>

            <div className="how-it-works__flow-card">
              Vector Similarity Search
            </div>

            <div className="how-it-works__arrow">
              ↓
            </div>

            <div className="how-it-works__flow-card">
              Movie Retrieval
            </div>

            <div className="how-it-works__arrow">
              ↓
            </div>

            <div className="how-it-works__flow-card">
              AI Explanation Generation
            </div>

          </div>

        </section>

        {/* TECH STACK */}

        <section className="how-it-works__tech">

          <h2>
            Technologies Used
          </h2>

          <div className="how-it-works__tech-grid">

            <div className="how-it-works__tech-card">
              React
            </div>

            <div className="how-it-works__tech-card">
              Node.js
            </div>

            <div className="how-it-works__tech-card">
              Express
            </div>

            <div className="how-it-works__tech-card">
              Astra DB
            </div>

            <div className="how-it-works__tech-card">
              Gemini AI
            </div>

            <div className="how-it-works__tech-card">
              TMDB API
            </div>

            <div className="how-it-works__tech-card">
              Vector Embeddings
            </div>

            <div className="how-it-works__tech-card">
              Semantic Search
            </div>

          </div>

        </section>

      </main>

    </div>
  )
}