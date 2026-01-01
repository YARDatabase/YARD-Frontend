function parseItemTypes(itemTypes: string): string[] {
  if (!itemTypes) return []
  return itemTypes.split(',').map(t => t.trim().toUpperCase())
}

describe('parseItemTypes', () => {
  it('should parse comma-separated item types', () => {
    const result = parseItemTypes('SWORD,AXE,BOW')
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })

  it('should handle spaces around commas', () => {
    const result = parseItemTypes('SWORD, AXE, BOW')
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })

  it('should convert to uppercase', () => {
    const result = parseItemTypes('sword,axe,bow')
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })

  it('should handle single item type', () => {
    const result = parseItemTypes('SWORD')
    expect(result).toEqual(['SWORD'])
  })

  it('should handle empty string', () => {
    const result = parseItemTypes('')
    expect(result).toEqual([])
  })

  it('should handle null/undefined', () => {
    const result = parseItemTypes(null as any)
    expect(result).toEqual([])
  })

  it('should trim whitespace', () => {
    const result = parseItemTypes(' SWORD , AXE , BOW ')
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })
})

