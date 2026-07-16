// 并行 Alpha-Beta · 纯实现（事件序列模拟）
// 模拟 PV-split：先搜长子得到窗口，再并发搜剩余子节点。

export interface AbNode {
  id: string;
  utility?: number; // 叶值（negamax 语义）
  children?: AbNode[];
}

export interface ParallelAbHooks {
  onSearchChild?: (nodeId: string, worker: number) => void;
  onPvEstablished?: (alpha: number, beta: number) => void;
  onPrune?: (nodeId: string) => void;
  onResult?: (value: number) => void;
}

/** 单子树 alpha-beta（带深度限制）。 */
function alphaBeta(node: AbNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !node.children || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  for (const c of node.children) {
    const v = -alphaBeta(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/**
 * 并行 alpha-beta（PV-split 模拟）。
 * @param root 根节点
 * @param maxDepth 搜索深度
 * @param workers 并发 worker 数（>=1）
 */
export function parallelAlphaBeta(
  root: AbNode,
  maxDepth: number,
  workers: number,
  hooks: ParallelAbHooks = {},
): number {
  if (!root.children || root.children.length === 0) {
    const v = root.utility ?? 0;
    hooks.onResult?.(v);
    return v;
  }
  const w = Math.max(1, workers);
  // 根是 MAX 层；子节点用「根为 MIN」的视角做 negamax（取反），故 v = -alphaBeta(child,...)
  // 阶段 1：搜索长子，建立窗口
  const first = root.children[0]!;
  hooks.onSearchChild?.(first.id, 0);
  // alpha = first 子节点对根的贡献 = -negamax(first)
  // first 若为叶（maxDepth=1 → depth 0），alphaBeta 返回 utility，需取反使根取最大
  const isFirstLeaf = !first.children || first.children.length === 0;
  let alpha = isFirstLeaf
    ? (first.utility ?? 0)
    : -alphaBeta(first, -Infinity, Infinity, maxDepth - 1);
  const beta = Infinity;
  hooks.onPvEstablished?.(alpha, beta);

  // 阶段 2：并发搜其余子节点
  for (let i = 1; i < root.children.length; i++) {
    const child = root.children[i]!;
    const worker = i % w;
    hooks.onSearchChild?.(child.id, worker);
    const isLeaf = !child.children || child.children.length === 0;
    const v = isLeaf ? (child.utility ?? 0) : -alphaBeta(child, -beta, -alpha, maxDepth - 1);
    if (v > alpha) {
      alpha = v;
    } else {
      hooks.onPrune?.(child.id);
    }
  }
  hooks.onResult?.(alpha);
  return alpha;
}
