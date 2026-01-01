'use client'

interface Reforge {
  name: string
  costs: Record<string, number>
  source: string
  stoneId?: string
  stoneName?: string
  stoneTier?: string
  stonePrice?: number
  rarities?: string[]
}

interface CostBreakdownProps {
  reforge: Reforge
}

// standard blacksmith reforge prices based on rarity
const BLACKSMITH_PRICES: Record<string, number> = {
  'COMMON': 250,
  'UNCOMMON': 500,
  'RARE': 1000,
  'EPIC': 2500,
  'LEGENDARY': 5000,
  'MYTHIC': 10000,
  'DIVINE': 15000,
  'SPECIAL': 25000,
  'VERY SPECIAL': 50000
}

// displays cost breakdown for a reforge including application costs and stone prices
export default function CostBreakdown({ reforge }: CostBreakdownProps) {
  const isBlacksmith = reforge.source === 'Blacksmith'
  const stonePrice = reforge.stonePrice
  const hasCostData = Object.keys(reforge.costs).length > 0
  
  // for blacksmith reforges without cost data, use standard blacksmith prices
  const displayCosts = isBlacksmith && !hasCostData && reforge.rarities
    ? reforge.rarities.reduce((acc, rarity) => {
        if (BLACKSMITH_PRICES[rarity]) {
          acc[rarity] = BLACKSMITH_PRICES[rarity]
        }
        return acc
      }, {} as Record<string, number>)
    : reforge.costs

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-white/60 mb-2">
        Cost Breakdown
      </h4>
      
      <div>
        <div className="text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
          {isBlacksmith && !hasCostData ? 'Blacksmith Reforge Costs' : 'Application Costs'}
        </div>
        <div className="space-y-1">
          {Object.entries(displayCosts).map(([rarity, cost]) => (
            <div key={rarity} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-white/60">{rarity}:</span>
              <span className="text-gray-200 dark:text-white/87 font-medium">
                {cost.toLocaleString()} coins
              </span>
            </div>
          ))}
          {Object.keys(displayCosts).length === 0 && !isBlacksmith && (
            <div className="text-xs text-gray-500 dark:text-white/60 italic">
              No cost data available
            </div>
          )}
          {isBlacksmith && !hasCostData && Object.keys(displayCosts).length === 0 && (
            <div className="text-xs text-gray-500 dark:text-white/60 italic">
              Cost depends on item rarity at the Blacksmith
            </div>
          )}
        </div>
      </div>

      {!isBlacksmith && stonePrice && (
        <div>
          <div className="text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
            Reforge Stone Price
          </div>
          <div className="text-xs text-gray-200 dark:text-white/87">
            {stonePrice.toLocaleString()} coins
          </div>
          {reforge.stoneName && (
            <div className="text-xs text-gray-500 dark:text-white/60 mt-1">
              {reforge.stoneName}
            </div>
          )}
        </div>
      )}

      {!isBlacksmith && stonePrice && Object.keys(displayCosts).length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-white/60">
              Estimated Total (Epic)
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {(stonePrice + (displayCosts['EPIC'] || 0)).toLocaleString()} coins
            </span>
          </div>
        </div>
      )}

      {isBlacksmith && Object.keys(displayCosts).length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-white/60">
              Blacksmith Reforge Cost (Epic)
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {(displayCosts['EPIC'] || 0).toLocaleString()} coins
            </span>
          </div>
          {!hasCostData && (
            <div className="text-xs text-gray-500 dark:text-white/60 mt-1 italic">
              Standard Blacksmith fee (no stone required)
            </div>
          )}
        </div>
      )}
    </div>
  )
}


