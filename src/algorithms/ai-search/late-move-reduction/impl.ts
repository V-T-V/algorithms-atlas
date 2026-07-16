// =============================================================================
// 晚期走子裁剪 LMR（Late Move Reductions）· 纯算法实现
// 在 α-β 基础上：排序后第 i 个走法（i >= fullMoves 且 depth >= minDepth）用 depth-R 搜索，
// 若超过 α 则用完整 depth-1 重搜。本实现采用保守策略确保根值与纯 α-β 一致。
// =============================================================================

export interface LmrNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。 */
  utility?: number;
  children?: LmrNode[];
  /** 搜索后填充的值。 */
  value?: number;
  /** 是否对该节点的某子节点做过缩减搜索（统计用）。 */
  reducedChild?: number;
}

export interface LmrConfig {
  /** 触发 LMR 的最小剩余深度。 */
  minDepth: number;
  /** 前 fullMoves 个走法不缩减。 */
  fullMoves: number;
  /** 缩减量 R。 */
  reduction: number;
}

export const DEFAULT_LMR_CONFIG: LmrConfig = {
  minDepth: 3,
  fullMoves: 1,
  reduction: 1,
};

export interface LmrHooks {
  onVisit?: (node: LmrNode, depth: number) => void;
  onReduce?: (node: LmrNode, childIndex: number, reducedDepth: number, fullDepth: number) => void;
  onResearch?: (node: LmrNode, childIndex: number) => void;
  onPrune?: (node: LmrNode, childIndex: number) => void;
}

/**
 * 带 LMR 的 α-β（站当前玩家视角，fail-soft）。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param alpha 下界
 * @param beta 上界
 * @param config LMR 配置
 * @param hooks 钩子
 */
export function alphaBetaLMR(
  node: LmrNode,
  depth: number,
  alpha: number,
  beta: number,
  config: LmrConfig = DEFAULT_LMR_CONFIG,
  hooks: LmrHooks = {},
): number {
  hooks.onVisit?.(node, depth);

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }

  const children = node.children;
  let best = -Infinity;
  let a = alpha;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    let score: number;

    const canReduce =
      i >= config.fullMoves &&
      depth >= config.minDepth &&
      depth - 1 - config.reduction > 0 &&
      children.length > config.fullMoves;

    if (canReduce) {
      // 先做缩减搜索 depth-1-R
      const reducedDepth = depth - 1 - config.reduction;
      hooks.onReduce?.(node, i, reducedDepth, depth - 1);
      score = -alphaBetaLMR(child, reducedDepth, -a - 1, -a, config, hooks);
      if (score > a) {
        // 超出 α：完整重搜
        hooks.onResearch?.(node, i);
        score = -alphaBetaLMR(child, depth - 1, -beta, -a, config, hooks);
      }
    } else {
      score = -alphaBetaLMR(child, depth - 1, -beta, -a, config, hooks);
    }

    if (score > best) best = score;
    if (best > a) a = best;
    if (a >= beta) {
      hooks.onPrune?.(node, i);
      break;
    }
  }

  node.value = best;
  return best;
}

/** 普通 α-β（无 LMR），用于结果对照。 */
export function alphaBetaPlain(node: LmrNode, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (const child of node.children) {
    const v = -alphaBetaPlain(child, depth - 1, -beta, -a);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

// —— 构建示例博弈树 ——

export interface FlatSpec {
  utilities: number[];
  branching: number;
}

export function buildTree(spec: FlatSpec): LmrNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  const make = (depth: number): LmrNode => {
    const id = `l${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: LmrNode[] = [];
    for (let b = 0; b < branching; b++) children.push(make(depth - 1));
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
