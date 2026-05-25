import React from 'react'
import './AIExplanation.css'

export default function AIExplanation({ query, explanation }) {
  return (
    <div className="ai-explanation">
      <div className="ai-explanation__content">
        <div className="ai-explanation__header">
          <SparkleIcon />
          <h3 className="ai-explanation__title">AI Explanation</h3>
        </div>

        <p className="ai-explanation__text">
          {explanation || `These movies were recommended based on your query "${query}".`}
        </p>
      </div>

      <div className="ai-explanation__robot">
        <div className="ai-explanation__sparks">
          <span className="spark spark--1">✦</span>
          <span className="spark spark--2">✦</span>
          <span className="spark spark--3">✦</span>
        </div>

        <RobotSVG />
      </div>
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ai-explanation__sparkle-icon">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}

function RobotSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="ai-explanation__robot-svg">
      <rect x="20" y="38" width="50" height="38" rx="8" fill="#2a2a2a" stroke="#444" strokeWidth="1.5" />
      <rect x="25" y="14" width="40" height="30" rx="6" fill="#333" stroke="#555" strokeWidth="1.5" />
      <line x1="45" y1="14" x2="45" y2="6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <circle cx="45" cy="5" r="3" fill="#e5001a" />
      <ellipse cx="35" cy="29" rx="6" ry="5" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
      <ellipse cx="55" cy="29" rx="6" ry="5" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
      <circle cx="35" cy="29" r="3" fill="#4fc3f7" />
      <circle cx="55" cy="29" r="3" fill="#4fc3f7" />
    </svg>
  )
}
