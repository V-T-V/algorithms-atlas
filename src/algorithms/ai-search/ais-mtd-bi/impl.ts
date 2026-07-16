// MTD(bi) · 实现
export interface BiNode {
  id: string;
  utility?: number;
  children?: BiNode[];
}
export interface MtdBiHooks {
  onTest?: (beta: number, value: number, bound: 'lower' | 'upper') => void;
  onConverge?: (value: number, iterations: number) => void;
}
function alphaBeta(n: BiNode, alpha: number, beta: number, depth: number): number {
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
export function mtdBi(
  root: BiNode,
  f: number,
  depth: number,
  maxIter = 64,
  hooks: MtdBiHooks = {},
): number {
  let g = f;
  let upper = Infinity;
  let lower = -Infinity;
  let i = 0;
  do {
    i++;
    const beta = g === lower ? lower + 1 : g;
    const t = alphaBeta(root, beta - 1, beta, depth);
    if (t < beta) {
      upper = t;
      hooks.onTest?.(beta, t, 'upper');
    } else {
      lower = t;
      hooks.onTest?.(beta, t, 'lower');
    }
    g = upper === Infinity ? lower : lower === -Infinity ? upper : (upper + lower) / 2;
  } while (lower < upper && i < maxIter);
  hooks.onConverge?.(g, i);
  return g;
}
