'use client'

export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded flex-1" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg p-4 animate-pulse"
        >
          <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-16" />
            <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-16" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-full" />
        </div>
      ))}
    </div>
  )
}

