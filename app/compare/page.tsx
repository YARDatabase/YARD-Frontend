'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface ReforgeStats {
  health?: number
  defense?: number
  strength?: number
  intelligence?: number
  crit_chance?: number
  crit_damage?: number
  attack_speed?: number
  bonus_attack_speed?: number
  speed?: number
  mining_speed?: number
  mining_fortune?: number
  farming_fortune?: number
  damage?: number
  sea_creature_chance?: number
  magic_find?: number
  pet_luck?: number
  true_defense?: number
  ferocity?: number
  ability_damage?: number
}

// api response reforge from the new /api/reforges endpoint
interface APIReforge {
  reforge_name: string
  item_types: string
  required_rarities: string[]
  reforge_stats: Record<string, ReforgeStats>
  reforge_ability?: string | Record<string, string>
  reforge_costs?: Record<string, number>
  source: string
  stone_id?: string
  stone_name?: string
  stone_tier?: string
  stone_price?: number
}

interface ReforgesResponse {
  success: boolean
  count: number
  lastUpdated: string
  reforges: APIReforge[]
}

// processed reforge for display
interface Reforge {
  name: string
  itemTypes: string[]
  rarities: string[]
  stats: Record<string, ReforgeStats>
  costs: Record<string, number>
  ability?: string | Record<string, string>
  source: string
  stoneId?: string
  stoneName?: string
  stoneTier?: string
  stonePrice?: number
}

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'SPECIAL']
const STAT_TYPES = ['strength', 'crit_damage', 'crit_chance', 'attack_speed', 'health', 'defense', 'intelligence', 'speed', 'mining_speed', 'mining_fortune', 'farming_fortune', 'magic_find', 'pet_luck', 'ferocity', 'ability_damage']

// removes minecraft color codes from text strings
function stripMinecraftColors(text: string): string {
  return text.replace(/§[0-9a-fk-or]/gi, '')
}

// splits comma separated item types and converts them to uppercase
function parseItemTypes(itemTypes: string): string[] {
  if (!itemTypes) return []
  return itemTypes.split(',').map(t => t.trim().toUpperCase())
}

