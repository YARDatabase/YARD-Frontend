import { render, screen } from '@testing-library/react'
import StatChart from '../StatChart'

describe('StatChart', () => {
  const mockReforge = {
    name: 'Test Reforge',
    stats: {
      COMMON: {
        strength: 10,
        defense: 5,
      },
      UNCOMMON: {
        strength: 15,
        defense: 8,
      },
      EPIC: {
        strength: 25,
        defense: 15,
      },
      LEGENDARY: {
        strength: 35,
        defense: 20,
      },
    },
  }

  it('should render stat scaling chart', () => {
    render(<StatChart reforge={mockReforge} />)

    expect(screen.getByText('Stat Scaling Across Rarities')).toBeInTheDocument()
  })

  it('should display stat names', () => {
    render(<StatChart reforge={mockReforge} />)

    expect(screen.getByText('strength')).toBeInTheDocument()
    expect(screen.getByText('defense')).toBeInTheDocument()
  })

  it('should show final stat values', () => {
    const reforgeWithMythic = {
      name: 'Test Reforge',
      stats: {
        COMMON: {
          strength: 10,
          defense: 5,
        },
        UNCOMMON: {
          strength: 15,
          defense: 8,
        },
        EPIC: {
          strength: 25,
          defense: 15,
        },
        LEGENDARY: {
          strength: 35,
          defense: 20,
        },
        MYTHIC: {
          strength: 35,
          defense: 20,
        },
      },
    }

    render(<StatChart reforge={reforgeWithMythic} />)

    expect(screen.getByText('+35')).toBeInTheDocument()
    expect(screen.getByText('+20')).toBeInTheDocument()
  })

  it('should handle negative stats', () => {
    const reforgeWithNegative = {
      name: 'Test Reforge',
      stats: {
        EPIC: {
          speed: -5,
        },
        MYTHIC: {
          speed: -5,
        },
      },
    }

    render(<StatChart reforge={reforgeWithNegative} />)

    expect(screen.getByText('-5')).toBeInTheDocument()
  })

  it('should limit displayed stats to 5', () => {
    const reforgeWithManyStats = {
      name: 'Test Reforge',
      stats: {
        EPIC: {
          strength: 10,
          defense: 10,
          health: 10,
          intelligence: 10,
          crit_chance: 10,
          crit_damage: 10,
          speed: 10,
        },
      },
    }

    render(<StatChart reforge={reforgeWithManyStats} />)

    const statElements = screen.getAllByText(/strength|defense|health|intelligence|crit chance/i)
    expect(statElements.length).toBeLessThanOrEqual(5)
  })

  it('should display message when no stats available', () => {
    const reforgeNoStats = {
      name: 'Test Reforge',
      stats: {},
    }

    render(<StatChart reforge={reforgeNoStats} />)

    expect(screen.getByText('No stat data available')).toBeInTheDocument()
  })

  it('should format stat names correctly', () => {
    const reforgeWithCritChance = {
      name: 'Test Reforge',
      stats: {
        EPIC: {
          crit_chance: 10,
        },
      },
    }

    render(<StatChart reforge={reforgeWithCritChance} />)

    expect(screen.getByText('crit chance')).toBeInTheDocument()
  })
})

