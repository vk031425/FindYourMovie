import React, {
  useState,
  useEffect,
} from 'react'

import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import AIExplanation from '../../components/AIExplanation'
import MovieGrid from '../../components/MovieGrid'

import API from '../../services/api'

import './Home.css'

export default function Home() {

  // STATES

  const [searchQuery, setSearchQuery] =
    useState('')

  const [movies, setMovies] =
    useState([])

  const [explanation, setExplanation] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  // LOAD SAVED SEARCH STATE

  useEffect(() => {

    const savedMovies =
      localStorage.getItem('movies')

    const savedExplanation =
      localStorage.getItem('explanation')

    const savedQuery =
      localStorage.getItem('searchQuery')

    if (savedMovies) {

      setMovies(
        JSON.parse(savedMovies)
      )
    }

    if (savedExplanation) {

      setExplanation(
        savedExplanation
      )
    }

    if (savedQuery) {

      setSearchQuery(
        savedQuery
      )
    }

  }, [])

  // SEARCH FUNCTION

  const handleSearch = async (query) => {

    if (!query.trim()) return

    try {

      setLoading(true)

      setSearchQuery(query)

      const response = await API.post(
        '/search',
        {
          query,
        }
      )

      const fetchedMovies =
        response.data.movies || []

      const fetchedExplanation =
        response.data.explanation || ''

      // UPDATE STATE

      setMovies(fetchedMovies)

      setExplanation(
        fetchedExplanation
      )

      // SAVE TO LOCAL STORAGE

      localStorage.setItem(
        'movies',
        JSON.stringify(fetchedMovies)
      )

      localStorage.setItem(
        'explanation',
        fetchedExplanation
      )

      localStorage.setItem(
        'searchQuery',
        query
      )

    } catch (error) {

      console.log(error)

      setMovies([])

      setExplanation(
        'Unable to fetch movie recommendations right now.'
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="home">

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN CONTENT */}

      <main className="home__main">

        {/* HERO SECTION */}

        <Hero onSearch={handleSearch} />

        {/* RESULTS */}

        <div className="home__content">

          {/* LOADING */}

          {loading && (

            <div className="home__loading">

              <div className="home__loader" />

              <p>
                Searching cinematic universe...
              </p>

            </div>

          )}

          {/* AI EXPLANATION */}

          {!loading &&
            explanation && (

            <AIExplanation
              query={searchQuery}
              explanation={explanation}
            />

          )}

          {/* MOVIES */}

          {!loading &&
            movies.length > 0 && (

            <MovieGrid
              movies={movies}
            />

          )}

          {/* EMPTY STATE */}

          {!loading &&
            movies.length === 0 &&
            searchQuery && (

            <div className="home__empty">

              <h2>
                No movies found
              </h2>

              <p>
                Try searching with a different mood,
                theme, or storyline.
              </p>

            </div>

          )}

        </div>

      </main>

      {/* FOOTER */}

      <footer className="home__footer">

        <div className="home__footer-inner">

          <span className="home__footer-logo">

            <span>
              FindYour
            </span>

            <span
              style={{
                color: 'var(--red)',
              }}
            >
              Movie
            </span>

          </span>

          <p className="home__footer-text">

            AI-powered movie discovery.
            Find your next favorite film.

          </p>

        </div>

      </footer>

    </div>
  )
}