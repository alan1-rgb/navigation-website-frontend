import { useQuery } from 'react-query';
import { Eye, TrendingUp, Star, Globe } from 'lucide-react';
import { sitesAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import { getFaviconUrl, handleFaviconError } from '../../utils/favicon';

export default function Analytics() {
  // 获取热门网站
  const { data: popularSites } = useQuery(
    'popular-sites',
    () => sitesAPI.getPopular()
  );

  // 获取分类统计
  const { data: categories } = useQuery(
    'categories-with-count',
    () => categoriesAPI.getAllWithCount()
  );

  // 获取最新网站
  const { data: recentSites } = useQuery(
    'recent-sites',
    () => sitesAPI.getAll({ page: 1, limit: 5 })
  );

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600 dark:text-purple-400" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentSites?.pagination?.total || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">总网站数</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories?.data?.length || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">分类数量</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {popularSites?.data?.reduce((sum, site) => sum + site.click_count, 0) || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">总点击量</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((popularSites?.data?.reduce((sum, site) => sum + site.click_count, 0) || 0) / (popularSites?.data?.length || 1))}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">平均点击量</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门网站 */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">热门网站</h3>
          {popularSites?.data ? (
            <div className="space-y-3">
              {popularSites.data.slice(0, 5).map((site, index) => (
                <div key={site.id} className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-purple-900/30 text-blue-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <img
                    src={getFaviconUrl(site.url, site.favicon_url, 16)}
                    alt=""
                    className="w-4 h-4 rounded"
                    onError={handleFaviconError}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {site.title}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="w-3 h-3 mr-1" />
                    {site.click_count.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>

        {/* 分类统计 */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分类统计</h3>
          {categories?.data ? (
            <div className="space-y-3">
              {categories.data.slice(0, 5).map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.site_count || 0} 个网站
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>

      {/* 最新添加的网站 */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">最新添加</h3>
        {recentSites?.data ? (
          <div className="space-y-3">
            {recentSites.data.slice(0, 5).map((site) => (
              <div key={site.id} className="flex items-center space-x-3">
                <img
                  src={getFaviconUrl(site.url, site.favicon_url, 16)}
                  alt=""
                  className="w-4 h-4 rounded"
                  onError={handleFaviconError}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {site.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {site.description}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(site.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
} 