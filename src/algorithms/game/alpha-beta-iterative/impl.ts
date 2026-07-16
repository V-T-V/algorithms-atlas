// =============================================================================
// 迭代加深 Alpha-Beta · 纯算法实现
// 逐层加深，每层用 alpha-beta 剪枝。用确定性叶子估值函数生成演示博弈树。
// =============================================================================

/** 博弈树节点。 */
export interface IdabNode {
  id: string;
  value?: number; // 叶子效用
  children: IdabNode[];
}

/** 单层搜索结果。 */
export interface IterationResult {
  depth: number;
  /** 根效用值。 */
  value: number;
  /** 最优走子（根节点的子节点 id）。 */
  bestChildId: string | null;
  /** 本层剪枝次数。 */
  prunes: number;
  /** 本层实际求值的叶子数。 */
  nodesVisited: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface AlphaBetaIterativeHooks {
  /** 开始某一深度层搜索。 */
  onIterationStart?: (depth: number) => void;
  /** 某一层搜索结束。 */
  onIterationEnd?: (depth: number, result: IterationResult) => void;
  /** 节点求值/访问。 */
  onVisit?: (nodeId: string, depth: number) => void;
  /** 剪枝事件。 */
  onPrune?: (parentId: string, prunedChildId: string) => void;
}

/**
 * 在一棵博弈树上做迭代加深 + alpha-beta。
 *
 * @param root 博弈树根（MAX 层）
 * @param maxDepth 最大深度（从 1 到 maxDepth）
 * @param hooks 可选事件钩子
 * @returns 各层结果数组
 */
export function iterativeDeepeningAlphaBeta(
  root: IdabNode,
  maxDepth: number,
  hooks: AlphaBetaIterativeHooks = {},
): IterationResult[] {
  const results: IterationResult[] = [];

  for (let d = 1; d <= maxDepth; d++) {
    hooks.onIterationStart?.(d);
    let prunes = 0;
    let nodesVisited = 0;
    let bestChildId: string | null = null;

    // 在「深度限制」下求值：到达 depthLimit 即视为叶子（用其 value 或已展开子节点的近似）
    const recurse = (
      node: IdabNode,
      alpha: number,
      beta: number,
      isMax: boolean,
      depthLimit: number,
    ): number => {
      nodesVisited++;
      hooks.onVisit?.(node.id, depthLimit);
      // 到达深度限制 或 已是叶子：用 node.value（若 undefined 则取 0）
      const isLeaf = node.children.length === 0 || depthLimit === 0;
      if (isLeaf) {
        return node.value ?? 0;
      }
      let value: number;
      if (isMax) {
        value = -Infinity;
        for (const child of node.children) {
          const cv = recurse(child, alpha, beta, false, depthLimit - 1);
          if (cv > value) {
            value = cv;
            if (node === root) bestChildId = child.id;
          }
          alpha = Math.max(alpha, value);
          if (alpha >= beta) {
            const idx = node.children.indexOf(child);
            for (let k = idx + 1; k < node.children.length; k++) {
              prunes++;
              hooks.onPrune?.(node.id, node.children[k]!.id);
            }
            break;
          }
        }
      } else {
        value = Infinity;
        for (const child of node.children) {
          const cv = recurse(child, alpha, beta, true, depthLimit - 1);
          if (cv < value) {
            value = cv;
          }
          beta = Math.min(beta, value);
          if (beta <= alpha) {
            const idx = node.children.indexOf(child);
            for (let k = idx + 1; k < node.children.length; k++) {
              prunes++;
              hooks.onPrune?.(node.id, node.children[k]!.id);
            }
            break;
          }
        }
      }
      return value;
    };

    const value = recurse(root, -Infinity, Infinity, true, d);
    const result: IterationResult = {
      depth: d,
      value,
      bestChildId,
      prunes,
      nodesVisited,
    };
    hooks.onIterationEnd?.(d, result);
    results.push(result);
  }

  return results;
}

/** 生成一棵确定性博弈树用于演示（叶子按 (id 哈希) 给定值）。 */
export function buildDemoTree(branching: number, depth: number): IdabNode {
  let counter = 0;
  const make = (d: number): IdabNode => {
    const id = `n${counter++}`;
    if (d === 0) {
      // 叶子值：用 id 的字符码和取模，得到 1..9
      const v = ((id.charCodeAt(1) + id.charCodeAt(2)) % 9) + 1;
      return { id, value: v, children: [] };
    }
    const children: IdabNode[] = [];
    for (let i = 0; i < branching; i++) children.push(make(d - 1));
    return { id, children };
  };
  return make(depth);
}
