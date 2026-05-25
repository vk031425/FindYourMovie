import React from 'react'

import Navbar from '../../components/Navbar'

import './About.css'

export default function About() {

  return (

    <div className="about">

      {/* NAVBAR */}

      <Navbar />

      {/* HERO */}

      <section className="about__hero">

        <div className="about__hero-content">

          <h1>
            About FindYourMovie
          </h1>

          <p>
            An AI-powered semantic movie
            discovery platform that helps
            users find movies through natural
            language, emotions, themes,
            storytelling, and cinematic mood.
          </p>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <main className="about__container">

        {/* PROJECT OVERVIEW */}

        <section className="about__section">

          <h2>
            Project Vision
          </h2>

          <p>
            Traditional movie platforms rely
            heavily on genre filters and
            keyword search. FindYourMovie
            reimagines movie discovery using
            semantic AI search powered by
            embeddings, vector databases,
            retrieval systems, and large
            language models.
          </p>

          <p>
            Instead of manually browsing
            categories, users can naturally
            describe what they want to watch:
          </p>

          <div className="about__examples">

            <span>
              “Mind-bending sci-fi movies”
            </span>

            <span>
              “Dark psychological thrillers”
            </span>

            <span>
              “Emotional philosophical films”
            </span>

            <span>
              “Movies similar to Interstellar”
            </span>

          </div>

        </section>

        {/* FEATURES */}

        <section className="about__section">

          <h2>
            Core Features
          </h2>

          <div className="about__features">

            <div className="about__feature-card">

              <h3>
                AI Semantic Search
              </h3>

              <p>
                Search movies naturally using
                mood, story themes, emotions,
                and cinematic tone.
              </p>

            </div>

            <div className="about__feature-card">

              <h3>
                Vector Similarity Search
              </h3>

              <p>
                Movie embeddings are stored in
                Astra DB to retrieve
                semantically similar movies.
              </p>

            </div>

            <div className="about__feature-card">

              <h3>
                AI Recommendation Reasoning
              </h3>

              <p>
                Gemini AI generates contextual
                explanations describing why
                recommended movies match the
                query.
              </p>

            </div>

            <div className="about__feature-card">

              <h3>
                Cinematic UI Experience
              </h3>

              <p>
                A dark-themed cinematic
                interface designed to feel
                immersive and modern.
              </p>

            </div>

          </div>

        </section>

        {/* TECH STACK */}

        <section className="about__section">

          <h2>
            Technology Stack
          </h2>

          <div className="about__tech-grid">

            <div className="about__tech-card">
              React
            </div>

            <div className="about__tech-card">
              Node.js
            </div>

            <div className="about__tech-card">
              Express
            </div>

            <div className="about__tech-card">
              Astra DB
            </div>

            <div className="about__tech-card">
              Gemini AI
            </div>

            <div className="about__tech-card">
              TMDB API
            </div>

            <div className="about__tech-card">
              Embeddings
            </div>

            <div className="about__tech-card">
              Semantic Search
            </div>

            <div className="about__tech-card">
              Vector Databases
            </div>

            <div className="about__tech-card">
              RAG Architecture
            </div>

          </div>

        </section>

        {/* AI CONCEPTS */}

        <section className="about__section">

          <h2>
            AI Concepts Used
          </h2>

          <div className="about__concepts">

            <div className="about__concept-card">

              <h3>
                Retrieval-Augmented Generation
              </h3>

              <p>
                Retrieved movie context is
                combined with Gemini AI to
                generate intelligent
                explanations.
              </p>

            </div>

            <div className="about__concept-card">

              <h3>
                Embeddings
              </h3>

              <p>
                Movies and user queries are
                converted into vector
                representations to capture
                semantic meaning.
              </p>

            </div>

            <div className="about__concept-card">

              <h3>
                Semantic Similarity
              </h3>

              <p>
                Vector similarity search helps
                retrieve movies based on
                meaning instead of exact
                keywords.
              </p>

            </div>

          </div>

        </section>

        {/* FOOTER MESSAGE */}

        <section className="about__footer-message">

          <h2>
            Reimagining Movie Discovery With AI
          </h2>

          <p>
            FindYourMovie demonstrates how AI,
            vector databases, semantic
            retrieval, and modern frontend
            experiences can transform content
            discovery into a conversational
            and intelligent experience.
          </p>

        </section>

      </main>

    </div>
  )
}