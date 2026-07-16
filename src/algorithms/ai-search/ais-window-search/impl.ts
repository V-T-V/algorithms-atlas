// 窗口搜索 · 实现
export interface WNode {
  id: string;
  utility?: number;
  children?: WNode[];
}
export interface WindowSearchHooks {
  onTry?: (alpha: number, beta: number) => void;
  onFail?: (bound: 'low' | 'high', value: number) => void;
  onHit?: (value: number) => void;
}
function alphaBeta(n: WNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  for (const c of n.children) {
    const v = -alphaBeta(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
/**
 * 窗口搜索。
 * @param guess 预估值
 * @param window 半窗口宽度
 */
export function windowSearch(
  root: WNode,
  guess: number,
  window: number,
  depth: number,
  hooks: WindowSearchHooks = {},
): number {
  const alpha = guess - window;
  const beta = guess + window;
  hooks.onTry?.(alpha, beta);
  const val = alphaBeta(root, alpha, beta, depth);
  if (val <= alpha) {
    hooks.onFail?.('low', val);
    const full = alphaBeta(root, -Infinity, Infinity, depth);
    hooks.onHit?.(full);
    return full;
  }
  if (val >= beta) {
    hooks.onFail?.('high', val);
    const full = alphaBeta(root, -Infinity, Infinity, depth);
    hooks.onHit?.(full);
    return full;
  }
  hooks.onHit?.(val);
  return val;
}
