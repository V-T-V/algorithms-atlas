// =============================================================================
// 主题切换（深色/浅色）
// 通过设置 data-theme 属性切换 CSS 变量集。记住用户偏好。
// =============================================================================

const THEME_KEY = 'atlas:theme';

type Theme = 'dark' | 'light';

/** 获取当前主题。 */
export function getTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  // 默认跟随系统
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** 设置主题。 */
export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

/** 切换主题。 */
export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/** 初始化主题（页面加载时调用）。 */
export function initTheme(): void {
  setTheme(getTheme());
}
