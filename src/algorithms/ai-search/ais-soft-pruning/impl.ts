// 软剪枝 · 实现
export interface SPNode {
  id: string;
  utility?: number;
  children?: SPNode[];
}
export interface SoftHooks {
  onSoftBound?: (bound: 'low' | 'high', value: number) => void;
  onHardCut?: (nodeId: string) => void;
  onResult?: (value: number) => void;
}
/** 软剪枝 alpha-beta：硬阈值外剪枝，软阈值内继续搜索但记录软界。 */
export function softAlphaBeta(
  n: SPNode,
  alpha: number,
  beta: number,
  slack: number,
  depth: number,
  hooks: SoftHooks = {},
): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  const hardAlpha = alpha - slack;
  const hardBeta = beta + slack;
  for (const c of n.children) {
    const v = -softAlphaBeta(c, -beta, -alpha, slack, depth - 1, hooks);
    if (v > best) best = v;
    if (best > alpha) {
      alpha = best;
      if (best >= beta) {
        if (best < hardBeta) hooks.onSoftBound?.('high', best);
        else hooks.onHardCut?.(c.id);
        if (best >= hardBeta) break;
      }
    } else if (best <= alpha && best > hardAlpha) {
      hooks.onSoftBound?.('low', best);
    }
  }
  return best;
}
export function softSearch(
  root: SPNode,
  slack: number,
  depth: number,
  hooks: SoftHooks = {},
): number {
  const v = softAlphaBeta(root, -Infinity, Infinity, slack, depth, hooks);
  hooks.onResult?.(v);
  return v;
}
