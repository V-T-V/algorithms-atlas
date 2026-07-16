// =============================================================================
// 迭代加深搜索（Iterative Deepening DFS）· 纯算法实现
// 在带 utility 的数值博弈树上工作。每层用受限 negamax 求值，
// 记录每层最佳值/最佳走法/访问节点数，支持基于 wall-clock 的时间限制。
// =============================================================================

export interface IdNode {
  id: string;
  utility?: number; // 叶子效用（站当前玩家视角）
  children?: IdNode[];
}

export interface IdHooks {
  /** 每个 depth 开始（顶层迭代）。 */
  onDepthStart?: (depth: number) => void;
  /** 每个 depth 完成。nodesVisited = 本次访问节点总数。 */
  onDepthEnd?: (depth: number, value: number, nodesVisited: number) => void;
  /** 受限搜索访问了一个节点。 */
  onVisit?: (node: IdNode, depth: number) => void;
}

export interface IdResult {
  /** 最终（最深一层）的博弈值。 */
  score: number;
  /** 达到的深度（= 完成的最大层数）。 */
  depth: number;
  /** 根节点的最佳走法索引（最深一层）。 */
  bestMove: number;
  /** 是否因超时提前终止。 */
  timedOut: boolean;
  /** 每层结果（含值、访问数、最佳走法）。 */
  history: Array<{ depth: number; value: number; nodes: number; bestMove: number }>;
}

/** 时钟函数类型（默认 Date.now，便于测试注入确定性时钟）。 */
export type Clock = () => number;

/** 单层受限 negamax（站当前玩家视角，alpha-beta 剪枝）。 */
function depthLimited(
  node: IdNode,
  depth: number,
  alpha: number,
  beta: number,
  visited: { n: number },
  deadline: number | null,
  clock: Clock,
  hooks: IdHooks,
): number | null {
  visited.n += 1;
  hooks.onVisit?.(node, depth);

  // 超时检测（每次访问都查，开销低）
  if (deadline !== null && clock() > deadline) {
    return null;
  }

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }

  let best = -Infinity;
  for (const child of node.children) {
    const v = depthLimited(child, depth - 1, -beta, -alpha, visited, deadline, clock, hooks);
    if (v === null) return null; // 超时向上传播
    const score = -v;
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/**
 * 迭代加深主函数。
 *
 * @param root 根节点
 * @param maxDepth 最大深度上限
 * @param timeLimitMs 可选时间预算（wall-clock，毫秒）。超时则停止更深迭代。
 * @param hooks 钩子
 * @param clock 可选时钟（默认 Date.now，便于测试注入确定性时钟）
 */
export function iterativeDeepening(
  root: IdNode,
  maxDepth: number,
  timeLimitMs?: number,
  hooks: IdHooks = {},
  clock: Clock = Date.now,
): IdResult {
  const deadline =
    typeof timeLimitMs === 'number' && timeLimitMs > 0 ? clock() + timeLimitMs : null;

  const history: IdResult['history'] = [];
  let lastScore = 0;
  let lastBestMove = -1;
  let lastDepth = 0;
  let timedOut = false;

  for (let d = 1; d <= maxDepth; d++) {
    hooks.onDepthStart?.(d);

    // 超时检查（在开始新一层前）
    if (deadline !== null && clock() > deadline) {
      timedOut = true;
      break;
    }

    const visited = { n: 0 };
    if (root.children === undefined || root.children.length === 0) {
      // 根是叶子
      lastScore = root.utility ?? 0;
      lastBestMove = -1;
      lastDepth = d;
      history.push({ depth: d, value: lastScore, nodes: 1, bestMove: -1 });
      hooks.onDepthEnd?.(d, lastScore, 1);
      break;
    }

    // 在根这一层显式选最佳走法
    let alpha = -Infinity;
    const beta = Infinity;
    let bestValue = -Infinity;
    let bestMove = -1;
    let completed = true;

    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i]!;
      const v = depthLimited(child, d - 1, -beta, -alpha, visited, deadline, clock, hooks);
      if (v === null) {
        completed = false;
        timedOut = true;
        break;
      }
      const score = -v;
      if (score > bestValue) {
        bestValue = score;
        bestMove = i;
      }
      if (bestValue > alpha) alpha = bestValue;
    }

    if (!completed) {
      // 本层未完成：丢弃这一层结果，保留上一层
      break;
    }

    lastScore = bestValue;
    lastBestMove = bestMove;
    lastDepth = d;
    history.push({ depth: d, value: bestValue, nodes: visited.n, bestMove });
    hooks.onDepthEnd?.(d, bestValue, visited.n);
  }

  return {
    score: lastScore,
    depth: lastDepth,
    bestMove: lastBestMove,
    timedOut,
    history,
  };
}

// —— 构建示例树 —— ------------------------------------------------------------

/** 由叶子效用数组与分支数构建完整 m 叉博弈树。 */
export function buildTree(utilities: number[], branching: number): IdNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): IdNode => {
    const id = `i${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: IdNode[] = [];
    for (let k = 0; k < branching; k++) children.push(make(depth - 1));
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
