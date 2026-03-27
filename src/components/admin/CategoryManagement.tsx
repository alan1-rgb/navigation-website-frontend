import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categoriesAPI } from '../../services/api';
import { Category } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';

export default function CategoryManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    'admin-categories',
    () => categoriesAPI.getAllWithCount()
  );

  const createMutation = useMutation(categoriesAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      setShowAddForm(false);
      toast.success('分类创建成功');
    },
    onError: () => {
      toast.error('创建失败');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<Omit<Category, 'id'>> }) => categoriesAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        setEditingCategory(null);
        toast.success('分类更新成功');
      },
      onError: () => {
        toast.error('更新失败');
      }
    }
  );

  const deleteMutation = useMutation(categoriesAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      toast.success('分类删除成功');
    },
    onError: () => {
      toast.error('删除失败');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      sort_order: parseInt(formData.get('sort_order') as string) || 0
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`确定要删除分类 "${name}" 吗？`)) {
      deleteMutation.mutate(id);
    }
  };

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

  const categories = data?.data || [];

  return (
    <div>
      {/* Add/Edit Form */}
      {(showAddForm || editingCategory) && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-200">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-200">
            {editingCategory ? '编辑分类' : '添加分类'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="分类名称"
              defaultValue={editingCategory?.name}
              required
              className="input"
            />
            <input
              type="text"
              name="icon"
              placeholder="图标 (如: 🛠️)"
              defaultValue={editingCategory?.icon}
              className="input"
            />
            <input
              type="number"
              name="sort_order"
              placeholder="排序"
              defaultValue={editingCategory?.sort_order}
              className="input"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="btn-primary"
              >
                {editingCategory ? '更新' : '添加'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCategory(null);
                }}
                className="btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!showAddForm && !editingCategory && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>添加分类</span>
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-purple-500/10 overflow-hidden border border-transparent dark:border-dark-700 transition-colors duration-200">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                分类信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                网站数量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                排序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
            {categories.map((category: Category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.icon && (
                      <span className="text-2xl mr-3">{category.icon}</span>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {category.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-purple-900/30 text-blue-800 dark:text-purple-300">
                    {category.site_count} 个网站
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {category.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-600 dark:text-purple-400 hover:text-blue-900 dark:hover:text-purple-300 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                      disabled={category.site_count > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 