import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center items-center px-4 transition-colors duration-200">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-purple-400 opacity-50 transition-colors duration-200">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">页面未找到</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-200">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
            请检查URL是否正确，或使用下面的链接返回首页。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn-primary flex items-center space-x-2 justify-center"
          >
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center space-x-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回上页</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white dark:bg-dark-800 rounded-lg shadow-sm dark:shadow-purple-500/10 max-w-md mx-auto border border-transparent dark:border-dark-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">需要帮助？</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 transition-colors duration-200">
            <li>• 尝试使用顶部搜索栏查找内容</li>
            <li>• 浏览我们的网站分类</li>
            <li>• 查看热门网站推荐</li>
            <li>• 如果问题持续存在，请联系我们</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 