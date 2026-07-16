// 带移动排序的迭代加深 · 实现

export interface Id2Node {
  id: string;
  utility?: number; // 叶子效用（站当前玩家视角）
  children?: Id2Node[];
}

export interface Id2Hooks {
  onDepthStart?: (depth: number) => void;
  onDepthEnd?: (depth: number, value: number, nodes: number) => void;
  onBestMove?: (nodeId: string, childIdx: number) => void;
}

export interface Id2Result {
  score: number;
  bestChildId: string | null;
  nodesVisited: number;
}

/** 深度受限 negamax + alpha-beta，使用 bestMoveTable 排序。 */
export function iterativeDeepeningOrdered(
  root: Id2Node,
  maxDepth: number,
  hooks: Id2Hooks = {},
): Id2Result {
  // 每个节点 id -> 上一轮最佳子节点 id
  const bestMoveTable = new Map<string, string>();
  let totalNodes = 0;
  let lastScore = 0;
  let bestChildId: string | null = null;

  const negamax = (node: Id2Node, depth: number, alpha: number, beta: number): number => {
    totalNodes++;
    if (depth === 0 || !node.children || node.children.length === 0) {
      return node.utility ?? 0;
    }
    // 排序：bestMoveTable 中的最佳子优先
    const childList = [...node.children];
    const best = bestMoveTable.get(node.id);
    if (best !== undefined) {
      childList.sort((a, b) => (a.id === best ? -1 : b.id === best ? 1 : 0));
    }
    let bestVal = -Infinity;
    let bestId: string | null = null;
    for (const child of childList) {
      const v = -negamax(child, depth - 1, -beta, -alpha);
      if (v > bestVal) {
        bestVal = v;
        bestId = child.id;
      }
      if (v > alpha) alpha = v;
      if (alpha >= beta) break; // 剪枝
    }
    if (bestId !== null) {
      bestMoveTable.set(node.id, bestId);
      hooks.onBestMove?.(
        node.id,
        node.children.findIndex((c) => c.id === bestId),
      );
    }
    return bestVal;
  };

  for (let d = 1; d <= maxDepth; d++) {
    hooks.onDepthStart?.(d);
    totalNodes = 0;
    lastScore = negamax(root, d, -Infinity, Infinity);
    // 根的最佳子
    const rootBest = bestMoveTable.get(root.id);
    bestChildId = rootBest ?? null;
    hooks.onDepthEnd?.(d, lastScore, totalNodes);
  }
  return { score: lastScore, bestChildId, nodesVisited: totalNodes };
}
