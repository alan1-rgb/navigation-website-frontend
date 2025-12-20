import { ExternalLink, Eye, Tag } from 'lucide-react';
import { Site } from '../types';
import { sitesAPI } from '../services/api';
import { getFaviconUrl, handleFaviconError } from '../utils/favicon';

interface SiteCardProps {
  site: Site;
}

export default function SiteCard({ site }: SiteCardProps) {
  const handleClick = async () => {
    try {
      await sitesAPI.incrementClick(site.id);
      window.open(site.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Still open the link even if click tracking fails
      window.open(site.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card group cursor-pointer" onClick={handleClick}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={getFaviconUrl(site.url, site.favicon_url)}
              alt={`${site.title} favicon`}
              className="w-8 h-8 rounded-sm flex-shrink-0"
              onError={handleFaviconError}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-purple-400 transition-colors">
                {site.title}
              </h3>
              {site.category_name && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{site.category_name}</span>
              )}
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
        </div>

        {/* Description */}
        {site.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {site.description}
          </p>
        )}

        {/* Tags */}
        {site.tags && site.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {site.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {site.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{site.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{site.click_count.toLocaleString()} 次访问</span>
          </div>
          <div>
            {new Date(site.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
} 