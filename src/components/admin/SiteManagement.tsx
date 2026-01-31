import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Edit, Trash2, ExternalLink, Eye, Search } from 'lucide-react';
import { sitesAPI } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import { getFaviconUrl, handleFaviconError } from '../../utils/favicon';
import toast from 'react-hot-toast';
import { Site } from '../../types';

interface SiteManagementProps {
  onEdit: (site: Site) => void;
}

export default function SiteManagement({ onEdit }: SiteManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['admin-sites', currentPage],
    () => sitesAPI.getAll({ page: currentPage, limit: 10 }),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation(sitesAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-sites');
      toast.success('网站删除成功');
    },
    onError: () => {
      toast.error('删除失败');
    }
  });

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`确定要删除 "${title}" 吗？`)) {
      deleteMutation.mutate(id);
    }
  };

  // 客户端搜索过滤
  const filteredSites = useMemo(() => {
    const sites = data?.data || [];
    if (!searchQuery.trim()) {
      return sites;
    }
    const query = searchQuery.toLowerCase();
    return sites.filter(site =>
      site.title.toLowerCase().includes(query) ||
      site.description?.toLowerCase().includes(query) ||
      site.url.toLowerCase().includes(query) ||
      site.category_name?.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

      if (error) {
      return (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          加载失败，请重试
        </div>
      );
    }

  const pagination = data?.pagination;

  return (
    <div>
      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索网站标题、描述、URL或分类..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            找到 {filteredSites.length} 个结果
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                网站信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                点击量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {filteredSites.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? '没有找到匹配的网站' : '暂无网站数据'}
                </td>
              </tr>
            ) : (
              filteredSites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={getFaviconUrl(site.url, site.favicon_url)}
                      alt=""
                      className="w-8 h-8 rounded mr-3"
                      onError={handleFaviconError}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {site.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {site.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-purple-900/30 text-blue-800 dark:text-purple-300">
                    {site.category_name || '未分类'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <Eye className="w-4 h-4 mr-1" />
                    {site.click_count.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(site.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(site.url, '_blank')}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                      title="访问网站"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(site)}
                      className="text-blue-600 dark:text-purple-400 hover:text-blue-900 dark:hover:text-purple-300 transition-colors duration-200"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(site.id, site.title)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                      title="删除"
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination - 搜索时隐藏 */}
      {!searchQuery && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            显示 {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}
            {' '}/ {pagination.total} 个结果
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              上一页
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {(() => {
                const pages = [];
                const totalPages = pagination.totalPages;
                const currentPage = pagination.page;

                // 始终显示第一页
                if (totalPages > 0) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === 1
                          ? 'bg-primary-600 dark:bg-purple-600 text-white'
                          : 'border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      1
                    </button>
                  );
                }

                // 显示省略号
                if (currentPage > 3) {
                  pages.push(
                    <span key="ellipsis-start" className="px-2 py-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  );
                }

                // 显示当前页附近的页码
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === i
                          ? 'bg-primary-600 dark:bg-purple-600 text-white'
                          : 'border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // 显示省略号
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2 py-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  );
                }

                // 始终显示最后一页
                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === totalPages
                          ? 'bg-primary-600 dark:bg-purple-600 text-white'
                          : 'border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 