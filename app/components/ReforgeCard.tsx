'use client'

import Link from 'next/link'
import CostBreakdown from './CostBreakdown'

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

interface Reforge {
  name: string
  itemTypes: string[]
  rarities: string[]
  stats: Record<string, ReforgeStats>
  costs: Record<string, number>
  ability?: string | Record<string, string>
  stones: any[]
}

interface ReforgeCardProps {
  reforge: Reforge
  onToggleFavorite: (name: string) => void
  isFavorite: boolean
  getTierColor: (tier: string) => string
}

// removes minecraft color codes from text strings
function stripMinecraftColors(text: string): string {
  return text.replace(/§[0-9a-fk-or]/gi, '')
}

// displays a card component for a reforge showing stats costs and actions
export default function ReforgeCard({
  reforge,
  onToggleFavorite,
  isFavorite,
  getTierColor
}: ReforgeCardProps) {
  const epicStats = reforge.stats['EPIC'] || {}
  const statEntries = Object.entries(epicStats).slice(0, 4)

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-200 dark:text-white/87 mb-1">
            {reforge.name}
          </h3>
          {reforge.ability && (
            <p className="text-xs text-gray-600 dark:text-white/60 line-clamp-2">
              {typeof reforge.ability === 'string'
                ? stripMinecraftColors(reforge.ability)
                : (typeof reforge.ability === 'object' && reforge.ability['EPIC'] 
                    ? stripMinecraftColors(reforge.ability['EPIC']) 
                    : '')}
            </p>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(reforge.name)}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {reforge.itemTypes.slice(0, 3).map(type => (
          <span
            key={type}
            className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
          >
            {type}
          </span>
        ))}
        {reforge.itemTypes.length > 3 && (
          <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-white/60">
            +{reforge.itemTypes.length - 3}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5">
          Stats (Epic)
        </div>
        <div className="space-y-1">
          {statEntries.map(([stat, value]) => (
            <div key={stat} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-white/60 capitalize">
                {stat.replace(/_/g, ' ')}:
              </span>
              <span className={`font-medium ${
                (value as number) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(value as number) > 0 ? '+' : ''}{value}
              </span>
            </div>
          ))}
          {Object.keys(epicStats).length > 4 && (
            <div className="text-xs text-gray-500 dark:text-white/60">
              +{Object.keys(epicStats).length - 4} more
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <CostBreakdown reforge={reforge} />
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/compare?reforges=${encodeURIComponent(reforge.name)}`}
          className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
        >
          Compare
        </Link>
      </div>
    </div>
  )
}

