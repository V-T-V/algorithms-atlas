// =============================================================================
// 浏览历史 + 收藏管理（localStorage 持久化）
// =============================================================================

const HISTORY_KEY = 'atlas:history';
const FAV_KEY = 'atlas:favorites';
const MAX_HISTORY = 30;

/** 记录浏览过的算法 id（最新在前）。 */
export function recordVisit(id: string): void {
  const history = getHistory().filter((x) => x !== id);
  history.unshift(id);
  setHistory(history.slice(0, MAX_HISTORY));
}

/** 获取浏览历史。 */
export function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function setHistory(ids: string[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota errors
  }
}

/** 切换收藏状态。返回新的收藏状态。 */
export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setFavorites(favs);
    return false;
  }
  favs.push(id);
  setFavorites(favs);
  return true;
}

/** 获取收藏列表。 */
export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function setFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/** 检查是否已收藏。 */
export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}
