import React from 'react'

import {
  Routes,
  Route,
} from 'react-router-dom'

import Home from './pages/Home/Home'

import MovieDetails from './pages/MovieDetails/MovieDetails'

import About from './pages/About/About'

import HowItWorks from './pages/HowItWorks/HowItWorks'

import './App.css'

export default function App() {

  return (

    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* MOVIE DETAILS */}

      <Route
        path="/movie/:id"
        element={<MovieDetails />}
      />

      {/* ABOUT */}

      <Route
        path="/about"
        element={<About />}
      />

      {/* HOW IT WORKS */}

      <Route
        path="/how-it-works"
        element={<HowItWorks />}
      />

    </Routes>
  )
}