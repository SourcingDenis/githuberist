import React from 'react'

export function SearchResults({ results = [] }) {
  return (
    <div>
      {results.map((result, index) => (
        <div key={index}>{/* Render your search results */}</div>
      ))}
    </div>
  )
} 