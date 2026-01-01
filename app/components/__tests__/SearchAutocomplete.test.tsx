import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SearchAutocomplete from '../SearchAutocomplete'

const SearchAutocompleteWrapper = ({ suggestions, placeholder }: { suggestions: string[], placeholder?: string }) => {
  const [value, setValue] = useState('')
  return (
    <SearchAutocomplete
      value={value}
      onChange={setValue}
      suggestions={suggestions}
      placeholder={placeholder}
    />
  )
}

describe('SearchAutocomplete', () => {
  const mockSuggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should render input with placeholder', () => {
    render(
      <SearchAutocomplete
        value=""
        onChange={mockOnChange}
        suggestions={mockSuggestions}
        placeholder="Search fruits..."
      />
    )

    const input = screen.getByPlaceholderText('Search fruits...')
    expect(input).toBeInTheDocument()
  })

  it('should filter suggestions based on input', async () => {
    render(<SearchAutocompleteWrapper suggestions={mockSuggestions} />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'ap')

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).toBeInTheDocument()
    })
  })

  it('should show suggestions when input has value', async () => {
    render(<SearchAutocompleteWrapper suggestions={mockSuggestions} />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'a')

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      const bananaButton = buttons.find(btn => btn.textContent?.includes('Banana'))
      expect(appleButton).toBeInTheDocument()
      expect(bananaButton).toBeInTheDocument()
    })
  })

  it('should call onChange when input value changes', async () => {
    render(
      <SearchAutocomplete
        value=""
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    )

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'test')

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should select suggestion on click', async () => {
    render(<SearchAutocompleteWrapper suggestions={mockSuggestions} />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'ap')

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).toBeInTheDocument()
      if (appleButton) {
        fireEvent.click(appleButton)
      }
    })

    expect((input as HTMLInputElement).value).toBe('Apple')
  })

  it('should handle keyboard navigation', async () => {
    render(<SearchAutocompleteWrapper suggestions={mockSuggestions} />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'a')

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).toBeInTheDocument()
    })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe('Apple')
    })
  })

  it('should close suggestions on Escape key', async () => {
    render(<SearchAutocompleteWrapper suggestions={mockSuggestions} />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.type(input, 'a')

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).toBeInTheDocument()
    })

    fireEvent.keyDown(input, { key: 'Escape' })

    await waitFor(() => {
      const buttons = screen.queryAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).not.toBeDefined()
    })
  })

  it('should highlight matching text in suggestions', async () => {
    render(
      <SearchAutocomplete
        value="ap"
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    )

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.focus(input)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const appleButton = buttons.find(btn => btn.textContent?.includes('Apple'))
      expect(appleButton).toBeInTheDocument()
      
      const mark = appleButton?.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark?.textContent).toBe('Ap')
    })
  })

  it('should limit suggestions to 10', () => {
    const manySuggestions = Array.from({ length: 15 }, (_, i) => `Item ${i}`)
    
    render(
      <SearchAutocomplete
        value="Item"
        onChange={mockOnChange}
        suggestions={manySuggestions}
      />
    )

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.focus(input)

    const suggestions = screen.queryAllByRole('button')
    expect(suggestions.length).toBeLessThanOrEqual(10)
  })
})

