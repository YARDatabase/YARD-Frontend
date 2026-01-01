import { render, screen } from '@testing-library/react'
import CostBreakdown from '../CostBreakdown'

const createMockReforge = () => ({
  name: 'Test Reforge',
  costs: { EPIC: 5000 },
  stones: [
    { id: 'stone1', name: 'Stone 1', tier: 'LEGENDARY', auction_price: 10000 },
    { id: 'stone2', name: 'Stone 2', tier: 'EPIC', bazaar_buy_price: 8000 },
  ],
})

describe('CostBreakdown', () => {
  it('CostBreakdown_WhenRendered_DisplaysApplicationCosts', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText('Application Costs')).toBeInTheDocument()
    expect(screen.getByText('5,000 coins')).toBeInTheDocument()
  })

  it('CostBreakdown_WhenStonesHavePrices_DisplaysLowestPrice', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText('Reforge Stone Price')).toBeInTheDocument()
    expect(screen.getByText(/8,000 coins/)).toBeInTheDocument()
  })

  it('CostBreakdown_WhenStonesHavePrices_CalculatesTotalCost', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText(/13,000 coins/)).toBeInTheDocument()
  })

  it('CostBreakdown_WhenNoStonePrices_HidesStonePriceSection', () => {
    // Arrange
    const reforge = {
      name: 'Test Reforge',
      costs: { EPIC: 5000 },
      stones: [{ id: 'stone1', name: 'Stone 1', tier: 'COMMON' }],
    }

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.queryByText('Reforge Stone Price')).not.toBeInTheDocument()
  })
})
