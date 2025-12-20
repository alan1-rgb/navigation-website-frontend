import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { sitesAPI, categoriesAPI } from '../services/api';
import SiteCard from '../components/SiteCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchResults from '../components/SearchResults';
import LoadingSpinner, { SiteGridSkeleton, CategoryFilterSkeleton } from '../components/LoadingSpinner';
import { SearchFilters } from '../types';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  
  // Initialize filters from URL params immediately
  const initialFilters = useMemo(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    return {
      page: 1,
      limit: 20,
      keyword: search || undefined,
      category: category ? parseInt(category) : undefined,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Update filters when URL changes
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    setFilters(prev => ({
      ...prev,
      keyword: search || undefined,
      category: category ? parseInt(category) : undefined,
      page: 1
    }));
  }, [searchParams]);

  // Determine if we should show search results or popular sites
  const showSearchResults = !!(filters.keyword || filters.category);

  // Fetch sites (for search results)
  const { data: sitesData, isLoading: sitesLoading, error: sitesError } = useQuery(
    ['sites', filters],
    () => sitesAPI.getAll(filters),
    {
      keepPreviousData: true,
      enabled: showSearchResults, // Only fetch when needed
    }
  );

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    'categories',
    () => categoriesAPI.getAllWithCount(),
    {
      staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    }
  );

  // Fetch popular sites (for homepage)
  const { data: popularData, isLoading: popularLoading } = useQuery(
    'popular-sites',
    () => sitesAPI.getPopular(),
    {
      enabled: !showSearchResults, // Only fetch when needed
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Calculate loading states
  const isInitialLoad = categoriesLoading && !categoriesData;
  const isContentLoading = showSearchResults ? sitesLoading : popularLoading;

  if (sitesError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">加载失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  const sites = sitesData?.data || [];
  const pagination = sitesData?.pagination;
  const categories = categoriesData?.data || [];
  const popularSites = popularData?.data || [];

  const displaySites = showSearchResults ? sites : popularSites;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {!showSearchResults && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            发现最优质的
            <span className="text-primary-600 dark:text-purple-400">网站资源</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-200">
            精心收集互联网上最实用的工具、资源和服务，帮助您提高工作效率
          </p>
        </div>
      )}

      {/* Categories */}
      {isInitialLoad ? (
        <CategoryFilterSkeleton />
      ) : categories.length > 0 ? (
        <CategoryFilter
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={(categoryId) => handleFilterChange({ category: categoryId })}
        />
      ) : null}

      {/* Search Results or Popular Sites */}
      {showSearchResults ? (
        <SearchResults
          sites={sites}
          pagination={pagination}
          isLoading={isContentLoading}
          searchQuery={filters.keyword}
          selectedCategory={filters.category}
          onPageChange={handlePageChange}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">热门网站</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              基于点击量排序
            </span>
          </div>

          {isContentLoading ? (
            <SiteGridSkeleton count={8} />
          ) : displaySites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displaySites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">暂无网站数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 