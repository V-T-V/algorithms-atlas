// =============================================================================
// Negascout / Principal Variation Search · 纯算法实现
// 在通用数值博弈树上工作。叶子带静态效用值，内部节点的值 = 站在当前玩家视角。
// 与 alpha-beta（fail-soft）等价，但通过零窗口加速。
// =============================================================================

/** 博弈树节点：叶子有 utility（站在当前玩家视角），内部节点有 children。 */
export interface SearchNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。内部节点可为 undefined。 */
  utility?: number;
  children?: SearchNode[];
  /** 搜索完成后填充的值。 */
  value?: number;
  /** 是否触发了 re-search（用于统计）。 */
  researched?: boolean;
}

export interface NegascoutHooks {
  /** 进入某节点开始搜索。 */
  onEnter?: (node: SearchNode, alpha: number, beta: number, depth: number) => void;
  /** 叶子估值。 */
  onEvaluate?: (node: SearchNode, score: number, depth: number) => void;
  /** 零窗口探测失败、触发重搜。 */
  onResearch?: (node: SearchNode, depth: number) => void;
  /** 节点返回最终值。 */
  onReturn?: (node: SearchNode, value: number, alpha: number, beta: number, depth: number) => void;
}

/**
 * Negascout 主函数（fail-soft）。返回「站当前玩家视角」的最佳值。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param alpha 下界
 * @param beta 上界
 * @param hooks 钩子
 */
export function negascout(
  node: SearchNode,
  depth: number,
  alpha: number,
  beta: number,
  hooks: NegascoutHooks = {},
): number {
  hooks.onEnter?.(node, alpha, beta, depth);

  // 叶子或深度耗尽
  if (node.children === undefined || node.children.length === 0 || depth === 0) {
    const score = node.utility ?? 0;
    node.value = score;
    hooks.onEvaluate?.(node, score, depth);
    return score;
  }

  const children = node.children;
  let alphaLocal = alpha;
  let best = -Infinity;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    let score: number;
    if (i === 0) {
      // 第一个子：完整窗口（假设在主线上）
      score = -negascout(child, depth - 1, -beta, -alphaLocal, hooks);
    } else {
      // 其余：零窗口探测 [−αLocal−1, −αLocal]
      score = -negascout(child, depth - 1, -alphaLocal - 1, -alphaLocal, hooks);
      if (alphaLocal < score && score < beta) {
        // 探测失败：重搜完整窗口
        node.researched = true;
        hooks.onResearch?.(node, depth);
        score = -negascout(child, depth - 1, -beta, -score, hooks);
      }
    }
    if (score > best) best = score;
    if (best > alphaLocal) alphaLocal = best;
    if (alphaLocal >= beta) break; // β 剪枝
  }

  node.value = best;
  hooks.onReturn?.(node, best, alpha, beta, depth);
  return best;
}

/** 同一棵树上的 alpha-beta（fail-soft），用于结果对照。 */
export function alphaBetaRef(node: SearchNode, depth: number, alpha: number, beta: number): number {
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

// —— 构建一棵示例数值博弈树 —— ----------------------------------------------

/** 用 utility 数组描述的完整二叉/多叉博弈树（深度优先顺序）。 */
export function buildTree(utilities: number[], branching: number): SearchNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): SearchNode => {
    const id = `s${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: SearchNode[] = [];
    for (let k = 0; k < branching; k++) {
      children.push(make(depth - 1));
    }
    return { id, children };
  };
  // 由调用方指定深度：约定 depth = log_branching(utilities.length)
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
