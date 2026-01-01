import { render, screen } from '@testing-library/react'
import CostBreakdown from '../CostBreakdown'

describe('CostBreakdown', () => {
  const mockReforge = {
    name: 'Test Reforge',
    costs: {
      COMMON: 1000,
      UNCOMMON: 2000,
      EPIC: 5000,
    },
    stones: [
      {
        id: 'stone1',
        name: 'Stone 1',
        tier: 'LEGENDARY',
        auction_price: 10000,
      },
      {
        id: 'stone2',
        name: 'Stone 2',
        tier: 'EPIC',
        bazaar_buy_price: 8000,
      },
    ],
  }

  it('should render application costs', () => {
    render(<CostBreakdown reforge={mockReforge} />)

    expect(screen.getByText('Application Costs')).toBeInTheDocument()
    expect(screen.getByText('COMMON:')).toBeInTheDocument()
    expect(screen.getByText('1,000 coins')).toBeInTheDocument()
    expect(screen.getByText('EPIC:')).toBeInTheDocument()
    expect(screen.getByText('5,000 coins')).toBeInTheDocument()
  })

  it('should display lowest stone price', () => {
    render(<CostBreakdown reforge={mockReforge} />)

    expect(screen.getByText('Reforge Stone Price')).toBeInTheDocument()
    expect(screen.getByText(/Lowest:/)).toBeInTheDocument()
    expect(screen.getByText(/8,000 coins/)).toBeInTheDocument()
  })

  it('should calculate total cost estimate', () => {
    render(<CostBreakdown reforge={mockReforge} />)

    expect(screen.getByText('Estimated Total (Epic)')).toBeInTheDocument()
    expect(screen.getByText(/13,000 coins/)).toBeInTheDocument()
  })

  it('should handle stones with only NPC sell price', () => {
    const reforgeWithNPC = {
      name: 'Test Reforge',
      costs: {
        COMMON: 1000,
      },
      stones: [
        {
          id: 'stone3',
          name: 'Stone 3',
          tier: 'COMMON',
          npc_sell_price: 5000,
        },
      ],
    }

    render(<CostBreakdown reforge={reforgeWithNPC} />)

    expect(screen.getByText(/Lowest:.*5,000 coins/)).toBeInTheDocument()
  })

  it('should handle stones with no prices', () => {
    const reforgeNoPrices = {
      ...mockReforge,
      stones: [
        {
          id: 'stone4',
          name: 'Stone 4',
          tier: 'COMMON',
        },
      ],
    }

    render(<CostBreakdown reforge={reforgeNoPrices} />)

    expect(screen.queryByText('Reforge Stone Price')).not.toBeInTheDocument()
  })

  it('should show stone count when multiple stones available', () => {
    render(<CostBreakdown reforge={mockReforge} />)

    expect(screen.getByText(/2 stones available/)).toBeInTheDocument()
  })

  it('should prioritize auction price over bazaar price', () => {
    const reforgeWithBoth = {
      name: 'Test Reforge',
      costs: {
        EPIC: 5000,
      },
      stones: [
        {
          id: 'stone5',
          name: 'Stone 5',
          tier: 'LEGENDARY',
          auction_price: 5000,
          bazaar_buy_price: 10000,
        },
      ],
    }

    render(<CostBreakdown reforge={reforgeWithBoth} />)

    expect(screen.getByText(/Lowest:.*5,000 coins/)).toBeInTheDocument()
  })
})

