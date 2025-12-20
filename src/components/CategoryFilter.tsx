import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: number;
  onCategorySelect: (categoryId?: number) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">浏览分类</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === undefined
              ? 'bg-primary-600 dark:bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
              selectedCategory === category.id
                ? 'bg-primary-600 dark:bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
            }`}
          >
            {category.icon && <span>{category.icon}</span>}
            <span>{category.name}</span>
            {category.site_count !== undefined && (
              <span className={`text-xs ${
                selectedCategory === category.id 
                  ? 'text-primary-100 dark:text-purple-100' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                ({category.site_count})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 