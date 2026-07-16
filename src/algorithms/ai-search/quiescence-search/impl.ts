// =============================================================================
// 静止搜索（Quiescence Search）· 纯算法实现
// 在带 "capture 标记" 的数值博弈树上工作。
// children 分两类：capture（活跃走法，继续搜）与 quiet（静止走法）。
// 到达深度限制后，只递归 capture 走法直到局面静止，再静态估值。
// =============================================================================

export interface QsNode {
  id: string;
  /** 叶子的静态估值（站当前玩家视角）。 */
  staticEval?: number;
  children?: Array<{ moveId: number; isCapture: boolean; node: QsNode }>;
  /** 搜索后填充。 */
  value?: number;
}

export interface QsHooks {
  /** 静态估值发生（局面静止，调用 standPat）。 */
  onStandPat?: (node: QsNode, evalScore: number) => void;
  /** 沿某 capture 走法递归下降。 */
  onCapture?: (parent: QsNode, moveId: number) => void;
  /** 节点搜索完成。 */
  onReturn?: (node: QsNode, value: number) => void;
}

/**
 * 静止搜索（带 alpha-beta 的 stand-pat 版本，站当前玩家视角）。
 * 当没有 capture 走法可走（或 capture 全被剪枝）时返回 standPat（静态估值）。
 *
 * @param node 当前节点
 * @param alpha 下界
 * @param beta 上界
 * @param hooks 钩子
 */
export function quiescence(node: QsNode, alpha: number, beta: number, hooks: QsHooks = {}): number {
  const standPat = node.staticEval ?? 0;
  hooks.onStandPat?.(node, standPat);

  if (standPat >= beta) {
    node.value = standPat;
    hooks.onReturn?.(node, standPat);
    return standPat;
  }
  if (standPat > alpha) alpha = standPat;

  // 没有 capture 子节点 → 局面静止 → 返回 standPat
  const captures = node.children?.filter((c) => c.isCapture).map((c) => c) ?? [];

  if (captures.length === 0) {
    node.value = standPat;
    hooks.onReturn?.(node, standPat);
    return standPat;
  }

  let best = standPat;
  for (const cap of captures) {
    hooks.onCapture?.(node, cap.moveId);
    const v = -quiescence(cap.node, -beta, -alpha, hooks);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break; // δ 剪枝
  }

  node.value = best;
  hooks.onReturn?.(node, best);
  return best;
}

/**
 * 主搜索（深度受限 alpha-beta）+ 到深度限制时调用 quiescence。
 * 提供完整 "alpha-beta + quiescence" 组合。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param alpha 下界
 * @param beta 上界
 * @param hooks 钩子
 */
export function alphaBetaWithQuiescence(
  node: QsNode,
  depth: number,
  alpha: number,
  beta: number,
  hooks: QsHooks = {},
): number {
  if (depth === 0) {
    return quiescence(node, alpha, beta, hooks);
  }
  if (node.children === undefined || node.children.length === 0) {
    return node.staticEval ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (const child of node.children) {
    const v = -alphaBetaWithQuiescence(child.node, depth - 1, -beta, -a, hooks);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

// —— 构建示例：一个"可吃子链"局面 —— ----------------------------------------
// 静态估值偏低（-3），但存在一条 capture 链最终能翻盘（+5）。
// quiescence 应发现这条链而非止于 -3。

export function buildCaptureChain(): QsNode {
  let counter = 0;
  let moveId = 0;
  const id = (): string => `q${counter++}`;

  // 最深叶子：估值 +5（吃掉关键子后明显占优）
  const deepGood: QsNode = { id: id(), staticEval: 5 };
  // 中间：一个 capture 走法通向 deepGood
  const mid: QsNode = {
    id: id(),
    staticEval: -2,
    children: [{ moveId: moveId++, isCapture: true, node: deepGood }],
  };
  // 根：静止估值 -3，但有一个 capture 通向 mid
  const root: QsNode = {
    id: id(),
    staticEval: -3,
    children: [{ moveId: moveId++, isCapture: true, node: mid }],
  };
  return root;
}
