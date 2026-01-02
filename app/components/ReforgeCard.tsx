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
  foraging_fortune?: number
  foraging_wisdom?: number
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
  source: string
  stoneId?: string
  stoneName?: string
  stoneTier?: string
  stonePrice?: number
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

// converts item ID to readable name
function formatItemName(itemId: string): string {
  return itemId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// groups and formats item types, handling SPECIFIC items that were split
function processItemTypes(itemTypes: string[]): Array<{ type: string; isSpecific: boolean }> {
  const result: Array<{ type: string; isSpecific: boolean }> = []
  let i = 0
  
  while (i < itemTypes.length) {
    if (itemTypes[i].startsWith('SPECIFIC:')) {
      // extract the first item from SPECIFIC: prefix
      const firstItem = itemTypes[i].replace('SPECIFIC:', '')
      const specificItems = [firstItem]
      
      // collect any following items that are part of the specific list
      // (they don't start with SPECIFIC: and aren't regular item types)
      i++
      while (i < itemTypes.length && 
             !itemTypes[i].startsWith('SPECIFIC:') && 
             !['SWORD', 'BOW', 'ARMOR', 'TOOL', 'ACCESSORY', 'FISHING_ROD', 'EQUIPMENT', 'AXE/HOE', 'ROD', 'VACUUM', 'CLOAK', 'BELT'].includes(itemTypes[i])) {
        specificItems.push(itemTypes[i])
        i++
      }
      
      // format the specific items
      const formatted = specificItems.map(formatItemName).join(', ')
      result.push({ type: formatted, isSpecific: true })
    } else {
      // regular item type
      result.push({ type: itemTypes[i], isSpecific: false })
      i++
    }
  }
  
  return result
}

// tier ordering and abbreviations for stats table
const TIER_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'SPECIAL']
const TIER_ABBREV: Record<string, string> = {
  COMMON: 'COM',
  UNCOMMON: 'UNC',
  RARE: 'RAR',
  EPIC: 'EPI',
  LEGENDARY: 'LEG',
  MYTHIC: 'MYT',
  DIVINE: 'DIV',
  SPECIAL: 'SPE',
}
const STAT_ABBREV: Record<string, string> = {
  sea_creature_chance: 'SCC',
  mining_speed: 'Mining Spd',
  mining_fortune: 'Mining Fort',
  farming_fortune: 'Farm Fort',
  foraging_fortune: 'Forag Fort',
  foraging_wisdom: 'Forag Wis',
  bonus_attack_speed: 'Atk Spd',
  attack_speed: 'Atk Spd',
  crit_chance: 'Crit %',
  crit_damage: 'Crit Dmg',
  true_defense: 'True Def',
  ability_damage: 'Abil Dmg',
  magic_find: 'Magic Find',
  pet_luck: 'Pet Luck',
  intelligence: 'Intel',
  strength: 'STR',
  defense: 'DEF',
  health: 'HP',
  speed: 'Speed',
  ferocity: 'Ferocity',
  damage: 'Damage',
}

// displays a card component for a reforge showing stats costs and actions
export default function ReforgeCard({
  reforge,
  onToggleFavorite,
  isFavorite,
  getTierColor
}: ReforgeCardProps) {
  // process item types to group SPECIFIC items properly
  const processedTypes = processItemTypes(reforge.itemTypes)
  
  // get available tiers and all stats for the table
  const availableTiers = Object.keys(reforge.stats)
    .sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b))
  const allStats = new Set<string>()
  Object.values(reforge.stats).forEach((stats) => {
    Object.keys(stats).forEach((stat) => allStats.add(stat))
  })

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {reforge.name}
          </h3>
          {reforge.ability && (
            <p className="text-xs text-gray-600 dark:text-white/70">
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
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors flex-shrink-0 ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`px-2 py-0.5 text-xs rounded ${
              reforge.source === 'Reforge Stone'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            }`}
          >
            {reforge.source === 'Reforge Stone' ? 'Stone' : 'Blacksmith'}
          </span>
          {processedTypes.map((item, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 text-xs rounded ${
                item.isSpecific
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}
            >
              {item.isSpecific ? `Specific: ${item.type}` : item.type}
            </span>
          ))}
        </div>
      </div>

      {availableTiers.length > 0 && allStats.size > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-white/10">
          <div className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-2 uppercase tracking-wide">
            Stats
          </div>
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left pr-2 pb-1.5 text-gray-500 dark:text-white/60 font-medium"></th>
                  {availableTiers.map((tier) => (
                    <th
                      key={tier}
                      className={`text-center px-1.5 pb-1.5 font-semibold ${getTierColor(tier)}`}
                      title={tier}
                    >
                      {TIER_ABBREV[tier] || tier.slice(0, 3).toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(allStats).map((stat) => (
                  <tr key={stat} className="border-t border-gray-100 dark:border-white/5">
                    <td className="text-left pr-2 py-1 text-gray-700 dark:text-white/80 capitalize">
                      <span className="relative group/stat cursor-default">
                        {STAT_ABBREV[stat] || stat.replace(/_/g, ' ')}
                        {STAT_ABBREV[stat] && (
                          <span className="absolute left-0 bottom-full mb-1 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded shadow-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-10">
                            {stat.replace(/_/g, ' ')}
                          </span>
                        )}
                      </span>
                    </td>
                    {availableTiers.map((tier) => {
                      const tierStats = reforge.stats[tier]
                      const value = tierStats?.[stat as keyof ReforgeStats]
                      return (
                        <td
                          key={tier}
                          className="text-center px-1.5 py-1 text-gray-600 dark:text-white/70 font-medium tabular-nums"
                        >
                          {value !== undefined ? (
                            <span className={(value as number) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                              {(value as number) > 0 ? '+' : ''}{value}
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-white/20">-</span>
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
      )}

      <div className="mb-3 flex-1">
        <CostBreakdown reforge={reforge} />
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-200 dark:border-white/10">
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

