'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
}

// provides an autocomplete search input with filtered suggestions and keyboard navigation
export default function SearchAutocomplete({
  value,
  onChange,
  suggestions,
  placeholder = 'Search...'
}: SearchAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 10)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelect(filteredSuggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
          setHighlightedIndex(-1)
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-gray-200 dark:text-white/87 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showSuggestions && value && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors ${
                index === highlightedIndex ? 'bg-gray-100 dark:bg-[#2C2C2C]' : ''
              }`}
            >
              <span className="text-gray-200 dark:text-white/87">
                {suggestion.split(new RegExp(`(${value})`, 'gi')).map((part, i) => 
                  part.toLowerCase() === value.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50">{part}</mark>
                  ) : (
                    part
                  )
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