function ComparePageContent() {
  const { theme, toggleTheme } = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReforges, setSelectedReforges] = useState<string[]>([])
  const [availableReforges, setAvailableReforges] = useState<Reforge[]>([])
  const [selectedRarity, setSelectedRarity] = useState<string>('EPIC')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    fetchReforges()
  }, [])

  useEffect(() => {
    const reforgesParam = searchParams.get('reforges')
    if (reforgesParam) {
      const names = reforgesParam.split(',').map(n => decodeURIComponent(n))
      setSelectedReforges(names.slice(0, 4))
    }
  }, [searchParams])

  // fetches all reforges from the api and transforms them for display
  const fetchReforges = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/reforges`)
      if (!response.ok) throw new Error('Failed to fetch reforges')
      const data: ReforgesResponse = await response.json()
      
      // transform api response to display format
      const transformedReforges: Reforge[] = (data.reforges || []).map(apiReforge => ({
        name: apiReforge.reforge_name,
        itemTypes: parseItemTypes(apiReforge.item_types || ''),
        rarities: apiReforge.required_rarities || [],
        stats: apiReforge.reforge_stats || {},
        costs: apiReforge.reforge_costs || {},
        ability: apiReforge.reforge_ability,
        source: apiReforge.source,
        stoneId: apiReforge.stone_id,
        stoneName: apiReforge.stone_name,
        stoneTier: apiReforge.stone_tier,
        stonePrice: apiReforge.stone_price
      }))
      
      setAvailableReforges(transformedReforges.sort((a, b) => a.name.localeCompare(b.name)))
      setLastUpdated(data.lastUpdated || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reforges')
    } finally {
      setLoading(false)
    }
  }

  const comparedReforges = useMemo(() => {
    return selectedReforges
      .map(name => availableReforges.find(r => r.name === name))
      .filter((r): r is Reforge => r !== undefined)
  }, [selectedReforges, availableReforges])

  const allStats = useMemo(() => {
    const statsSet = new Set<string>()
    comparedReforges.forEach(reforge => {
      const rarityStats = reforge.stats[selectedRarity]
      if (rarityStats) {
        Object.keys(rarityStats).forEach(stat => statsSet.add(stat))
      }
    })
    return Array.from(statsSet).sort()
  }, [comparedReforges, selectedRarity])

  const getStatValue = (reforge: Reforge, stat: string): number => {
    const rarityStats = reforge.stats[selectedRarity]
    if (!rarityStats) return 0
    return (rarityStats as any)[stat] || 0
  }

  const getBestReforge = (stat: string): string | null => {
    if (comparedReforges.length === 0) return null
    let best = comparedReforges[0]
    let bestValue = getStatValue(best, stat)
    
    comparedReforges.forEach(reforge => {
      const value = getStatValue(reforge, stat)
      if (value > bestValue) {
        best = reforge
        bestValue = value
      }
    })
    
    return bestValue > 0 ? best.name : null
  }

  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedReforges.length > 0) {
      params.set('reforges', selectedReforges.map(r => encodeURIComponent(r)).join(','))
    }
    if (selectedRarity !== 'EPIC') {
      params.set('rarity', selectedRarity)
    }

    const newUrl = params.toString() ? `/compare?${params.toString()}` : '/compare'
    router.replace(newUrl, { scroll: false })
  }, [selectedReforges, selectedRarity, router])

  const addReforge = (name: string) => {
    if (selectedReforges.length >= 4) return
    if (!selectedReforges.includes(name)) {
      setSelectedReforges([...selectedReforges, name])
    }
  }

  const removeReforge = (name: string) => {
    setSelectedReforges(selectedReforges.filter(n => n !== name))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-white/60">Loading reforges...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchReforges}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200 flex flex-col">
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
                {lastUpdated && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-700 dark:text-white/95">
                      Updated {new Date(lastUpdated).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/38">
                      {new Date(lastUpdated).toLocaleTimeString(undefined, {
                        timeZoneName: 'short',
                      })}
                    </p>
                  </div>
                )}
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                Add Reforge to Compare ({selectedReforges.length}/4)
              </label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    addReforge(e.target.value)
                    e.target.value = ''
                  }
                }}
                disabled={selectedReforges.length >= 4}
                className="w-full md:w-64 px-3 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-gray-200 dark:text-white/87"
              >
                <option value="">Select a reforge...</option>
                {availableReforges
                  .filter(r => !selectedReforges.includes(r.name))
                  .map(reforge => (
                    <option key={reforge.name} value={reforge.name}>
                      {reforge.name}
                    </option>
                  ))}
              </select>
            </div>

            {comparedReforges.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Compare at Rarity
                </label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-gray-200 dark:text-white/87"
                >
                  {RARITIES.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 flex-1">
        {comparedReforges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-white/60 mb-4">
              Select reforges to compare (up to 4)
            </p>
            <Link
              href="/browser"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Browse Reforges
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparedReforges.length}, 1fr)` }}>
              {comparedReforges.map((reforge) => (
                <div
                  key={reforge.name}
                  className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-200 dark:text-white/87">
                      {reforge.name}
                    </h3>
                    <button
                      onClick={() => removeReforge(reforge.name)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                  {reforge.ability && (
                    <p className="text-xs text-gray-600 dark:text-white/60 mb-2">
                      {typeof reforge.ability === 'string'
                        ? stripMinecraftColors(reforge.ability)
                        : reforge.ability[selectedRarity] && stripMinecraftColors(reforge.ability[selectedRarity])}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {reforge.itemTypes.map(type => (
                      <span
                        key={type}
                        className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-white/60">
                    Cost: {reforge.costs[selectedRarity]?.toLocaleString() || 'N/A'} coins
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">
                        Stat
                      </th>
                      {comparedReforges.map(reforge => (
                        <th
                          key={reforge.name}
                          className="text-center p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase"
                        >
                          {reforge.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allStats.map(stat => {
                      const bestReforge = getBestReforge(stat)
                      return (
                        <tr
                          key={stat}
                          className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <td className="p-3 text-xs font-medium text-gray-700 dark:text-white/60 capitalize">
                            {stat.replace(/_/g, ' ')}
                          </td>
                          {comparedReforges.map(reforge => {
                            const value = getStatValue(reforge, stat)
                            const isBest = bestReforge === reforge.name && value > 0
                            return (
                              <td
                                key={reforge.name}
                                className={`p-3 text-center text-sm ${
                                  isBest
                                    ? 'bg-green-100 dark:bg-green-900/30 font-bold text-green-700 dark:text-green-300'
                                    : value > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : value < 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-white/60'
                                }`}
                              >
                                {value > 0 ? '+' : ''}{value}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-200 dark:text-white/87 mb-4">
                Stats Across All Rarities
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10">
                      <th className="text-left p-2 text-xs font-semibold text-gray-700 dark:text-white/60">Rarity</th>
                      {comparedReforges.map(reforge => (
                        <th
                          key={reforge.name}
                          className="text-center p-2 text-xs font-semibold text-gray-700 dark:text-white/60"
                        >
                          {reforge.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RARITIES.filter(rarity => 
                      comparedReforges.some(r => r.rarities.includes(rarity))
                    ).map(rarity => (
                      <tr key={rarity} className="border-b border-gray-100 dark:border-white/5">
                        <td className="p-2 text-xs font-medium text-gray-700 dark:text-white/60">{rarity}</td>
                        {comparedReforges.map(reforge => {
                          const stats = reforge.stats[rarity]
                          const statCount = stats ? Object.keys(stats).length : 0
                          return (
                            <td
                              key={reforge.name}
                              className="p-2 text-center text-xs text-gray-600 dark:text-white/60"
                            >
                              {reforge.rarities.includes(rarity) ? (
                                <span className="text-green-600 dark:text-green-400">✓ {statCount} stat{statCount !== 1 ? 's' : ''}</span>
                              ) : (
                                <span className="text-gray-400 dark:text-white/38">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
                href="https://ko-fi.com/X8X41P51K5"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 dark:hover:text-white/90 transition-colors"
                aria-label="Support this project on Ko-fi"
              >
                Support this Project
              </a>
              <span className="hidden sm:inline">•</span>
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

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-white/60">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ComparePageContent />
    </Suspense>
  )
}

