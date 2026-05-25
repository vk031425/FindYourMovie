import React, { useState } from 'react'
import './Hero.css'

const HERO_POSTERS = [
  {
    title: 'Interstellar',
    color: '#1a3a5c',
    emoji: '🚀',
    label: 'INTERSTELLAR',
  },
  {
    title: 'The Dark Knight',
    color: '#1a1a2e',
    emoji: '🦇',
    label: 'THE DARK KNIGHT',
  },
  {
    title: 'Inception',
    color: '#0d2137',
    emoji: '🌀',
    label: 'INCEPTION',
  },
  {
    title: 'Spider-Man',
    color: '#1a0a2e',
    emoji: '🕷️',
    label: 'SPIDER-MAN',
  },
  {
    title: 'Pulp Fiction',
    color: '#2e1a0a',
    emoji: '🎬',
    label: 'PULP FICTION',
  },
]

const SUGGESTIONS = [
  'Mind-bending thriller',
  'Feel good adventure',
  'Heartwarming story',
  'Time travel movies',
  'Dark fantasy',
]

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSearch = (q) => {
    const term = q || query
    if (term.trim()) onSearch(term.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <section className="hero">
      {/* Background poster strip */}
      <div className="hero__posters">
        {HERO_POSTERS.map((p, i) => (
          <div
            key={p.title}
            className="hero__poster"
            style={{
              background: `linear-gradient(135deg, ${p.color} 0%, #0a0a0a 100%)`,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <div className="hero__poster-emoji">{p.emoji}</div>
            <div className="hero__poster-label">{p.label}</div>
          </div>
        ))}
      </div>

      {/* Dark gradient overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__content">
        <div className="hero__badge">
          <SparkleIcon />
          AI-Powered Movie Discovery
        </div>

        <h1 className="hero__title">
          Find Movies By<br />
          Mood, Story, or{' '}
          <span className="hero__title-accent">Emotion</span>
        </h1>

        <p className="hero__subtitle">
          Describe what you want to watch and let AI find<br />
          the perfect movies for you.
        </p>

        {/* Search bar */}
        <div className="hero__search">
          <div className="hero__search-bar">
            <SearchIcon />
            <input
              className="hero__input"
              type="text"
              placeholder="Tell me what kind of movie you want..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="hero__search-btn" onClick={() => handleSearch()}>
            <SparkleIcon />
            Search
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="hero__suggestions">
          <span className="hero__try">Try:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              className="hero__chip"
              onClick={() => {
                setQuery(s)
                handleSearch(s)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}
