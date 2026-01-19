import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { X, Plus } from 'lucide-react';
import { sitesAPI } from '../../services/api';
import { Category, Site } from '../../types';
import toast from 'react-hot-toast';

interface EditSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  site: Site | null;
}

export default function EditSiteModal({ isOpen, onClose, categories, site }: EditSiteModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const queryClient = useQueryClient();

  // 当 site 改变时，更新 tags
  useEffect(() => {
    if (site) {
      setTags(site.tags || []);
    } else {
      setTags([]);
    }
  }, [site]);

  const mutation = useMutation(
    (data: { id: number; updateData: any }) => sitesAPI.update(data.id, data.updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sites']);
        queryClient.invalidateQueries(['admin-sites']);
        toast.success('网站更新成功');
        onClose();
      },
      onError: () => {
        toast.error('更新失败');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!site) return;

    const formData = new FormData(e.target as HTMLFormElement);

    const updateData = {
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      description: formData.get('description') as string || undefined,
      category_id: formData.get('category_id') ? parseInt(formData.get('category_id') as string) : undefined,
      tags: tags
    };

    mutation.mutate({ id: site.id, updateData });
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen || !site) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-dark-700 transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">编辑网站</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              网站名称 *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={site.title}
              className="input"
              placeholder="输入网站名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              网站URL *
            </label>
            <input
              type="url"
              name="url"
              required
              defaultValue={site.url}
              className="input"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              描述
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={site.description || ''}
              className="input resize-none"
              placeholder="简要描述这个网站..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              分类
            </label>
            <select name="category_id" className="input" defaultValue={site.category_id || ''}>
              <option value="">选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              标签
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-purple-900/30 text-blue-800 dark:text-purple-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 dark:text-purple-400 hover:text-blue-800 dark:hover:text-purple-300 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1"
                placeholder="输入标签后按回车"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>添加</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="btn-primary flex-1"
            >
              {mutation.isLoading ? '更新中...' : '更新网站'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
