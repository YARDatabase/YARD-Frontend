'use client'

import { useMemo } from 'react'

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
  stats: Record<string, ReforgeStats>
}

interface StatChartProps {
  reforge: Reforge
}

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC']

// displays a chart showing how stats scale across different rarities for a reforge
export default function StatChart({ reforge }: StatChartProps) {
  const chartData = useMemo(() => {
    const allStats = new Set<string>()
    RARITIES.forEach(rarity => {
      const stats = reforge.stats[rarity]
      if (stats) {
        Object.keys(stats).forEach(stat => allStats.add(stat))
      }
    })

    return Array.from(allStats).map(stat => {
      const values = RARITIES.map(rarity => {
        const stats = reforge.stats[rarity]
        return stats?.[stat] || 0
      })
      return { stat, values }
    })
  }, [reforge])

  const maxValue = useMemo(() => {
    let max = 0
    chartData.forEach(({ values }) => {
      values.forEach(v => {
        if (Math.abs(v) > max) max = Math.abs(v)
      })
    })
    return max
  }, [chartData])

  if (chartData.length === 0) {
    return <div className="text-sm text-gray-500 dark:text-white/60">No stat data available</div>
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-white/60">
        Stat Scaling Across Rarities
      </h4>
      <div className="space-y-3">
        {chartData.slice(0, 5).map(({ stat, values }) => (
          <div key={stat}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-white/60 capitalize">
                {stat.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-gray-500 dark:text-white/60">
                {values[values.length - 1] > 0 ? '+' : ''}{values[values.length - 1]}
              </span>
            </div>
            <div className="flex items-center gap-1 h-4">
              {values.map((value, idx) => {
                const width = maxValue > 0 ? (Math.abs(value) / maxValue) * 100 : 0
                const isPositive = value >= 0
                return (
                  <div
                    key={idx}
                    className={`h-full rounded ${
                      isPositive
                        ? 'bg-green-500 dark:bg-green-400'
                        : 'bg-red-500 dark:bg-red-400'
                    }`}
                    style={{ width: `${width}%` }}
                    title={`${RARITIES[idx]}: ${value > 0 ? '+' : ''}${value}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

