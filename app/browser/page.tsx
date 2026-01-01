'use client'

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SearchAutocomplete from '../components/SearchAutocomplete'
import ReforgeCard from '../components/ReforgeCard'
import { TableSkeleton, CardSkeleton } from '../components/LoadingSkeleton'
import ToggleableList from '../components/ToggleableList'

const StatChart = dynamic(() => import('../components/StatChart'), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />,
  ssr: false
})

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
  [key: string]: number | undefined
}

interface ReforgeEffect {
  reforge_name?: string
  item_types?: string
  required_rarities?: string[]
  reforge_stats?: Record<string, ReforgeStats>
  reforge_ability?: string | Record<string, string>
  reforge_costs?: Record<string, number>
  description?: string[]
  obtaining?: string
  mining_level_req?: string
}

interface ReforgeStone {
  id: string
  name: string
  tier: string
  npc_sell_price?: number | string
  auction_price?: number
  bazaar_buy_price?: number
  bazaar_sell_price?: number
  reforge_effect?: ReforgeEffect
}

interface ReforgeStonesResponse {
  success: boolean
  count: number
  lastUpdated: string
  reforgeStones: ReforgeStone[]
}

interface Reforge {
  name: string
  itemTypes: string[]
  rarities: string[]
  stats: Record<string, ReforgeStats>
  costs: Record<string, number>
  ability?: string | Record<string, string>
  stones: ReforgeStone[]
}

const ITEM_TYPES = ['SWORD', 'BOW', 'ARMOR', 'TOOL', 'ACCESSORY', 'FISHING_ROD', 'EQUIPMENT']
const STAT_TYPES = ['strength', 'crit_damage', 'crit_chance', 'attack_speed', 'health', 'defense', 'intelligence', 'speed', 'mining_speed', 'mining_fortune', 'farming_fortune', 'magic_find', 'pet_luck', 'ferocity', 'ability_damage']
const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'SPECIAL']

// removes minecraft color codes from text strings
function stripMinecraftColors(text: string): string {
  return text.replace(/§[0-9a-fk-or]/gi, '')
}

// splits comma separated item types and converts them to uppercase
function parseItemTypes(itemTypes: string): string[] {
  if (!itemTypes) return []
  return itemTypes.split(',').map(t => t.trim().toUpperCase())
}

