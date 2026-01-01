import { render, screen, fireEvent } from '@testing-library/react'
import ReforgeCard from '../ReforgeCard'

describe('ReforgeCard', () => {
  const mockReforge = {
    name: 'Test Reforge',
    itemTypes: ['SWORD', 'AXE', 'BOW'],
    rarities: ['EPIC', 'LEGENDARY'],
    stats: {
      EPIC: {
        strength: 25,
        defense: 15,
        health: 100,
        crit_damage: 20,
      },
    },
    costs: {
      EPIC: 5000,
    },
    stones: [],
  }

  const mockGetTierColor = jest.fn((tier: string) => 'blue')
  const mockOnToggleFavorite = jest.fn()

  beforeEach(() => {
    mockOnToggleFavorite.mockClear()
    mockGetTierColor.mockClear()
  })

  it('should render reforge name', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('Test Reforge')).toBeInTheDocument()
  })

  it('should display item types', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('SWORD')).toBeInTheDocument()
    expect(screen.getByText('AXE')).toBeInTheDocument()
    expect(screen.getByText('BOW')).toBeInTheDocument()
  })

  it('should show count when more than 3 item types', () => {
    const reforgeManyTypes = {
      ...mockReforge,
      itemTypes: ['SWORD', 'AXE', 'BOW', 'DAGGER', 'SPEAR'],
    }

    render(
      <ReforgeCard
        reforge={reforgeManyTypes}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('should display stats', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('Stats (Epic)')).toBeInTheDocument()
    expect(screen.getByText(/strength:/i)).toBeInTheDocument()
    expect(screen.getByText('+25')).toBeInTheDocument()
  })

  it('should show favorite button', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    const favoriteButton = screen.getByTitle('Add to favorites')
    expect(favoriteButton).toBeInTheDocument()
  })

  it('should call onToggleFavorite when favorite button clicked', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    const favoriteButton = screen.getByTitle('Add to favorites')
    fireEvent.click(favoriteButton)

    expect(mockOnToggleFavorite).toHaveBeenCalledWith('Test Reforge')
  })

  it('should show filled star when favorite', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={true}
        getTierColor={mockGetTierColor}
      />
    )

    const favoriteButton = screen.getByTitle('Remove from favorites')
    expect(favoriteButton).toBeInTheDocument()
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('should show empty star when not favorite', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('☆')).toBeInTheDocument()
  })

  it('should display compare link', () => {
    render(
      <ReforgeCard
        reforge={mockReforge}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    const compareLink = screen.getByText('Compare')
    expect(compareLink).toBeInTheDocument()
    expect(compareLink.closest('a')).toHaveAttribute(
      'href',
      '/compare?reforges=Test%20Reforge'
    )
  })

  it('should strip minecraft color codes from ability text', () => {
    const reforgeWithAbility = {
      ...mockReforge,
      ability: '§7This is §aability text',
    }

    render(
      <ReforgeCard
        reforge={reforgeWithAbility}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText('This is ability text')).toBeInTheDocument()
  })

  it('should show more stats indicator when stats exceed 4', () => {
    const reforgeManyStats = {
      ...mockReforge,
      stats: {
        EPIC: {
          strength: 25,
          defense: 15,
          health: 100,
          crit_damage: 20,
          speed: 10,
          intelligence: 50,
        },
      },
    }

    render(
      <ReforgeCard
        reforge={reforgeManyStats}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        getTierColor={mockGetTierColor}
      />
    )

    expect(screen.getByText(/\+2 more/)).toBeInTheDocument()
  })
})

