import { render } from '@testing-library/react'
import { TableSkeleton, CardSkeleton } from '../LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('TableSkeleton_WhenRendered_DisplaysSkeleton', () => {
    // Arrange & Act
    const { container } = render(<TableSkeleton />)

    // Assert
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('CardSkeleton_WhenRendered_DisplaysSkeleton', () => {
    // Arrange & Act
    const { container } = render(<CardSkeleton />)

    // Assert
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })
})
