'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import Link from 'next/link'

// removes minecraft color codes from text strings
function stripMinecraftColors(text: string): string {
  return text.replace(/§[0-9a-fk-or]/gi, '')
}

interface BazaarOrder {
  amount: number
  pricePerUnit: number
  orders: number
}

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
  bazaar_buy_orders?: BazaarOrder[]
  bazaar_sell_orders?: BazaarOrder[]
  reforge_effect?: ReforgeEffect
  skin?: {
    value?: string
    signature?: string
  }
}

interface ReforgeStonesResponse {
  success: boolean
  count: number
  lastUpdated: string
  reforgeStones: ReforgeStone[]
}

const ReforgeStoneCard = ({
  stone,
  getTierColor,
  getTierBadgeColor,
  theme,
}: {
  stone: ReforgeStone
  getTierColor: (tier: string) => string
  getTierBadgeColor: (tier: string) => string
  theme: string
}) => {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getImageUrl = (stone: ReforgeStone): string | null => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const itemId = encodeURIComponent(stone.id)
    
    return `${apiUrl}/api/item-data/${itemId}`
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const imageUrl = getImageUrl(stone)

  return (
    <div className="group relative bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/10 rounded-xl p-5 hover:border-gray-300 dark:hover:border-white/15 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/50 hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2C2C2C] dark:to-[#1E1E1E] rounded-lg p-2 flex items-center justify-center border border-gray-200/50 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/15 transition-colors">
              {!imageError && imageUrl ? (
                <img
                  key={currentImageIndex}
                  src={imageUrl}
                  alt={stone.name}
                  className="w-16 h-16 object-contain rounded"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400 dark:text-white/38"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`text-lg font-bold ${getTierColor(stone.tier)} truncate leading-tight`}>
                {stone.name}
              </h3>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex-shrink-0 ${getTierBadgeColor(
                  stone.tier
                )}`}
              >
                {stone.tier}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/90">
              <span className="font-mono truncate">{stone.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-white/10">
          {stone.reforge_effect && (
            <div className="space-y-3">
              {stone.reforge_effect.reforge_name && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-2 uppercase tracking-wide">
                    Reforge: {stone.reforge_effect.reforge_name}
                  </div>
                  {stone.reforge_effect.item_types && (
                    <div className="text-xs text-gray-600 dark:text-white/90 mb-1">
                      Applies to: {stone.reforge_effect.item_types}
                    </div>
                  )}
                </div>
              )}

              {stone.reforge_effect.reforge_stats && stone.reforge_effect.reforge_stats[stone.tier] && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-1.5 uppercase tracking-wide">
                    Stats ({stone.tier})
                  </div>
                  <div className="space-y-1 text-xs">
                    {Object.entries(stone.reforge_effect.reforge_stats[stone.tier]).map(([stat, value]) => (
                      <div key={stat} className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-white/95 capitalize">
                          {stat.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-200 dark:text-white/87 font-medium">
                          {value > 0 ? '+' : ''}{value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stone.reforge_effect.reforge_ability && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-1.5 uppercase tracking-wide">
                    Special Ability
                  </div>
                  <div className="text-xs text-gray-700 dark:text-white/70 leading-relaxed">
                    {stripMinecraftColors(
                      typeof stone.reforge_effect.reforge_ability === 'string'
                        ? stone.reforge_effect.reforge_ability
                        : stone.reforge_effect.reforge_ability[stone.tier] || 
                          Object.values(stone.reforge_effect.reforge_ability)[0]
                    )}
                  </div>
                </div>
              )}

              {stone.reforge_effect.obtaining && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-1 uppercase tracking-wide">
                    Obtaining
                  </div>
                  <div className="text-xs text-gray-700 dark:text-white/70">
                    {stripMinecraftColors(stone.reforge_effect.obtaining)}
                  </div>
                </div>
              )}

              {stone.reforge_effect.mining_level_req && (
                <div className="text-xs text-amber-600 dark:text-amber-200 font-medium">
                  {stone.reforge_effect.mining_level_req}
                </div>
              )}

              {stone.reforge_effect.reforge_costs && stone.reforge_effect.reforge_costs[stone.tier] && (
                <div className="text-xs text-gray-700 dark:text-white/95">
                  Cost to apply: {stone.reforge_effect.reforge_costs[stone.tier].toLocaleString()} coins
                </div>
              )}
            </div>
          )}

          {(stone.auction_price || 
            (stone.bazaar_buy_orders && stone.bazaar_buy_orders.length > 0) || 
            (stone.bazaar_sell_orders && stone.bazaar_sell_orders.length > 0) ||
            (stone.bazaar_buy_price && stone.bazaar_sell_price) || 
            stone.npc_sell_price) && (
            <div className="space-y-2">
              {stone.auction_price && (
                <div className="flex items-center justify-between p-2.5 bg-green-50 dark:bg-emerald-200/10 rounded-lg border border-green-200/50 dark:border-emerald-200/20">
                  <span className="text-xs font-medium text-gray-600 dark:text-white/90">Auction House</span>
                  <span className="text-sm font-bold text-green-600 dark:text-emerald-200">
                    {stone.auction_price.toLocaleString()}
                  </span>
                </div>
              )}
              {(stone.bazaar_buy_orders && stone.bazaar_buy_orders.length > 0) || 
               (stone.bazaar_sell_orders && stone.bazaar_sell_orders.length > 0) ? (
                <div className="space-y-2">
                  {stone.bazaar_buy_orders && stone.bazaar_buy_orders.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-1.5 uppercase tracking-wide">
                        Buy Orders (Top 3)
                      </div>
                      <div className="space-y-1.5">
                        {stone.bazaar_buy_orders.slice(0, 3).map((order, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-200/10 rounded-lg border border-blue-200/50 dark:border-blue-200/20"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-blue-600 dark:text-blue-200">
                                {Math.round(order.pricePerUnit).toLocaleString()} coins
                              </div>
                              <div className="text-xs text-gray-600 dark:text-white/90 mt-0.5">
                                {order.amount.toLocaleString()} items • {order.orders} order{order.orders !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {stone.bazaar_sell_orders && stone.bazaar_sell_orders.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-white/90 mb-1.5 uppercase tracking-wide">
                        Sell Orders (Top 3)
                      </div>
                      <div className="space-y-1.5">
                        {stone.bazaar_sell_orders.slice(0, 3).map((order, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-2 bg-orange-50 dark:bg-amber-200/10 rounded-lg border border-orange-200/50 dark:border-amber-200/20"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-orange-600 dark:text-amber-200">
                                {Math.round(order.pricePerUnit).toLocaleString()} coins
                              </div>
                              <div className="text-xs text-gray-600 dark:text-white/90 mt-0.5">
                                {order.amount.toLocaleString()} items • {order.orders} order{order.orders !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : stone.bazaar_buy_price && stone.bazaar_sell_price ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-200/10 rounded-lg border border-blue-200/50 dark:border-blue-200/20">
                    <span className="text-xs font-medium text-gray-600 dark:text-white/90">Bazaar Buy</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-200">
                      {Math.round(stone.bazaar_buy_price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-amber-200/10 rounded-lg border border-orange-200/50 dark:border-amber-200/20">
                    <span className="text-xs font-medium text-gray-600 dark:text-white/90">Bazaar Sell</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-amber-200">
                      {Math.round(stone.bazaar_sell_price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : null}
              {!stone.auction_price && 
               !(stone.bazaar_buy_orders && stone.bazaar_buy_orders.length > 0) && 
               !(stone.bazaar_sell_orders && stone.bazaar_sell_orders.length > 0) &&
               !(stone.bazaar_buy_price && stone.bazaar_sell_price) && 
               stone.npc_sell_price && (
                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/10">
                  <span className="text-xs font-medium text-gray-600 dark:text-white/90">NPC Price</span>
                  <span className="text-sm font-bold text-gray-200 dark:text-white/87">
                    {typeof stone.npc_sell_price === 'number'
                      ? stone.npc_sell_price.toLocaleString()
                      : stone.npc_sell_price}
                  </span>
                </div>
              )}
              {(stone.auction_price || 
                (stone.bazaar_buy_orders && stone.bazaar_buy_orders.length > 0) || 
                (stone.bazaar_sell_orders && stone.bazaar_sell_orders.length > 0) ||
                (stone.bazaar_buy_price && stone.bazaar_sell_price)) && (
                <div className="pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
                  <a
                    href={`https://sky.coflnet.com/item/${encodeURIComponent(stone.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
                  >
                    Prices provided by{' '}
                    <span className="font-medium">SkyCofl</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StonesPage() {
  const { theme, toggleTheme } = useTheme()
  const [reforgeStones, setReforgeStones] = useState<ReforgeStone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('ALL')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const filteredStones = useMemo(() => {
    return reforgeStones.filter((stone) => {
      const matchesSearch =
        stone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stone.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = selectedTier === 'ALL' || stone.tier === selectedTier
      return matchesSearch && matchesTier
    })
  }, [reforgeStones, searchQuery, selectedTier])

  const uniqueTiers = useMemo(() => {
    const tiers = Array.from(new Set(reforgeStones.map((stone) => stone.tier)))
    return tiers.sort()
  }, [reforgeStones])

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

  const getTierBadgeColor = (tier: string) => {
    if (theme === 'dark') {
      const colors: Record<string, string> = {
        COMMON: 'bg-gray-800 text-gray-300 border-gray-700',
        UNCOMMON: 'bg-green-900/30 text-green-300 border-green-700/50',
        RARE: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
        EPIC: 'bg-purple-900/30 text-purple-300 border-purple-700/50',
        LEGENDARY: 'bg-amber-900/30 text-amber-300 border-amber-700/50',
        MYTHIC: 'bg-pink-900/30 text-pink-300 border-pink-700/50',
        DIVINE: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/50',
        SPECIAL: 'bg-red-900/30 text-red-300 border-red-700/50',
      }
      return colors[tier] || 'bg-gray-100 text-gray-600 border-gray-200'
    } else {
      const colors: Record<string, string> = {
        COMMON: 'bg-gray-100 text-gray-600 border-gray-200',
        UNCOMMON: 'bg-green-100 text-green-600 border-green-200',
        RARE: 'bg-blue-100 text-blue-600 border-blue-200',
        EPIC: 'bg-purple-100 text-purple-600 border-purple-200',
        LEGENDARY: 'bg-amber-100 text-amber-600 border-amber-200',
        MYTHIC: 'bg-pink-100 text-pink-600 border-pink-200',
        DIVINE: 'bg-cyan-100 text-cyan-600 border-cyan-200',
        SPECIAL: 'bg-red-100 text-red-600 border-red-200',
      }
      return colors[tier] || 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTier(e.target.value)
  }

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

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search reforge stones..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-md leading-5 bg-white dark:bg-[#1E1E1E] text-gray-200 dark:text-white/87 placeholder-gray-400 dark:placeholder-white/38 focus:outline-none focus:placeholder-gray-500 dark:focus:placeholder-white/60 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-200 focus:border-blue-500 dark:focus:border-blue-200/50 text-sm transition-colors"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedTier}
                  onChange={handleTierChange}
                  className="block w-full px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] text-gray-200 dark:text-white/87 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-200 focus:border-blue-500 dark:focus:border-blue-200/50 transition-colors"
                >
                  <option value="ALL">All Tiers</option>
                  {uniqueTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-slate-400">
              <span>
                {filteredStones.length} {filteredStones.length === 1 ? 'result' : 'results'}
                {reforgeStones.length !== filteredStones.length &&
                  ` of ${reforgeStones.length}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-white/60 mt-4 text-sm">
              Loading reforge stones...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchReforgeStones}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredStones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-700 dark:text-white/95">
              {searchQuery || selectedTier !== 'ALL'
                ? 'Try adjusting your search or filter'
                : 'No reforge stones available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStones.map((stone) => (
              <ReforgeStoneCard
                key={stone.id}
                stone={stone}
                getTierColor={getTierColor}
                getTierBadgeColor={getTierBadgeColor}
                theme={theme}
              />
            ))}
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

