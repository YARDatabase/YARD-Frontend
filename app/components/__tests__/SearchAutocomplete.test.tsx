import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SearchAutocomplete from '../SearchAutocomplete'

const SearchWrapper = ({ suggestions }: { suggestions: string[] }) => {
  const [value, setValue] = useState('')
  return (
    <SearchAutocomplete
      value={value}
      onChange={setValue}
      suggestions={suggestions}
    />
  )
}

describe('SearchAutocomplete', () => {
  const mockSuggestions = ['Apple', 'Banana', 'Cherry']
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('SearchAutocomplete_WhenInputChanges_CallsOnChange', async () => {
    // Arrange
    const user = userEvent.setup()

    // Act
    render(
      <SearchAutocomplete
        value=""
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    )
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'test')

    // Assert
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('SearchAutocomplete_WhenSuggestionClicked_SelectsSuggestion', async () => {
    // Arrange
    const user = userEvent.setup()

    // Act
    render(<SearchWrapper suggestions={mockSuggestions} />)
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'ap')

    const buttons = await screen.findAllByRole('button')
    const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
    expect(appleButton).toBeDefined()
    if (appleButton) {
      await user.click(appleButton)
    }

    // Assert
    expect((input as HTMLInputElement).value).toBe('Apple')
  })

  it('SearchAutocomplete_WhenEnterPressed_SelectsHighlightedSuggestion', async () => {
    // Arrange
    const user = userEvent.setup()

    // Act
    render(<SearchWrapper suggestions={mockSuggestions} />)
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'ap')

    const buttons = await screen.findAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Assert
    expect((input as HTMLInputElement).value).toBe('Apple')
  })

  it('SearchAutocomplete_WhenEscapePressed_ClosesSuggestions', async () => {
    // Arrange
    const user = userEvent.setup()

    // Act
    render(<SearchWrapper suggestions={mockSuggestions} />)
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'ap')

    const buttons = await screen.findAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    fireEvent.keyDown(input, { key: 'Escape' })

    // Assert
    await new Promise(resolve => setTimeout(resolve, 100))
    const buttonsAfterEscape = screen.queryAllByRole('button')
    expect(buttonsAfterEscape.length).toBe(0)
  })
})
