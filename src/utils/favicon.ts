/**
 * Favicon处理工具函数
 */

// 默认favicon SVG数据URL
export const DEFAULT_FAVICON_SVG = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="4" fill="#f3f4f6"/>
    <path d="M8 8h16v16H8z" fill="#d1d5db"/>
    <circle cx="16" cy="16" r="4" fill="#9ca3af"/>
  </svg>
`)}`;

/**
 * 获取网站favicon URL
 * @param url 网站URL
 * @param faviconUrl 自定义favicon URL
 * @param size 图标大小，默认32
 * @returns favicon URL
 */
export function getFaviconUrl(url: string, faviconUrl?: string, size: number = 32): string {
  // 如果有自定义favicon，直接使用
  if (faviconUrl) return faviconUrl;
  
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return DEFAULT_FAVICON_SVG;
  }
}

/**
 * 处理图片加载失败的错误
 * @param event 错误事件
 */
export function handleFaviconError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const target = event.target as HTMLImageElement;
  
  // 如果已经是默认图标还是失败，则不再尝试
  if (target.src === DEFAULT_FAVICON_SVG) return;
  
  // 设置为默认图标
  target.src = DEFAULT_FAVICON_SVG;
} 