// =============================================================================
// 极小化极大搜索（Minimax）· 纯算法实现
// 零 DOM 依赖。用 Nim 取石子（misère 关闭：取到最后一颗者胜）作为可计算演示。
// 通过 hooks 暴露每个节点的估值过程，trace.ts 用它逐帧渲染博弈树。
// =============================================================================

/** 博弈树节点。state = 当前各堆石子数；player = 谁走。 */
export interface GameNode {
  state: number[];
  player: 'max' | 'min';
  children?: GameNode[];
  /** 该节点的 minimax 值（事后填充）。 */
  value?: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MinimaxHooks {
  /** 叶子节点被估值。 */
  onEvaluate?: (node: GameNode, score: number, depth: number) => void;
  /** 内部节点完成递归后得到值。 */
  onReturn?: (node: GameNode, value: number, depth: number) => void;
}

// —— Nim 领域 —— -------------------------------------------------------------

/** 列出 Nim 局面所有合法后继（从任一堆取 1..size 颗）。 */
export function nimChildren(state: number[]): GameNode[] {
  const out: GameNode[] = [];
  for (let heap = 0; heap < state.length; heap++) {
    const size = state[heap]!;
    for (let take = 1; take <= size; take++) {
      const next = [...state];
      next[heap] = size - take;
      out.push({ state: next, player: 'min' }); // player 由调用方修正
    }
  }
  return out;
}

/** 是否终局：所有堆为 0。 */
export function nimIsTerminal(state: number[]): boolean {
  return state.every((s) => s === 0);
}

/**
 * Nim 终局评分（站在「当前要走」的玩家视角）。
 * 当 state 全 0：上一个走的人取走了最后一颗 → 当前玩家无路可走 → 当前玩家输。
 * 用 +1/-1 表示胜负。正值表示 MAX 必胜。
 */
export function nimTerminalScore(state: number[]): number {
  return nimIsTerminal(state) ? -1 : 0; // 0 表示非终局占位
}

/** 启发式估值（非终局叶子）：用 Nim-和 的符号近似。 */
export function nimHeuristic(state: number[]): number {
  const xor = state.reduce((a, b) => a ^ b, 0);
  // Nim-和 ≠ 0 时当前玩家有必胜策略，给正分；否则负分。
  return xor !== 0 ? 1 : -1;
}

/**
 * Minimax 主函数。
 *
 * @param node 当前节点
 * @param depth 剩余搜索深度
 * @param maximizingPlayer 当前节点是 MAX 还是 MIN
 * @param hooks 可选钩子
 * @returns 该节点的 minimax 值（站在 MAX 视角）
 */
export function minimax(
  node: GameNode,
  depth: number,
  maximizingPlayer: boolean,
  hooks: MinimaxHooks = {},
): number {
  // 终局或深度耗尽
  if (nimIsTerminal(node.state) || depth === 0) {
    let score: number;
    if (nimIsTerminal(node.state)) {
      // 终局：取到最后一颗的人赢了 → 当前要走者输
      score = maximizingPlayer ? -1 : 1;
    } else {
      score = maximizingPlayer ? nimHeuristic(node.state) : -nimHeuristic(node.state);
    }
    node.value = score;
    hooks.onEvaluate?.(node, score, depth);
    return score;
  }

  // 生成后继（统一用 nim 规则）
  const rawChildren = nimChildren(node.state);
  const children: GameNode[] = rawChildren.map((c) => ({
    state: c.state,
    player: maximizingPlayer ? 'min' : 'max',
  }));
  node.children = children;

  if (maximizingPlayer) {
    let best = -Infinity;
    for (const child of children) {
      const v = minimax(child, depth - 1, false, hooks);
      if (v > best) best = v;
    }
    node.value = best;
    hooks.onReturn?.(node, best, depth);
    return best;
  } else {
    let best = Infinity;
    for (const child of children) {
      const v = minimax(child, depth - 1, true, hooks);
      if (v < best) best = v;
    }
    node.value = best;
    hooks.onReturn?.(node, best, depth);
    return best;
  }
}

/**
 * 在根节点之上做一次完整 minimax，返回根值与构建好的树。
 */
export function solve(state: number[], maxDepth: number): { root: GameNode; value: number } {
  const root: GameNode = { state, player: 'max' };
  const value = minimax(root, maxDepth, true);
  return { root, value };
}
