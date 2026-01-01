import { render, screen } from '@testing-library/react'
import { TableSkeleton, CardSkeleton } from '../LoadingSkeleton'

describe('LoadingSkeleton', () => {
  describe('TableSkeleton', () => {
    it('should render table skeleton', () => {
      const { container } = render(<TableSkeleton />)
      
      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('should render 5 skeleton rows', () => {
      const { container } = render(<TableSkeleton />)
      
      const rows = container.querySelectorAll('.space-y-3 > div')
      expect(rows.length).toBe(5)
    })
  })

  describe('CardSkeleton', () => {
    it('should render card skeleton', () => {
      const { container } = render(<CardSkeleton />)
      
      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('should render 6 skeleton cards', () => {
      const { container } = render(<CardSkeleton />)
      
      const cards = container.querySelectorAll('.grid > div')
      expect(cards.length).toBe(6)
    })

    it('should have responsive grid classes', () => {
      const { container } = render(<CardSkeleton />)
      
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })
  })
})

