// =============================================================================
// Star1 剪枝 · 纯算法实现
// expectimax 的 chance 节点用 Star1 概率上下界剪枝。
// 节点类型：MAX / CHANCE。叶子带 utility。
// =============================================================================

export type NodeType = 'max' | 'chance';

export interface StarNode {
  id: string;
  type: NodeType;
  /** 叶子效用。 */
  utility?: number;
  /** chance 节点的子节点概率（与 children 一一对应，和为 1）。 */
  probs?: number[];
  /** 叶子的值上/下界（用于 Star1 剪枝）。缺省为 ±∞。 */
  lo?: number;
  hi?: number;
  children?: StarNode[];
  /** 搜索后填充的值。 */
  value?: number;
}

export interface StarConfig {
  /** 叶子效用的全局上下界（用于机会节点的剪枝计算）。 */
  valueLo: number;
  valueHi: number;
  /** 是否开启 Star1。 */
  enabled: boolean;
}

export const DEFAULT_STAR_CONFIG: StarConfig = {
  valueLo: -1000,
  valueHi: 1000,
  enabled: true,
};

export interface StarHooks {
  onVisit?: (node: StarNode, alpha: number, beta: number, depth: number) => void;
  onChanceChild?: (node: StarNode, childIndex: number) => void;
  onPruneHigh?: (node: StarNode, childIndex: number, axU: number, alpha: number) => void;
  onPruneLow?: (node: StarNode, childIndex: number, axL: number, beta: number) => void;
}

/**
 * 带 Star1 的 expectimax（MAX-chance 交替）。
 *
 * @param node 当前节点
 * @param alpha 下界（仅在 MAX 节点使用）
 * @param beta 上界
 * @param config 配置
 * @param hooks 钩子
 */
export function star1Search(
  node: StarNode,
  alpha: number,
  beta: number,
  config: StarConfig = DEFAULT_STAR_CONFIG,
  hooks: StarHooks = {},
): number {
  return starSearch(node, alpha, beta, config, hooks, 0);
}

function starSearch(
  node: StarNode,
  alpha: number,
  beta: number,
  config: StarConfig,
  hooks: StarHooks,
  depth: number,
): number {
  hooks.onVisit?.(node, alpha, beta, depth);

  if (node.children === undefined || node.children.length === 0) {
    const v = node.utility ?? 0;
    node.value = v;
    return v;
  }

  if (node.type === 'max') {
    let best = -Infinity;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]!;
      const v = starSearch(child, alpha, beta, config, hooks, depth + 1);
      if (v > best) best = v;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    node.value = best;
    return best;
  }

  // chance 节点
  const probs = node.probs ?? node.children.map(() => 1 / node.children!.length);
  const vLo = config.valueLo;
  const vHi = config.valueHi;

  let ax = 0; // 已展开子节点的加权累计
  let remainingU = 0; // 未展开子节点的 Σ p_i · u_i
  let remainingL = 0; // 未展开子节点的 Σ p_i · l_i
  for (let i = 0; i < node.children.length; i++) {
    remainingU += probs[i]! * vHi;
    remainingL += probs[i]! * vLo;
  }

  let result = 0;
  for (let i = 0; i < node.children.length; i++) {
    const p = probs[i]!;
    hooks.onChanceChild?.(node, i);
    // Star1 上界剪枝：若 ax + remainingU < alpha（当前无法达到 alpha）
    if (config.enabled && ax + remainingU < alpha) {
      hooks.onPruneHigh?.(node, i, ax + remainingU, alpha);
      // 该 chance 节点不可能 ≥ alpha → 返回一个 < alpha 的下界估计
      result = ax + remainingU;
      node.value = result;
      return result;
    }
    // Star1 下界剪枝：若 ax + remainingL > beta
    if (config.enabled && ax + remainingL > beta) {
      hooks.onPruneLow?.(node, i, ax + remainingL, beta);
      result = ax + remainingL;
      node.value = result;
      return result;
    }
    // 更新剩余上/下界
    remainingU -= p * vHi;
    remainingL -= p * vLo;
    // 搜索子节点（窗口为 [vLo, vHi]，因为 chance 的最终值在 [ax + 剩余下界, ax + 剩余上界] 之间）
    const childVal = starSearch(node.children[i]!, vLo, vHi, config, hooks, depth + 1);
    ax += p * childVal;
  }

  result = ax;
  node.value = result;
  return result;
}

/** 精确 expectimax（无剪枝），用于结果对照。 */
export function expectimaxPlain(node: StarNode): number {
  if (node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  if (node.type === 'max') {
    let best = -Infinity;
    for (const c of node.children) {
      const v = expectimaxPlain(c);
      if (v > best) best = v;
    }
    return best;
  }
  const probs = node.probs ?? node.children.map(() => 1 / node.children!.length);
  let sum = 0;
  for (let i = 0; i < node.children.length; i++) {
    sum += probs[i]! * expectimaxPlain(node.children[i]!);
  }
  return sum;
}

// —— 构建示例期望博弈树 ——

/** 一个简单的两层期望树：根 MAX -> chance -> 叶子。 */
export function buildExampleTree(): StarNode {
  return {
    id: 'r',
    type: 'max',
    children: [
      {
        id: 'c1',
        type: 'chance',
        probs: [0.5, 0.5],
        children: [
          { id: 'c1a', type: 'max', utility: 10 },
          { id: 'c1b', type: 'max', utility: 20 },
        ],
      },
      {
        id: 'c2',
        type: 'chance',
        probs: [0.25, 0.75],
        children: [
          { id: 'c2a', type: 'max', utility: 5 },
          { id: 'c2b', type: 'max', utility: 30 },
        ],
      },
      {
        id: 'c3',
        type: 'chance',
        probs: [0.1, 0.9],
        children: [
          { id: 'c3a', type: 'max', utility: -100 },
          { id: 'c3b', type: 'max', utility: 40 },
        ],
      },
    ],
  };
}

/** 构建更深的树：MAX-chance-MAX-叶子。 */
export function buildDeepTree(branching: number, utilities: number[], probs2: number[]): StarNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): StarNode => {
    const id = `s${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, type: 'max', utility: u };
    }
    const type: NodeType = depth % 2 === 1 ? 'max' : 'chance';
    const children: StarNode[] = [];
    for (let b = 0; b < branching; b++) children.push(make(depth - 1));
    const node: StarNode = { id, type, children };
    if (type === 'chance') node.probs = probs2.slice(0, branching);
    return node;
  };
  return make(3);
}
