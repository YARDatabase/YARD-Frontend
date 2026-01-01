import { render, screen, fireEvent } from '@testing-library/react'
import ToggleableList from '../ToggleableList'

describe('ToggleableList', () => {
  const mockItems = ['Item 1', 'Item 2', 'Item 3']
  const mockOnToggle = jest.fn()
  const mockDisplayTransform = (item: string) => item.toUpperCase()

  beforeEach(() => {
    mockOnToggle.mockClear()
  })

  it('should render all items', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('should display label', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should highlight selected items', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={['Item 1', 'Item 3']}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    const item1 = screen.getByText('Item 1').closest('button')
    const item2 = screen.getByText('Item 2').closest('button')
    const item3 = screen.getByText('Item 3').closest('button')

    expect(item1).toHaveClass('bg-blue-100')
    expect(item2).not.toHaveClass('bg-blue-100')
    expect(item3).toHaveClass('bg-blue-100')
  })

  it('should call onToggle when item is clicked', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    const item1 = screen.getByText('Item 1').closest('button')
    fireEvent.click(item1!)

    expect(mockOnToggle).toHaveBeenCalledWith('Item 1')
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('should apply displayTransform when provided', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
        displayTransform={mockDisplayTransform}
      />
    )

    expect(screen.getByText('ITEM 1')).toBeInTheDocument()
    expect(screen.getByText('ITEM 2')).toBeInTheDocument()
    expect(screen.getByText('ITEM 3')).toBeInTheDocument()
  })

  it('should show checkmark for selected items', () => {
    render(
      <ToggleableList
        items={mockItems}
        selectedItems={['Item 1']}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    const item1 = screen.getByText('Item 1').closest('button')
    const svg = item1!.querySelector('svg')
    
    expect(svg).toBeInTheDocument()
  })
})

