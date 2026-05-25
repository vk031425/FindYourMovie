import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import './MovieCard.css'

export default function MovieCard({
  movie,
  rank,
}) {

  const [imgError, setImgError] = useState(false)

  const navigate = useNavigate()

  // OPEN MOVIE DETAILS PAGE

  const handleMovieClick = () => {

    navigate(
      `/movie/${movie.tmdbId}`,
      {
        state: movie,
      }
    )
  }

  return (

    <div
      className="movie-card"
      onClick={handleMovieClick}
    >

      {/* RANK */}

      <div className="movie-card__rank">
        {rank}
      </div>

      {/* POSTER */}

      <div className="movie-card__poster">

        {!imgError && movie.poster ? (

          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-card__img"
            onError={() => setImgError(true)}
          />

        ) : (

          <div
            className="movie-card__placeholder"
            style={{
              background:
                movie.gradient ||
                'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
            }}
          >

            <span className="movie-card__emoji">
              🎬
            </span>

          </div>
        )}

        {/* OVERLAY */}

        <div className="movie-card__overlay">

          <button className="movie-card__play">

            <PlayIcon />

          </button>

        </div>

      </div>

      {/* INFO */}

      <div className="movie-card__info">

        <h3 className="movie-card__title">
          {movie.title}
        </h3>

        <p className="movie-card__genres">
          {movie.genres}
        </p>

        <div className="movie-card__meta">

          <span className="movie-card__rating">

            <StarIcon />

            {movie.imdbRating || movie.rating}

          </span>

          {movie.voteCount && (

            <span className="movie-card__votes">
              ({movie.voteCount})
            </span>

          )}

        </div>

      </div>

    </div>
  )
}

// PLAY ICON

function PlayIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="white"
    >

      <path d="M8 5v14l11-7z" />

    </svg>
  )
}

// STAR ICON

function StarIcon() {

  return (

    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="var(--star)"
    >

      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />

    </svg>
  )
}