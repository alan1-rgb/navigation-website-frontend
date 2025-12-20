import { useState } from 'react';
import { useQuery } from 'react-query';
import { Plus, Settings, BarChart3 } from 'lucide-react';
import { sitesAPI, categoriesAPI } from '../services/api';
import SiteManagement from '../components/admin/SiteManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import Analytics from '../components/admin/Analytics';
import AddSiteModal from '../components/admin/AddSiteModal';

type TabType = 'sites' | 'categories' | 'analytics';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sites');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch data for overview
  const { data: sitesData } = useQuery('admin-sites', () => 
    sitesAPI.getAll({ limit: 100 })
  );
  
  const { data: categoriesData } = useQuery('admin-categories', () => 
    categoriesAPI.getAllWithCount()
  );

  const sites = sitesData?.data || [];
  const categories = categoriesData?.data || [];
  const totalSites = sites.length;
  const totalCategories = categories.length;

  const tabs = [
    {
      id: 'sites' as TabType,
      name: '网站管理',
      icon: Settings,
      count: totalSites
    },
    {
      id: 'categories' as TabType,
      name: '分类管理',
      icon: Settings,
      count: totalCategories
    },
    {
      id: 'analytics' as TabType,
      name: '数据分析',
      icon: BarChart3
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">管理后台</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">管理网站内容和分类</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>添加网站</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-purple-500/10 p-6 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-purple-900/30 rounded-lg">
              <Settings className="w-6 h-6 text-primary-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总网站数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-purple-500/10 p-6 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">分类数量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-purple-500/10 p-6 border border-transparent dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总点击量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sites.reduce((total, site) => total + site.click_count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-purple-500/10 border border-transparent dark:border-dark-700 transition-colors duration-200">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 dark:border-purple-500 text-primary-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'sites' && <SiteManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
        />
      )}
    </div>
  );
} 