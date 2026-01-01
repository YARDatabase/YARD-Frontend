'use client'

interface ToggleableListProps {
  items: string[]
  selectedItems: string[]
  onToggle: (item: string) => void
  label: string
  displayTransform?: (item: string) => string
}

// renders a list of items that can be toggled on or off with checkboxes
export default function ToggleableList({
  items,
  selectedItems,
  onToggle,
  label,
  displayTransform = (item) => item
}: ToggleableListProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-white/60 mb-2">
        {label}
      </label>
      <div className="border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#1E1E1E] p-2 max-h-48 overflow-y-auto">
        <div className="space-y-1">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggle(item)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    : 'text-gray-700 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
                      : 'border-gray-300 dark:border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{displayTransform(item)}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

