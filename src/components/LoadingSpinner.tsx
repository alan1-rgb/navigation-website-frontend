interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );
}

// Skeleton components for better loading experience
export function SiteCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-200 dark:border-dark-700 p-6 animate-pulse transition-colors duration-200">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gray-300 dark:bg-dark-600 rounded"></div>
        <div className="ml-3 h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-2/3"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function SiteGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SiteCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryFilterSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-10 bg-gray-300 dark:bg-dark-600 rounded-full w-20 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
} 