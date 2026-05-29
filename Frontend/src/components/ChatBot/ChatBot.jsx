import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import "./ChatBot.css";

// ============================================================
// CHATBOT COMPONENT
// Chat history persists across page navigation via sessionStorage
// (clears automatically when browser tab/window is closed)
// ============================================================

const STORAGE_KEY = "chatbot_messages";
const STORAGE_LAST_MOVIE = "chatbot_lastMovieId";

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  text: "Hi! I'm your AI Movie Assistant 🎬 Ask me to find movies by mood, genre, or story — or ask about any movie currently shown on screen.",
  time: formatTime(new Date()),
  movies: null,
};

// Load messages from sessionStorage, fall back to initial message
function loadMessages() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return [INITIAL_MESSAGE];
}

// Load lastMovieId from sessionStorage
function loadLastMovieId() {
  try {
    const stored = sessionStorage.getItem(STORAGE_LAST_MOVIE);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export default function ChatBot({ currentMovies = [], onMoviesUpdate }) {
  const navigate = useNavigate();

  // ── STATE ──────────────────────────────────────────

  const [isOpen, setIsOpen] = useState(false);

  // Initialise from sessionStorage so history survives page navigation
  const [messages, setMessages] = useState(loadMessages);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [lastMovieId, setLastMovieId] = useState(loadLastMovieId);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── PERSIST TO SESSION STORAGE ─────────────────────
  // Runs every time messages change — keeps sessionStorage in sync

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_LAST_MOVIE, JSON.stringify(lastMovieId));
    } catch {
      // Ignore
    }
  }, [lastMovieId]);

  // ── EFFECTS ────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // ── SEND MESSAGE ───────────────────────────────────

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: formatTime(new Date()),
      movies: null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await API.post("/chat", {
        message: trimmed,
        conversation: {
          currentMovies,
          lastMovieId,
        },
      });

      await handleAction(response.data);
    } catch (error) {
      console.error("Chat API error:", error);

      const errMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        time: formatTime(new Date()),
        movies: null,
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── ACTION HANDLER ─────────────────────────────────

  const handleAction = async (data) => {
    const actionType = data?.action?.type;
    const movieId = data?.action?.movieId;

    console.log("ChatBot Action:", actionType, "Movie ID:", movieId);

    // ── SHOW_MOVIES ──────────────────────────────────

    if (actionType === "SHOW_MOVIES") {
      const newMovies = data.movies || [];

      if (onMoviesUpdate && newMovies.length > 0) {
        onMoviesUpdate(newMovies);
      }

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.message || "Here are some movies you might enjoy!",
        time: formatTime(new Date()),
        movies: newMovies.length > 0 ? newMovies : null,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (newMovies[0]?.tmdbId) {
        setLastMovieId(newMovies[0].tmdbId);
      }

      return;
    }

    // ── OPEN_MOVIE ───────────────────────────────────

    if (actionType === "OPEN_MOVIE" && movieId) {
      const movieObj = currentMovies.find((m) => m.tmdbId === movieId) || null;

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.message || `Opening movie 🎬`,
        time: formatTime(new Date()),
        movies: null,
      };

      setMessages((prev) => [...prev, botMsg]);
      setLastMovieId(movieId);

      setTimeout(() => {
        navigate(`/movie/${movieId}`, { state: movieObj });
      }, 600);

      return;
    }

    // ── EXPLAIN_MOVIE ────────────────────────────────

    if (actionType === "EXPLAIN_MOVIE") {
      if (movieId) setLastMovieId(movieId);

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.message || "Here's what I know about that movie.",
        time: formatTime(new Date()),
        movies: null,
      };

      setMessages((prev) => [...prev, botMsg]);
      return;
    }

    // ── NONE / FALLBACK ──────────────────────────────

    const botMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text:
        data.message ||
        "I'm not sure I understood that. Try asking me to recommend movies by mood or genre!",
      time: formatTime(new Date()),
      movies: null,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  // ── KEYBOARD ───────────────────────────────────────

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── CLEAR CHAT ─────────────────────────────────────
  // Also wipes sessionStorage so it stays in sync

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setLastMovieId(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_LAST_MOVIE);
    } catch {
      // ignore
    }
  };

  // ── RENDER ─────────────────────────────────────────

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <button
        className={`chatbot__fab ${isOpen ? "chatbot__fab--active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Movie Assistant"
      >
        {isOpen ? <CloseIcon /> : <RobotIcon />}
        {!isOpen && <span className="chatbot__fab-pulse" />}
      </button>

      {/* CHAT PANEL */}
      <div className={`chatbot__panel ${isOpen ? "chatbot__panel--open" : ""}`}>
        {/* HEADER */}
        <div className="chatbot__header">
          <div className="chatbot__header-left">
            <div className="chatbot__avatar">
              <RobotIcon size={22} />
            </div>
            <div>
              <h3 className="chatbot__header-title">AI Movie Assistant</h3>
              <span className="chatbot__header-status">
                <span className="chatbot__status-dot" />
                Online
              </span>
            </div>
          </div>

          <div className="chatbot__header-actions">
            <button
              className="chatbot__header-btn"
              onClick={clearChat}
              title="Clear chat"
            >
              <TrashIcon />
            </button>
            <button
              className="chatbot__header-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="chatbot__messages">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              onMovieClick={(movie) => {
                navigate(`/movie/${movie.tmdbId}`, { state: movie });
              }}
            />
          ))}

          {isTyping && (
            <div className="chatbot__message chatbot__message--assistant">
              <div className="chatbot__bubble chatbot__bubble--typing">
                <span className="chatbot__dot" />
                <span className="chatbot__dot" />
                <span className="chatbot__dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="chatbot__input-area">
          <input
            ref={inputRef}
            className="chatbot__input"
            type="text"
            placeholder="Ask me about movies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            className={`chatbot__send ${input.trim() ? "chatbot__send--active" : ""}`}
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
}

// ── CHAT MESSAGE ──────────────────────────────────────────────

function ChatMessage({ msg, onMovieClick }) {
  return (
    <div className={`chatbot__message chatbot__message--${msg.role}`}>
      <div className="chatbot__bubble">
        <p className="chatbot__bubble-text">{msg.text}</p>

        {msg.movies && msg.movies.length > 0 && (
          <div className="chatbot__movies">
            {msg.movies.map((movie, i) => (
              <button
                key={movie.tmdbId || movie._id || i}
                className="chatbot__movie-chip"
                onClick={() => onMovieClick(movie)}
                title={`Open ${movie.title}`}
              >
                <span className="chatbot__movie-poster">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <span
                    className="chatbot__movie-emoji"
                    style={{ display: movie.poster ? "none" : "flex" }}
                  >
                    🎬
                  </span>
                </span>

                <span className="chatbot__movie-info">
                  <span className="chatbot__movie-name">{movie.title}</span>
                  {movie.genres && (
                    <span className="chatbot__movie-genre">
                      {movie.genres.split(",")[0].trim()}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="chatbot__time">
        {msg.time}
        {msg.role === "user" && <span className="chatbot__ticks">✓✓</span>}
      </span>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── ICONS ─────────────────────────────────────────────────────

function RobotIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="3" width="10" height="7" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="3" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="1" r="0.8" fill="currentColor" />
      <circle cx="9" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="6.5" r="1.2" fill="currentColor" />
      <rect x="7" y="13" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="9.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" />
      <circle cx="14.5" cy="15.5" r="1" fill="currentColor" />
      <rect x="1" y="10" width="2" height="6" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="21" y="10" width="2" height="6" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
