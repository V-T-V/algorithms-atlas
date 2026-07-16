// =============================================================================
// 渴望窗口（Aspiration Window）· 纯算法实现
// 在数值博弈树上做带窄窗口/失败重搜的 alpha-beta。
// =============================================================================

export interface AwNode {
  id: string;
  utility?: number; // 叶子效用（站当前玩家视角）
  children?: AwNode[];
  value?: number;
}

export interface AwHooks {
  /** 一次（窄或全宽）搜索开始。 */
  onSearch?: (alpha: number, beta: number, wide: boolean) => void;
  /** 窄窗口失败（fail-high 或 fail-low）。 */
  onFail?: (kind: 'high' | 'low', value: number) => void;
  /** 节点访问。 */
  onVisit?: (node: AwNode) => void;
}

export interface AspirationResult {
  /** 最终博弈值。 */
  value: number;
  /** 窗口是否一次命中（无需重搜）。 */
  hit: boolean;
  /** 重搜次数（0 或 1 或 2）。 */
  researches: number;
  /** fail 方向（若有）。 */
  failKind?: 'high' | 'low';
}

/** 内部 alpha-beta（fail-soft，站当前玩家视角）。 */
function alphaBeta(
  node: AwNode,
  depth: number,
  alpha: number,
  beta: number,
  visits: { n: number },
  hooks: AwHooks,
): number {
  hooks.onVisit?.(node);
  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (const child of node.children) {
    const v = -alphaBeta(child, depth - 1, -beta, -a, visits, hooks);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

/**
 * 渴望窗口搜索主函数。
 *
 * @param root 根节点
 * @param depth 搜索深度
 * @param prevBest 上一轮最佳值（窗口中心）
 * @param window 半窗口宽度 w，搜索区间 [prevBest − w, prevBest + w]
 * @param hooks 钩子
 */
export function aspirationSearch(
  root: AwNode,
  depth: number,
  prevBest: number,
  window: number,
  hooks: AwHooks = {},
): AspirationResult {
  const visits = { n: 0 };
  const alpha = prevBest - window;
  const beta = prevBest + window;

  hooks.onSearch?.(alpha, beta, false);
  const v = alphaBeta(root, depth, alpha, beta, visits, hooks);

  // 命中：alpha < v < beta
  if (v > alpha && v < beta) {
    root.value = v;
    return { value: v, hit: true, researches: 0 };
  }

  // 失败：判定方向
  if (v <= alpha) {
    // fail-low：真实值 ≤ alpha → 用全宽重搜
    hooks.onFail?.('low', v);
    hooks.onSearch?.(-Infinity, beta, true);
    const v2 = alphaBeta(root, depth, -Infinity, beta, visits, hooks);
    root.value = v2;
    return { value: v2, hit: false, researches: 1, failKind: 'low' };
  }

  // fail-high：真实值 ≥ beta → 用全宽重搜
  hooks.onFail?.('high', v);
  hooks.onSearch?.(alpha, Infinity, true);
  const v2 = alphaBeta(root, depth, alpha, Infinity, visits, hooks);
  // 若仍 fail-high（极端），用全宽兜底
  if (v2 <= alpha) {
    hooks.onSearch?.(-Infinity, Infinity, true);
    const v3 = alphaBeta(root, depth, -Infinity, Infinity, visits, hooks);
    root.value = v3;
    return { value: v3, hit: false, researches: 2, failKind: 'high' };
  }
  root.value = v2;
  return { value: v2, hit: false, researches: 1, failKind: 'high' };
}

/** 全宽 alpha-beta 参考实现（用于对照结果）。 */
export function fullWindowSearch(root: AwNode, depth: number): number {
  const visits = { n: 0 };
  const v = alphaBeta(root, depth, -Infinity, Infinity, visits, {});
  root.value = v;
  return v;
}

// —— 构建示例树 —— ------------------------------------------------------------

export function buildTree(utilities: number[], branching: number): AwNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): AwNode => {
    const id = `a${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: AwNode[] = [];
    for (let k = 0; k < branching; k++) children.push(make(depth - 1));
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
