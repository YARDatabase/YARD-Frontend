import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('useTheme_WhenInitialized_ReturnsLightTheme', () => {
    // Arrange & Act
    const { result } = renderHook(() => useTheme())

    // Assert
    expect(result.current.theme).toBe('light')
  })

  it('useTheme_WhenToggled_SwitchesTheme', () => {
    // Arrange
    const { result } = renderHook(() => useTheme())

    // Act
    act(() => {
      result.current.toggleTheme()
    })

    // Assert
    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.getItem('theme')).toBe('dark')
  })

  it('useTheme_WhenLocalStorageHasTheme_LoadsTheme', () => {
    // Arrange
    localStorageMock.setItem('theme', 'dark')

    // Act
    const { result } = renderHook(() => useTheme())

    // Assert
    expect(result.current.theme).toBe('dark')
  })
})
