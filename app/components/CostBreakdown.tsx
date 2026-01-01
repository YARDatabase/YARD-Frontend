'use client'

interface ReforgeStone {
  id: string
  name: string
  tier: string
  auction_price?: number
  bazaar_buy_price?: number
  bazaar_sell_price?: number
  npc_sell_price?: number | string
}

interface Reforge {
  name: string
  costs: Record<string, number>
  stones: ReforgeStone[]
}

interface CostBreakdownProps {
  reforge: Reforge
}

// displays cost breakdown for a reforge including application costs and stone prices
export default function CostBreakdown({ reforge }: CostBreakdownProps) {
  // finds the best available price for a stone checking auction bazaar and npc prices
  const getBestPrice = (stone: ReforgeStone): number | null => {
    if (stone.auction_price) return stone.auction_price
    if (stone.bazaar_buy_price) return stone.bazaar_buy_price
    if (typeof stone.npc_sell_price === 'number') return stone.npc_sell_price
    return null
  }

  const stonePrices = reforge.stones.map(stone => ({
    stone,
    price: getBestPrice(stone)
  })).filter(sp => sp.price !== null)

  const minStonePrice = stonePrices.length > 0 
    ? Math.min(...stonePrices.map(sp => sp.price!))
    : null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-white/60 mb-2">
        Cost Breakdown
      </h4>
      
      <div>
        <div className="text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
          Application Costs
        </div>
        <div className="space-y-1">
          {Object.entries(reforge.costs).map(([rarity, cost]) => (
            <div key={rarity} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-white/60">{rarity}:</span>
              <span className="text-gray-200 dark:text-white/87 font-medium">
                {cost.toLocaleString()} coins
              </span>
            </div>
          ))}
        </div>
      </div>

      {minStonePrice && (
        <div>
          <div className="text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
            Reforge Stone Price
          </div>
          <div className="text-xs text-gray-200 dark:text-white/87">
            Lowest: {minStonePrice.toLocaleString()} coins
          </div>
          {stonePrices.length > 1 && (
            <div className="text-xs text-gray-500 dark:text-white/60 mt-1">
              {stonePrices.length} stone{stonePrices.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>
      )}

      {minStonePrice && Object.keys(reforge.costs).length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-white/60">
              Estimated Total (Epic)
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {(minStonePrice + (reforge.costs['EPIC'] || 0)).toLocaleString()} coins
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

