// =============================================================================
// 主变搜索 PVS（Principal Variation Search）· 纯算法实现
// 第一个子用全窗，其余用零窗口探测，失败才重搜。
// =============================================================================

export interface PvsNode {
  id: string;
  utility?: number;
  children?: PvsNode[];
  value?: number;
  /** 是否触发过重搜（统计用）。 */
  researched?: boolean;
}

export interface PvsHooks {
  onEnter?: (node: PvsNode, alpha: number, beta: number, depth: number) => void;
  onEvaluate?: (node: PvsNode, score: number, depth: number) => void;
  onScout?: (node: PvsNode, childIndex: number, depth: number) => void;
  onResearch?: (node: PvsNode, childIndex: number, depth: number) => void;
  onReturn?: (node: PvsNode, value: number, depth: number) => void;
}

/**
 * PVS（fail-soft）。返回「站当前玩家视角」的最佳值。
 */
export function pvs(
  node: PvsNode,
  depth: number,
  alpha: number,
  beta: number,
  hooks: PvsHooks = {},
): number {
  hooks.onEnter?.(node, alpha, beta, depth);

  if (node.children === undefined || node.children.length === 0 || depth === 0) {
    const score = node.utility ?? 0;
    node.value = score;
    hooks.onEvaluate?.(node, score, depth);
    return score;
  }

  const children = node.children;
  let a = alpha;
  let best = -Infinity;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    let score: number;
    if (i === 0) {
      // 第一个：完整窗口
      score = -pvs(child, depth - 1, -beta, -a, hooks);
    } else {
      // 零窗口探测
      hooks.onScout?.(node, i, depth);
      score = -pvs(child, depth - 1, -a - 1, -a, hooks);
      if (a < score && score < beta) {
        // 探测失败：重搜完整窗口
        node.researched = true;
        hooks.onResearch?.(node, i, depth);
        score = -pvs(child, depth - 1, -beta, -score, hooks);
      }
    }
    if (score > best) best = score;
    if (best > a) a = best;
    if (a >= beta) break; // β 剪枝
  }

  node.value = best;
  hooks.onReturn?.(node, best, depth);
  return best;
}

/** 普通 α-β（无 PVS），用于结果对照。 */
export function alphaBetaRef(node: PvsNode, depth: number, alpha: number, beta: number): number {
  if (node.children === undefined || node.children.length === 0 || depth === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (const child of node.children) {
    const v = -alphaBetaRef(child, depth - 1, -beta, -a);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

// —— 构建示例博弈树 ——

export function buildTree(utilities: number[], branching: number): PvsNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): PvsNode => {
    const id = `p${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: PvsNode[] = [];
    for (let k = 0; k < branching; k++) children.push(make(depth - 1));
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
