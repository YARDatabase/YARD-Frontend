import { render, screen, fireEvent } from '@testing-library/react'
import ToggleableList from '../ToggleableList'

const createMockItems = () => ['Item 1', 'Item 2', 'Item 3']

describe('ToggleableList', () => {
  const mockOnToggle = jest.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
  })

  it('ToggleableList_WhenRendered_DisplaysItems', () => {
    // Arrange
    const items = createMockItems()

    // Act
    render(
      <ToggleableList
        items={items}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    // Assert
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('ToggleableList_WhenItemClicked_CallsOnToggle', () => {
    // Arrange
    const items = createMockItems()

    // Act
    render(
      <ToggleableList
        items={items}
        selectedItems={[]}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )
    fireEvent.click(screen.getByText('Item 1').closest('button')!)

    // Assert
    expect(mockOnToggle).toHaveBeenCalledWith('Item 1')
  })

  it('ToggleableList_WhenItemSelected_HighlightsItem', () => {
    // Arrange
    const items = createMockItems()

    // Act
    render(
      <ToggleableList
        items={items}
        selectedItems={['Item 1']}
        onToggle={mockOnToggle}
        label="Test Label"
      />
    )

    // Assert
    const item1 = screen.getByText('Item 1').closest('button')
    expect(item1).toHaveClass('bg-blue-100')
  })
})
