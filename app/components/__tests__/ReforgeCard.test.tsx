import { render, screen, fireEvent } from '@testing-library/react'
import ReforgeCard from '../ReforgeCard'

const createMockReforge = () => ({
  name: 'Test Reforge',
  itemTypes: ['SWORD', 'AXE'],
  rarities: ['EPIC'],
  stats: {
    EPIC: { strength: 25, defense: 15 },
  },
  costs: { EPIC: 5000 },
  stones: [],
})

describe('ReforgeCard', () => {
  const mockGetTierColor = jest.fn(() => 'blue')
  const mockOnToggleFavorite = jest.fn()

  beforeEach(() => {
    mockOnToggleFavorite.mockClear()
  })

  it('ReforgeCard_WhenRendered_DisplaysReforgeName', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(
      <ReforgeCard
        reforge={reforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    // Assert
    expect(screen.getByText('Test Reforge')).toBeInTheDocument()
  })

  it('ReforgeCard_WhenFavoriteButtonClicked_CallsOnToggleFavorite', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(
      <ReforgeCard
        reforge={reforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )
    fireEvent.click(screen.getByTitle('Add to favorites'))

    // Assert
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('Test Reforge')
  })

  it('ReforgeCard_WhenIsFavorite_ShowsFilledStar', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(
      <ReforgeCard
        reforge={reforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={true}
        getTierColor={mockGetTierColor}
      />
    )

    // Assert
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('ReforgeCard_WhenRendered_DisplaysCompareLink', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(
      <ReforgeCard
        reforge={reforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    // Assert
    const link = screen.getByText('Compare').closest('a')
    expect(link).toHaveAttribute('href', '/compare?reforges=Test%20Reforge')
  })
})
