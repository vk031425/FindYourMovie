import React, { useRef } from 'react'
import MovieCard from './MovieCard'
import './MovieGrid.css'

const DEFAULT_MOVIES = [
  {
    id: 1,
    title: 'Harry Potter and the Philosopher\'s Stone',
    genres: 'Adventure, Fantasy',
    rating: '7.9',
    votes: '29.5K',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 2,
    title: 'The Witch: Part 2 – The Other One',
    genres: 'Action, Mystery, Thriller',
    rating: '7.4',
    votes: '447',
    emoji: '🔮',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #2e1a1a 100%)',
  },
  {
    id: 3,
    title: 'Wonder',
    genres: 'Family, Drama',
    rating: '8.1',
    votes: '8.2K',
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, #005f7a 0%, #003d4f 100%)',
  },
  {
    id: 4,
    title: 'Beauty and the Beast',
    genres: 'Family, Fantasy, Romance',
    rating: '7.0',
    votes: '16K',
    emoji: '🌹',
    gradient: 'linear-gradient(135deg, #3d1f00 0%, #7a4300 100%)',
  },
  {
    id: 5,
    title: 'Encanto',
    genres: 'Animation, Comedy, Family, Fantasy',
    rating: '7.6',
    votes: '10K',
    emoji: '🦋',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
  },
  {
    id: 6,
    title: 'Interstellar',
    genres: 'Adventure, Drama, Sci-Fi',
    rating: '8.7',
    votes: '2.1M',
    emoji: '🚀',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a3a5c 100%)',
  },
  {
    id: 7,
    title: 'The Dark Knight',
    genres: 'Action, Crime, Drama',
    rating: '9.0',
    votes: '2.8M',
    emoji: '🦇',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
  },
  {
    id: 8,
    title: 'Inception',
    genres: 'Action, Adventure, Sci-Fi',
    rating: '8.8',
    votes: '2.5M',
    emoji: '🌀',
    gradient: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)',
  },
  {
    id: 9,
    title: 'Spider-Man: No Way Home',
    genres: 'Action, Adventure, Fantasy',
    rating: '8.2',
    votes: '980K',
    emoji: '🕷️',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2e1a5c 100%)',
  },
  {
    id: 10,
    title: 'Pulp Fiction',
    genres: 'Crime, Drama',
    rating: '8.9',
    votes: '2.1M',
    emoji: '🎬',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 100%)',
  },
]

export default function MovieGrid({ movies = DEFAULT_MOVIES }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  return (
    <section className="movie-grid">
      <div className="movie-grid__header">
        <div className="movie-grid__title-row">
          <span className="movie-grid__icon">🎯</span>
          <div>
            <h2 className="movie-grid__title">Top 10 Movies For You</h2>
            <p className="movie-grid__subtitle">Curated just for you</p>
          </div>
        </div>

        <div className="movie-grid__nav">
          <button className="movie-grid__nav-btn" onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft />
          </button>
          <button className="movie-grid__nav-btn" onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div className="movie-grid__scroll-wrapper">
        <div className="movie-grid__row" ref={scrollRef}>
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} rank={i + 1} />
          ))}
        </div>

        {/* Fade edge */}
        <div className="movie-grid__fade" />
      </div>
    </section>
  )
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
