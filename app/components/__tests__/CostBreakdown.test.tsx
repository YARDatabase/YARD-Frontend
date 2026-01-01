import { render, screen } from '@testing-library/react'
import CostBreakdown from '../CostBreakdown'

const createMockReforgeStone = () => ({
  name: 'Test Reforge',
  costs: { EPIC: 5000 },
  source: 'Reforge Stone',
  stonePrice: 8000,
  stoneName: 'Test Stone',
  stoneTier: 'EPIC',
  rarities: ['EPIC', 'LEGENDARY'],
})

const createMockBlacksmith = () => ({
  name: 'Test Reforge',
  costs: {},
  source: 'Blacksmith',
  rarities: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'],
})

describe('CostBreakdown', () => {
  it('CostBreakdown_WhenRendered_DisplaysApplicationCosts', () => {
    // Arrange
    const reforge = createMockReforgeStone()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText('Application Costs')).toBeInTheDocument()
    expect(screen.getByText('5,000 coins')).toBeInTheDocument()
  })

  it('CostBreakdown_WhenStonesHavePrices_DisplaysLowestPrice', () => {
    // Arrange
    const reforge = createMockReforgeStone()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText('Reforge Stone Price')).toBeInTheDocument()
    expect(screen.getByText(/8,000 coins/)).toBeInTheDocument()
  })

  it('CostBreakdown_WhenStonesHavePrices_CalculatesTotalCost', () => {
    // Arrange
    const reforge = createMockReforgeStone()

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
      source: 'Reforge Stone',
    }

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.queryByText('Reforge Stone Price')).not.toBeInTheDocument()
  })

  it('CostBreakdown_WhenBlacksmithWithoutCosts_ShowsStandardPrices', () => {
    // Arrange
    const reforge = createMockBlacksmith()

    // Act
    render(<CostBreakdown reforge={reforge} />)

    // Assert
    expect(screen.getByText('Blacksmith Reforge Costs')).toBeInTheDocument()
    expect(screen.getByText('Blacksmith Reforge Cost (Epic)')).toBeInTheDocument()
    // check that EPIC price appears in the cost list
    const epicCostRow = screen.getByText('EPIC:').closest('div')
    expect(epicCostRow).toHaveTextContent('2,500 coins')
    // check the total section shows EPIC price - use getAllByText since it appears twice
    const allPrices = screen.getAllByText(/2,500 coins/)
    expect(allPrices.length).toBeGreaterThanOrEqual(1)
    // verify the total section specifically
    const totalSection = screen.getByText('Blacksmith Reforge Cost (Epic)').parentElement
    expect(totalSection).toHaveTextContent('2,500 coins')
  })
})
