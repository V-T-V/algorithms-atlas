// =============================================================================
// 极简 hash 路由器
//   空哈希      → 画廊首页（Lobby）
//   #/<id>      → 单个算法演示（id 即 AlgorithmMeta.id，全局唯一）
// 复用 kids-games 的范式，无依赖。
// =============================================================================

export interface Route {
  /** 'lobby' | 'algorithm' | 'solve' */
  view: 'lobby' | 'algorithm' | 'solve';
  /** view === 'algorithm' 时为算法 id。 */
  id?: string;
}

const listeners = new Set<(r: Route) => void>();

function parse(): Route {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').trim();
  if (!hash) return { view: 'lobby' };
  if (hash === 'solve') return { view: 'solve' };
  return { view: 'algorithm', id: hash };
}

/** 当前路由。 */
export function currentRoute(): Route {
  return parse();
}

/** 跳转。route 为空串/undefined 回首页，否则进入对应算法。 */
export function navigate(id?: string): void {
  window.location.hash = id ? `#/${id}` : '#/';
}

/** 订阅路由变化，返回取消订阅函数。 */
export function onRoute(fn: (r: Route) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(): void {
  const r = parse();
  for (const fn of listeners) fn(r);
}

/** 初始化：监听 hashchange，并立即触发一次。 */
export function initRouter(): void {
  window.addEventListener('hashchange', emit);
  emit();
}
