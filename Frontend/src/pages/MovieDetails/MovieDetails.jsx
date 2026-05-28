import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'

import './MovieDetails.css'

export default function MovieDetails() {

  const location  = useLocation()
  const navigate  = useNavigate()
  const { id }    = useParams()

  // Movie can come from:
  //   1. location.state  → navigated from MovieCard (full object)
  //   2. location.state  → navigated from ChatBot OPEN_MOVIE (full object if found in currentMovies)
  //   3. null            → direct URL visit

  const [movie, setMovie] = useState(location.state || null)

  // If we arrive without state (direct URL or chatbot couldn't pass state),
  // show a friendly fallback instead of a blank page.

  useEffect(() => {
    if (!movie && id) {
      // State not available — user visited URL directly
      // We don't have a GET /movie/:id endpoint, so show a prompt to go back
      setMovie(null)
    }
  }, [id, movie])

  // NOT FOUND STATE

  if (!movie) {
    return (
      <div className="movie-details__notfound">
        <h1>Movie not found</h1>
        <p>Navigate back and click a movie to see its details.</p>
        <button onClick={() => navigate('/')}>
          ← Go to Home
        </button>
      </div>
    )
  }

  return (

    <div className="movie-details">

      {/* BACKDROP */}

      <div
        className="movie-details__backdrop"
        style={{
          backgroundImage: `url(${movie.backdrop})`,
        }}
      >
        <div className="movie-details__backdrop-overlay" />
      </div>

      {/* MAIN CONTENT */}

      <div className="movie-details__content">

        {/* LEFT SIDE */}

        <div className="movie-details__left">
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-details__poster"
          />
        </div>

        {/* RIGHT SIDE */}

        <div className="movie-details__right">

          {/* TITLE */}

          <h1 className="movie-details__title">
            {movie.title}
          </h1>

          {/* META */}

          <div className="movie-details__meta">
            <span>⭐ {movie.imdbRating}</span>
            <span>{movie.releaseDate}</span>
            <span>{movie.language?.toUpperCase()}</span>
          </div>

          {/* GENRES */}

          <div className="movie-details__genres">
            {movie.genres?.split(',').map((genre, index) => (
              <span key={index} className="movie-details__genre">
                {genre.trim()}
              </span>
            ))}
          </div>

          {/* OVERVIEW */}

          <div className="movie-details__section">
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>

          {/* STORYLINE */}

          <div className="movie-details__section">
            <h2>Storyline</h2>
            <p>{movie.overview}</p>
          </div>

          {/* ADDITIONAL INFO */}

          <div className="movie-details__extra">

            <div className="movie-details__extra-card">
              <h3>Popularity</h3>
              <p>{movie.popularity}</p>
            </div>

            <div className="movie-details__extra-card">
              <h3>Votes</h3>
              <p>{movie.voteCount}</p>
            </div>

            <div className="movie-details__extra-card">
              <h3>Language</h3>
              <p>{movie.language?.toUpperCase()}</p>
            </div>

          </div>

          {/* BACK BUTTON */}

          <button
            className="movie-details__back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back To Search
          </button>

        </div>

      </div>

    </div>
  )
}
