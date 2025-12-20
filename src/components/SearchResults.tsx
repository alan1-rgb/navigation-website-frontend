import { Site, PaginationInfo } from '../types';
import SiteCard from './SiteCard';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

interface SearchResultsProps {
  sites: Site[];
  pagination?: PaginationInfo;
  isLoading: boolean;
  searchQuery?: string;
  selectedCategory?: number;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  sites,
  pagination,
  isLoading,
  searchQuery,
  selectedCategory,
  onPageChange
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          搜索结果
        </h2>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {searchQuery && `关键词: "${searchQuery}"`}
          {searchQuery && selectedCategory && ' • '}
          {selectedCategory && `分类过滤已应用`}
          {pagination && (
            <span className="ml-2">
              共找到 {pagination.total} 个结果
            </span>
          )}
        </p>
      </div>

      {/* Results Grid */}
      {sites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
            没有找到相关结果
          </h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
            尝试调整搜索条件或浏览其他分类
          </p>
        </div>
      )}
    </div>
  );
} 