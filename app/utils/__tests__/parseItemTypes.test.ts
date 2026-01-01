function parseItemTypes(itemTypes: string): string[] {
  if (!itemTypes) return []
  return itemTypes.split(',').map(t => t.trim().toUpperCase())
}

describe('parseItemTypes', () => {
  it('parseItemTypes_WhenCommaSeparated_ReturnsArray', () => {
    // Arrange
    const input = 'SWORD,AXE,BOW'

    // Act
    const result = parseItemTypes(input)

    // Assert
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })

  it('parseItemTypes_WhenEmptyString_ReturnsEmptyArray', () => {
    // Arrange
    const input = ''

    // Act
    const result = parseItemTypes(input)

    // Assert
    expect(result).toEqual([])
  })

  it('parseItemTypes_WhenHasSpaces_TrimsAndUppercases', () => {
    // Arrange
    const input = 'sword, axe, bow'

    // Act
    const result = parseItemTypes(input)

    // Assert
    expect(result).toEqual(['SWORD', 'AXE', 'BOW'])
  })
})
