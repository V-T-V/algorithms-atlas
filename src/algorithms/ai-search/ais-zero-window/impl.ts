// 零窗口搜索 · 实现
export interface ZNode {
  id: string;
  utility?: number;
  children?: ZNode[];
}
export interface ZeroWindowHooks {
  onTest?: (beta: number, value: number) => void;
  onBound?: (bound: 'lower' | 'upper', value: number) => void;
}
function ab(n: ZNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  for (const c of n.children) {
    const v = -ab(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
/** 零窗口测试：返回 >= beta 为下界，< beta 为上界。 */
export function zeroWindow(
  root: ZNode,
  beta: number,
  depth: number,
  hooks: ZeroWindowHooks = {},
): { value: number; bound: 'lower' | 'upper' } {
  const t = ab(root, beta - 1, beta, depth);
  hooks.onTest?.(beta, t);
  if (t >= beta) {
    hooks.onBound?.('lower', t);
    return { value: t, bound: 'lower' };
  }
  hooks.onBound?.('upper', t);
  return { value: t, bound: 'upper' };
}
