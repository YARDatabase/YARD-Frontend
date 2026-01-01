'use client'

import { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import Link from 'next/link'

// renders the home page with welcome message features and navigation links
export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
      <div className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#1E1E1E] sticky top-0 z-10 transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/favicon.png" alt="YARD" className="h-10 w-10 flex-shrink-0" />
                <div>
                  <Link href="/">
                    <h1 className="text-2xl font-semibold text-gray-200 dark:text-slate-100 hover:opacity-80 transition-opacity cursor-pointer">
                      YARD
                    </h1>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Yet Another Reforge Database
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/stones"
                  className="px-4 py-2 text-sm text-gray-700 dark:text-white/95 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded transition-colors"
                >
                  Stones
                </Link>
                <Link
                  href="/browser"
                  className="px-4 py-2 text-sm text-gray-700 dark:text-white/95 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded transition-colors"
                >
                  Browser
                </Link>
                <Link
                  href="/compare"
                  className="px-4 py-2 text-sm text-gray-700 dark:text-white/95 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded transition-colors"
                >
                  Compare
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-700 dark:text-white/95 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-200 dark:text-slate-100 mb-4">
            Welcome to YARD
          </h2>
          <p className="text-xl text-gray-600 dark:text-white/60">
            Yet Another Reforge Database
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-200 dark:text-white/87 mb-3">
              What is YARD?
            </h3>
            <p className="text-gray-600 dark:text-white/60 leading-relaxed">
              YARD is database for Hypixel Skyblock reforge stones and reforges. 
              We provide detailed information about reforge stones, their effects, stats, costs, and 
              current market prices from both the Auction House and Bazaar.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-200 dark:text-white/87 mb-3">
              Features
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-white/60">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Reforge Stones Browser:</strong> Browse all reforge stones with detailed information including stats, effects, and prices
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Reforge Browser:</strong> Search and filter reforges by item type, stat type, and rarity with advanced AND/OR logic
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Comparison Tool:</strong> Compare up to 4 reforges side by side with visual indicators for best stats
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Prices:</strong> Prices from Auction House and Bazaar with top buy/sell orders
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Stat Scaling Charts:</strong> Visualize how stats scale across different rarities
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong className="text-gray-200 dark:text-white/87">Cost Breakdowns:</strong> See application costs, stone prices, and total estimated costs
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/stones"
              className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-200 dark:text-white/87 mb-2">
                Reforge Stones
              </h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">
                Browse all reforge stones with images, stats, effects, and live market prices
              </p>
            </Link>

            <Link
              href="/browser"
              className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-200 dark:text-white/87 mb-2">
                Reforge Browser
              </h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">
                Search and filter reforges with advanced filters, view as cards or table
              </p>
            </Link>

            <Link
              href="/compare"
              className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-200 dark:text-white/87 mb-2">
                Compare Reforges
              </h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">
                Compare up to 4 reforges side-by-side with stat comparisons across rarities
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-200 dark:text-white/87 mb-3">
            Data Sources
          </h3>
          <p className="text-gray-600 dark:text-white/60 mb-4">
            YARD uses data from multiple sources to provide comprehensive information:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-white/60">
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span><strong>Hypixel API:</strong> Reforge stone data and item information</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span><strong>SkyCofl:</strong> Live auction house and bazaar prices</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span><strong>NotEnoughUpdates:</strong> Reforge effects, stats, and lore information</span>
            </li>
          </ul>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#1E1E1E] mt-12 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-white/60">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p>YARD - Yet Another Reforge Database</p>
              <span className="hidden sm:inline">•</span>
              <p>
                Protected by{' '}
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 dark:hover:text-white/90 transition-colors underline"
                >
                  GPL-3.0 License
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/YARDatabase"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 dark:hover:text-white/90 transition-colors"
              >
                GitHub
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://sky.coflnet.com/data"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 dark:hover:text-white/90 transition-colors"
              >
                Prices provided by <span className="font-medium">SkyCofl</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
