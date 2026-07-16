// =============================================================================
// 无用走子裁枝（Futility Pruning）· 纯算法实现
// 在 α-β 基础上：对前沿节点（depth==1），若 staticEval + margin <= alpha，
// 则跳过深入搜索，直接返回 staticEval（近似）。
// 节点需提供 staticEval（站当前玩家视角）。
// =============================================================================

export interface FpNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。 */
  utility?: number;
  /** 静态评估值（站当前玩家视角）。叶子节点 = utility。 */
  staticEval?: number;
  children?: FpNode[];
  /** 搜索后填充的值。 */
  value?: number;
  /** 是否触发过无用裁枝。 */
  futileCut?: boolean;
}

export interface FpConfig {
  /** 触发前沿裁枝的剩余深度（默认 1）。 */
  frontierDepth: number;
  /** 边际：staticEval + margin <= alpha 才裁。 */
  margin: number;
  /** 是否开启。 */
  enabled: boolean;
}

export const DEFAULT_FP_CONFIG: FpConfig = {
  frontierDepth: 1,
  margin: 100,
  enabled: true,
};

export interface FpHooks {
  onVisit?: (node: FpNode, depth: number, alpha: number, beta: number) => void;
  onFutile?: (node: FpNode, depth: number, staticEval: number, alpha: number) => void;
  onPrune?: (node: FpNode, childIndex: number) => void;
}

export function alphaBetaFutility(
  node: FpNode,
  depth: number,
  alpha: number,
  beta: number,
  config: FpConfig = DEFAULT_FP_CONFIG,
  hooks: FpHooks = {},
): number {
  hooks.onVisit?.(node, depth, alpha, beta);

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? node.staticEval ?? 0;
  }

  // 前沿裁枝：剩余深度 == frontierDepth 且非叶子
  if (config.enabled && depth === config.frontierDepth) {
    const se = node.staticEval ?? 0;
    if (se + config.margin <= alpha) {
      node.futileCut = true;
      node.value = se;
      hooks.onFutile?.(node, depth, se, alpha);
      return se;
    }
  }

  const children = node.children;
  let best = -Infinity;
  let a = alpha;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    const v = -alphaBetaFutility(child, depth - 1, -beta, -a, config, hooks);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) {
      hooks.onPrune?.(node, i);
      break;
    }
  }

  node.value = best;
  return best;
}

/** 普通 α-β，用于结果对照。 */
export function alphaBetaPlain(node: FpNode, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? node.staticEval ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    const v = -alphaBetaPlain(child, depth - 1, -beta, -a);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

// —— 构建示例博弈树（含 staticEval）——

export interface FlatSpec {
  utilities: number[];
  branching: number;
}

export function buildTree(spec: FlatSpec): FpNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  const make = (depth: number): FpNode => {
    const id = `f${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u, staticEval: u };
    }
    const children: FpNode[] = [];
    for (let b = 0; b < branching; b++) children.push(make(depth - 1));
    // staticEval = 子节点效用的平均（站当前玩家视角的乐观近似）
    const se = Math.round(children.reduce((s, c) => s + (c.staticEval ?? 0), 0) / children.length);
    return { id, staticEval: se, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
