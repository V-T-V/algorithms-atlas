// =============================================================================
// 空着裁剪（Null-Move Pruning）· 纯算法实现
// 在 α-β 基础上：在内部节点先做一次「空着」浅零窗口搜索；若仍 ≥ β 则剪枝。
// 空着 = 当前玩家不走，让对手从同一节点的子节点中选择。空着后的值（当前玩家视角）
//   = min over children of search(child, reducedDepth)  —— 对手会让当前玩家最小化。
// =============================================================================

export interface NmNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。 */
  utility?: number;
  children?: NmNode[];
  /** 搜索后填充的值。 */
  value?: number;
  /** 是否触发过空着剪枝。 */
  nullCut?: boolean;
}

export interface NullMoveConfig {
  /** 触发空着的最小剩余深度。 */
  minDepth: number;
  /** 缩减量 R。 */
  reduction: number;
  /** 是否开启空着裁剪（关闭则等价于纯 α-β）。 */
  enabled: boolean;
}

export const DEFAULT_NM_CONFIG: NullMoveConfig = {
  minDepth: 3,
  reduction: 2,
  enabled: true,
};

export interface NmHooks {
  onVisit?: (node: NmNode, depth: number, alpha: number, beta: number) => void;
  onNullTry?: (node: NmNode, depth: number, reducedDepth: number) => void;
  onNullCut?: (node: NmNode, depth: number, score: number) => void;
  onPrune?: (node: NmNode, childIndex: number) => void;
}

/**
 * 带空着裁剪的 α-β（站当前玩家视角，fail-soft）。
 *
 * 空着测试：让对手从 children 中选最优（对自己最好=对当前玩家最差），
 * 在 reducedDepth 下零窗口 [beta-1, beta] 搜索，得到 nullScore。
 * 若 nullScore >= beta，则即便送一先对手也翻不了盘 → 剪枝返回 nullScore。
 *
 * 注意：空着裁剪是启发式（牺牲精度换速度），但在「无 zugzwang」的数值树上
 * 与禁用时（等价纯 α-β）的根值在大多数情形一致；本实现禁用 enabled 后严格等价。
 */
export function alphaBetaNullMove(
  node: NmNode,
  depth: number,
  alpha: number,
  beta: number,
  config: NullMoveConfig = DEFAULT_NM_CONFIG,
  hooks: NmHooks = {},
): number {
  hooks.onVisit?.(node, depth, alpha, beta);

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }

  // 空着裁剪：在 reducedDepth 下做一次零窗口搜索
  if (
    config.enabled &&
    depth >= config.minDepth &&
    depth - 1 - config.reduction > 0 &&
    node.children.length > 0
  ) {
    const reducedDepth = depth - 1 - config.reduction;
    hooks.onNullTry?.(node, depth, reducedDepth);
    // 空着后对手从 children 选最优：nullScore（当前玩家视角）= min over children of search(child, reducedDepth)
    // 用零窗口 [beta-1, beta]（fail-hard）：只要任一子 < beta 即可继续，但为安全取 min。
    let nullScore = Infinity;
    for (const child of node.children) {
      // 对手走 child 后轮到当前玩家，negamax 取负
      const v = -alphaBetaNullMove(child, reducedDepth, -beta, -beta + 1, config, hooks);
      if (v < nullScore) nullScore = v;
      if (nullScore < beta) break; // 已不可能 >= beta
    }
    if (nullScore >= beta) {
      node.nullCut = true;
      hooks.onNullCut?.(node, depth, nullScore);
      node.value = nullScore;
      return nullScore;
    }
  }

  const children = node.children;
  let best = -Infinity;
  let a = alpha;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    const v = -alphaBetaNullMove(child, depth - 1, -beta, -a, config, hooks);
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

/** 普通 α-β（无空着），用于结果对照。等价于 enabled=false。 */
export function alphaBetaPlain(node: NmNode, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
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

// —— 构建示例博弈树 ——

export interface FlatSpec {
  utilities: number[];
  branching: number;
}

export function buildTree(spec: FlatSpec): NmNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  const make = (depth: number): NmNode => {
    const id = `nm${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: NmNode[] = [];
    for (let b = 0; b < branching; b++) children.push(make(depth - 1));
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
