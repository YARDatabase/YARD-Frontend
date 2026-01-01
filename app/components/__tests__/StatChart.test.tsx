import { render, screen } from '@testing-library/react'
import StatChart from '../StatChart'

const createMockReforge = () => ({
  name: 'Test Reforge',
  stats: {
    EPIC: {
      strength: 25,
      defense: 15,
    },
  },
})

describe('StatChart', () => {
  it('StatChart_WhenStatsExist_DisplaysStatChart', () => {
    // Arrange
    const reforge = createMockReforge()

    // Act
    render(<StatChart reforge={reforge} />)

    // Assert
    expect(screen.getByText('Stat Scaling Across Rarities')).toBeInTheDocument()
    expect(screen.getByText('strength')).toBeInTheDocument()
  })

  it('StatChart_WhenNoStats_DisplaysNoDataMessage', () => {
    // Arrange
    const reforge = {
      name: 'Test Reforge',
      stats: {},
    }

    // Act
    render(<StatChart reforge={reforge} />)

    // Assert
    expect(screen.getByText('No stat data available')).toBeInTheDocument()
  })

  it('StatChart_WhenRendered_DisplaysFinalStatValues', () => {
    // Arrange
    const reforge = {
      name: 'Test Reforge',
      stats: {
        MYTHIC: {
          strength: 35,
        },
      },
    }

    // Act
    render(<StatChart reforge={reforge} />)

    // Assert
    expect(screen.getByText('+35')).toBeInTheDocument()
  })
})