function BrowserPageContent() {
  const { theme, toggleTheme } = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [reforgeStones, setReforgeStones] = useState<ReforgeStone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([])
  const [selectedStatTypes, setSelectedStatTypes] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [filterLogic, setFilterLogic] = useState<'AND' | 'OR'>('AND')
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'stat'>('name')
  const [sortStat, setSortStat] = useState<string>('strength')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)
  const [expandedReforge, setExpandedReforge] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('reforge-favorites')
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)))
    }
  }, [])

  useEffect(() => {
    const itemTypes = searchParams.get('itemtype')?.split(',') || []
    const statTypes = searchParams.get('stattype')?.split(',') || []
    const rarities = searchParams.get('rarity')?.split(',') || []
    const logic = searchParams.get('logic') as 'AND' | 'OR' || 'AND'
    const search = searchParams.get('search') || ''
    const view = searchParams.get('view') as 'table' | 'cards' || 'cards'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const sort = searchParams.get('sort') as 'name' | 'cost' | 'stat' || 'name'
    const sortStatParam = searchParams.get('sortstat') || 'strength'

    if (itemTypes.length > 0) setSelectedItemTypes(itemTypes)
    if (statTypes.length > 0) setSelectedStatTypes(statTypes)
    if (rarities.length > 0) setSelectedRarities(rarities)
    if (logic) setFilterLogic(logic)
    if (search) setSearchQuery(search)
    if (view) setViewMode(view)
    if (page > 0) setCurrentPage(page)
    if (sort && ['name', 'cost', 'stat'].includes(sort)) setSortBy(sort)
    if (sortStatParam) setSortStat(sortStatParam)
  }, [searchParams])

  useEffect(() => {
    fetchReforgeStones()
  }, [])

  const fetchReforgeStones = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/reforge-stones`)
      if (!response.ok) throw new Error('Failed to fetch reforge stones')
      const data: ReforgeStonesResponse = await response.json()
      setReforgeStones(data.reforgeStones || [])
      setLastUpdated(data.lastUpdated || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reforge stones')
    } finally {
      setLoading(false)
    }
  }

  const reforges = useMemo(() => {
    const reforgeMap = new Map<string, Reforge>()

    reforgeStones.forEach(stone => {
      if (!stone.reforge_effect?.reforge_name) return

      const name = stone.reforge_effect.reforge_name
      const itemTypes = parseItemTypes(stone.reforge_effect.item_types || '')
      const rarities = stone.reforge_effect.required_rarities || []
      const stats = stone.reforge_effect.reforge_stats || {}
      const costs = stone.reforge_effect.reforge_costs || {}

      if (!reforgeMap.has(name)) {
        reforgeMap.set(name, {
          name,
          itemTypes: [...new Set(itemTypes)],
          rarities: [...new Set(rarities)],
          stats,
          costs,
          ability: stone.reforge_effect.reforge_ability,
          stones: []
        })
      }

      const reforge = reforgeMap.get(name)!
      stone.reforge_effect.item_types?.split(',').forEach(t => {
        const type = t.trim().toUpperCase()
        if (!reforge.itemTypes.includes(type)) {
          reforge.itemTypes.push(type)
        }
      })
      reforge.stones.push(stone)
    })

    return Array.from(reforgeMap.values())
  }, [reforgeStones])

  const searchSuggestions = useMemo(() => {
    return reforges.map(r => r.name)
  }, [reforges])

  const filteredReforges = useMemo(() => {
    let filtered = reforges

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(reforge => {
        const matchesName = reforge.name.toLowerCase().includes(query)
        const matchesAbility = reforge.ability && 
          (typeof reforge.ability === 'string' 
            ? stripMinecraftColors(reforge.ability).toLowerCase().includes(query)
            : Object.values(reforge.ability).some(a => stripMinecraftColors(a).toLowerCase().includes(query)))
        return matchesName || matchesAbility
      })
    }

    if (selectedItemTypes.length > 0 || selectedStatTypes.length > 0 || selectedRarities.length > 0) {
      filtered = filtered.filter(reforge => {
        if (filterLogic === 'AND') {
          const itemTypeMatch = selectedItemTypes.length === 0 || selectedItemTypes.some(type => 
            reforge.itemTypes.some(it => it.includes(type) || type.includes(it))
          )
          const statMatch = selectedStatTypes.length === 0 || selectedStatTypes.some(stat => {
            return Object.values(reforge.stats).some(rarityStats => 
              rarityStats && (rarityStats as any)[stat] !== undefined
            )
          })
          const rarityMatch = selectedRarities.length === 0 || selectedRarities.some(rarity => 
            reforge.rarities.includes(rarity)
          )
          return itemTypeMatch && statMatch && rarityMatch
        } else {
          const itemTypeMatch = selectedItemTypes.length > 0 && selectedItemTypes.some(type => 
            reforge.itemTypes.some(it => it.includes(type) || type.includes(it))
          )
          const statMatch = selectedStatTypes.length > 0 && selectedStatTypes.some(stat => {
            return Object.values(reforge.stats).some(rarityStats => 
              rarityStats && (rarityStats as any)[stat] !== undefined
            )
          })
          const rarityMatch = selectedRarities.length > 0 && selectedRarities.some(rarity => 
            reforge.rarities.includes(rarity)
          )
          return itemTypeMatch || statMatch || rarityMatch
        }
      })
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'cost') {
        const aCost = Object.keys(a.costs).length > 0 ? Math.min(...Object.values(a.costs)) : Infinity
        const bCost = Object.keys(b.costs).length > 0 ? Math.min(...Object.values(b.costs)) : Infinity
        return aCost - bCost
      } else if (sortBy === 'stat') {
        const aStat = Object.values(a.stats).find(s => s && (s as any)[sortStat])?.[sortStat as keyof ReforgeStats] || 0
        const bStat = Object.values(b.stats).find(s => s && (s as any)[sortStat])?.[sortStat as keyof ReforgeStats] || 0
        return (bStat as number) - (aStat as number)
      }
      return 0
    })

    return filtered
  }, [reforges, searchQuery, selectedItemTypes, selectedStatTypes, selectedRarities, filterLogic, sortBy, sortStat])

  const paginatedReforges = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredReforges.slice(start, start + itemsPerPage)
  }, [filteredReforges, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredReforges.length / itemsPerPage)

  useEffect(() => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('search', searchQuery)
    if (selectedItemTypes.length > 0) params.set('itemtype', selectedItemTypes.join(','))
    if (selectedStatTypes.length > 0) params.set('stattype', selectedStatTypes.join(','))
    if (selectedRarities.length > 0) params.set('rarity', selectedRarities.join(','))
    if (filterLogic !== 'AND') params.set('logic', filterLogic)
    if (viewMode !== 'cards') params.set('view', viewMode)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (sortBy !== 'name') params.set('sort', sortBy)
    if (sortBy === 'stat' && sortStat !== 'strength') params.set('sortstat', sortStat)

    const newUrl = params.toString() ? `/browser?${params.toString()}` : '/browser'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedItemTypes, selectedStatTypes, selectedRarities, filterLogic, viewMode, currentPage, sortBy, sortStat, router])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedItemTypes, selectedStatTypes, selectedRarities, filterLogic])

  const toggleFavorite = useCallback((name: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(name)) {
      newFavorites.delete(name)
    } else {
      newFavorites.add(name)
    }
    setFavorites(newFavorites)
    localStorage.setItem('reforge-favorites', JSON.stringify(Array.from(newFavorites)))
  }, [favorites])

  const toggleItemType = useCallback((itemType: string) => {
    setSelectedItemTypes(prev => {
      if (prev.includes(itemType)) {
        return prev.filter(t => t !== itemType)
      } else {
        return [...prev, itemType]
      }
    })
  }, [])

  const toggleStatType = useCallback((statType: string) => {
    setSelectedStatTypes(prev => {
      if (prev.includes(statType)) {
        return prev.filter(s => s !== statType)
      } else {
        return [...prev, statType]
      }
    })
  }, [])

  const toggleRarity = useCallback((rarity: string) => {
    setSelectedRarities(prev => {
      if (prev.includes(rarity)) {
        return prev.filter(r => r !== rarity)
      } else {
        return [...prev, rarity]
      }
    })
  }, [])

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      COMMON: 'text-gray-600 dark:text-gray-400',
      UNCOMMON: 'text-green-600 dark:text-green-400',
      RARE: 'text-blue-600 dark:text-blue-400',
      EPIC: 'text-purple-600 dark:text-purple-400',
      LEGENDARY: 'text-amber-600 dark:text-amber-400',
      MYTHIC: 'text-pink-600 dark:text-pink-400',
      DIVINE: 'text-cyan-600 dark:text-cyan-400',
      SPECIAL: 'text-red-600 dark:text-red-400',
    }
    return colors[tier] || 'text-gray-600 dark:text-gray-400'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
        <div className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#1E1E1E] sticky top-0 z-10 transition-colors duration-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-6">
              <div className="flex items-center justify-between mb-6">
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
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <CardSkeleton />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchReforgeStones}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
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
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                suggestions={searchSuggestions}
                placeholder="Search reforges..."
              />
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-200 dark:text-white/87 mb-1">
                    {filteredReforges.length} Reforge{filteredReforges.length !== 1 ? 's' : ''} Found
                  </h2>
                  {(selectedItemTypes.length > 0 || selectedStatTypes.length > 0 || selectedRarities.length > 0) && (
                    <p className="text-xs text-gray-600 dark:text-white/60">
                      {selectedItemTypes.length > 0 && `${selectedItemTypes.length} item type${selectedItemTypes.length !== 1 ? 's' : ''}`}
                      {selectedItemTypes.length > 0 && (selectedStatTypes.length > 0 || selectedRarities.length > 0) && ' • '}
                      {selectedStatTypes.length > 0 && `${selectedStatTypes.length} stat${selectedStatTypes.length !== 1 ? 's' : ''}`}
                      {selectedStatTypes.length > 0 && selectedRarities.length > 0 && ' • '}
                      {selectedRarities.length > 0 && `${selectedRarities.length} rarit${selectedRarities.length !== 1 ? 'ies' : 'y'}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600 dark:text-white/60 mr-2">View:</span>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        viewMode === 'cards'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        viewMode === 'table'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                      }`}
                    >
                      Table
                    </button>
                  </div>
                  {(selectedItemTypes.length > 0 || selectedStatTypes.length > 0 || selectedRarities.length > 0 || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedItemTypes([])
                        setSelectedStatTypes([])
                        setSelectedRarities([])
                        setSearchQuery('')
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-200 dark:text-white/87 mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-white/60">
                    Filter Logic
                  </label>
                  <div className="group relative">
                    <button
                      type="button"
                      className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/20 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/30 flex items-center justify-center text-xs font-semibold transition-colors"
                      aria-label="Filter logic help"
                    >
                      ?
                    </button>
                    <div className="absolute left-0 top-6 z-50 w-64 p-3 bg-gray-900 dark:bg-[#2C2C2C] border border-gray-700 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                      <div className="text-xs text-white space-y-2">
                        <p className="font-semibold mb-1">Filter Logic:</p>
                        <p><strong>AND:</strong> Items must match ALL selected filters (e.g., Sword AND Strength AND Epic)</p>
                        <p><strong>OR:</strong> Items must match ANY selected filter (e.g., Sword OR Bow OR Tool)</p>
                      </div>
                      <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 dark:bg-[#2C2C2C] border-l border-t border-gray-700 dark:border-white/10 rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterLogic('AND')}
                    className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                      filterLogic === 'AND'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                    }`}
                  >
                    AND
                  </button>
                  <button
                    onClick={() => setFilterLogic('OR')}
                    className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                      filterLogic === 'OR'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                    }`}
                  >
                    OR
                  </button>
                </div>
              </div>

              <ToggleableList
                items={ITEM_TYPES}
                selectedItems={selectedItemTypes}
                onToggle={toggleItemType}
                label="Item Types"
              />

              <ToggleableList
                items={STAT_TYPES}
                selectedItems={selectedStatTypes}
                onToggle={toggleStatType}
                label="Stat Types"
                displayTransform={(stat) => stat.replace(/_/g, ' ')}
              />

              <ToggleableList
                items={RARITIES}
                selectedItems={selectedRarities}
                onToggle={toggleRarity}
                label="Rarities"
              />
              </div>

            </div>

            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-200 dark:text-white/87 mb-2">
                Sort By
              </label>
              <div className="space-y-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'stat')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-sm text-gray-200 dark:text-white/87"
                >
                  <option value="name">Name</option>
                  <option value="cost">Cost</option>
                  <option value="stat">Stat Value</option>
                </select>
                {sortBy === 'stat' && (
                  <select
                    value={sortStat}
                    onChange={(e) => setSortStat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-sm text-gray-200 dark:text-white/87"
                  >
                    {STAT_TYPES.map(stat => (
                      <option key={stat} value={stat}>{stat.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedReforges.map((reforge) => (
              <div key={reforge.name}>
                <ReforgeCard
                  reforge={reforge}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.has(reforge.name)}
                  getTierColor={getTierColor}
                />
                {expandedReforge === reforge.name && (
                  <div className="mt-4 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <StatChart reforge={reforge} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Name</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Item Types</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Rarities</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Stats (Epic)</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Cost</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-700 dark:text-white/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReforges.map((reforge) => (
                  <tr
                    key={reforge.name}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium text-gray-200 dark:text-white/87">{reforge.name}</div>
                      {reforge.ability && (
                        <div className="text-xs text-gray-500 dark:text-white/60 mt-1">
                          {typeof reforge.ability === 'string'
                            ? stripMinecraftColors(reforge.ability)
                            : Object.values(reforge.ability)[0] && stripMinecraftColors(Object.values(reforge.ability)[0])}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {reforge.itemTypes.map(type => (
                          <span
                            key={type}
                            className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {reforge.rarities.map(rarity => (
                          <span
                            key={rarity}
                            className={`px-2 py-0.5 text-xs rounded ${getTierColor(rarity)}`}
                          >
                            {rarity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs space-y-0.5">
                        {reforge.stats['EPIC'] && Object.entries(reforge.stats['EPIC']).slice(0, 3).map(([stat, value]) => (
                          <div key={stat} className="flex gap-2">
                            <span className="text-gray-600 dark:text-white/60 capitalize">{stat.replace(/_/g, ' ')}:</span>
                            <span className={`font-medium ${(value as number) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {(value as number) > 0 ? '+' : ''}{value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-gray-600 dark:text-white font-semibold">
                        {Object.keys(reforge.costs).length > 0 ? (
                          <>
                            {Math.min(...Object.values(reforge.costs)).toLocaleString()} -{' '}
                            {Math.max(...Object.values(reforge.costs)).toLocaleString()} coins
                          </>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(reforge.name)}
                          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors ${
                            favorites.has(reforge.name) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                          title={favorites.has(reforge.name) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favorites.has(reforge.name) ? '★' : '☆'}
                        </button>
                        <Link
                          href={`/compare?reforges=${encodeURIComponent(reforge.name)}`}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Compare
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-white/60">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
            >
              Next
            </button>
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

export default function BrowserPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <CardSkeleton />
        </div>
      </main>
    }>
      <BrowserPageContent />
    </Suspense>
  )
}
