// =============================================================================
// 禁忌搜索 Tabu Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 提供通用禁忌搜索内核 + 一个具体演示问题（排列最小化相邻差平方和）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TabuSearchHooks<TState> {
  /** 每一轮迭代：当前状态、当前能量、本轮候选能量、是否接受（移动）。 */
  onStep?: (
    iter: number,
    current: TState,
    currentEnergy: number,
    bestEnergy: number,
    accepted: boolean,
  ) => void;
  /** 接受了一个移动（即使是禁忌但满足特赦）。 */
  onAccept?: (iter: number, move: unknown, newEnergy: number) => void;
  /** 发现了新的全局最优。 */
  onImprove?: (iter: number, best: TState, bestEnergy: number) => void;
}

export interface TabuOptions {
  /** 最大迭代轮数。 */
  maxIterations: number;
  /** 禁忌表 tenure（禁忌期限，本轮起多少步内禁用同一移动）。 */
  tabuTenure: number;
  /** 随机数发生器（[0,1)）。 */
  rng: () => number;
}

export interface TabuResult<TState> {
  /** 找到的最优状态。 */
  best: TState;
  /** 最优能量。 */
  bestEnergy: number;
  /** 最终状态。 */
  final: TState;
  /** 最终能量。 */
  finalEnergy: number;
  /** 实际迭代轮数。 */
  iterations: number;
}

/**
 * 通用禁忌搜索内核：最小化能量函数 E(state)。
 *
 * 禁忌搜索是一种**记忆型局部搜索**，核心机制：
 *
 * - 维护一个**禁忌表（tabu list）**，记录最近 `tabuTenure` 步做过的「移动」，
 *   避免立刻走回头路（防止循环震荡）；
 * - 每轮考察当前状态的邻域，在*非禁忌*移动中选「最佳」（即便它使能量上升）；
 * - **特赦准则（aspiration）**：若某禁忌移动的能量优于历史最优，则破例允许；
 * - 始终记忆全局最优解（best-so-far）。
 *
 * 与纯贪心 / 爬山相比，禁忌搜索允许暂时接受劣解、跨越局部最优陷阱，
 * 禁忌记忆防止反复横跳，从而在更广的解空间中探索。
 *
 * @param initial 初始状态
 * @param neighborhood 列出某状态的全部邻居及对应「移动标识」（用于禁忌判定）
 * @param energy 能量函数（越小越好）
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function tabuSearch<TState>(
  initial: TState,
  neighborhood: (state: TState) => Array<{ state: TState; move: string }>,
  energy: (state: TState) => number,
  options: TabuOptions,
  hooks: TabuSearchHooks<TState> = {},
): TabuResult<TState> {
  const { maxIterations, tabuTenure, rng } = options;

  let current = initial;
  let currentEnergy = energy(current);
  let best = current;
  let bestEnergy = currentEnergy;

  // 禁忌表：move → 解禁轮次（到期后可再次使用）
  const tabu = new Map<string, number>();
  // 邻域采样的扰动量（用 rng 打破平局）
  const pickTieBreak = (a: number, b: number): number =>
    Math.abs(a - b) < 1e-12 ? Math.floor(rng() * 2) * 2 - 1 : a < b ? -1 : 1;

  let iter = 0;
  for (; iter < maxIterations; iter++) {
    const neighbors = neighborhood(current);
    if (neighbors.length === 0) break;

    // 在非禁忌（或满足特赦）的邻居中选最佳
    let bestNeighborIdx = -1;
    let bestNeighborEnergy = Infinity;
    let bestMove = '';
    let bestIsTabu = false;
    for (let i = 0; i < neighbors.length; i++) {
      const cand = neighbors[i]!;
      const e = energy(cand.state);
      const isTabu = (tabu.get(cand.move) ?? -1) >= iter;
      const aspirated = isTabu && e < bestEnergy; // 特赦：打破历史最优
      if (isTabu && !aspirated) continue;
      if (bestNeighborIdx === -1 || pickTieBreak(e, bestNeighborEnergy) < 0) {
        bestNeighborIdx = i;
        bestNeighborEnergy = e;
        bestMove = cand.move;
        bestIsTabu = isTabu;
      }
    }

    if (bestNeighborIdx === -1) {
      // 所有邻居都被禁忌且无特赦 → 提前结束
      break;
    }

    const accepted = bestNeighborEnergy < currentEnergy || bestIsTabu;
    // 禁忌搜索无论是否改进，都会「移动」到最佳邻居（即使变差）
    current = neighbors[bestNeighborIdx]!.state;
    currentEnergy = bestNeighborEnergy;
    // 将该移动加入禁忌表，禁用 tabuTenure 步
    tabu.set(bestMove, iter + tabuTenure);
    hooks.onStep?.(iter, current, currentEnergy, bestEnergy, accepted);
    hooks.onAccept?.(iter, bestMove, currentEnergy);

    if (currentEnergy < bestEnergy) {
      best = current;
      bestEnergy = currentEnergy;
      hooks.onImprove?.(iter, best, bestEnergy);
    }
  }

  return { best, bestEnergy, final: current, finalEnergy: currentEnergy, iterations: iter };
}

// -----------------------------------------------------------------------------
// 演示问题：排列最小化「相邻差平方和」
// 给定一组数值，寻找其排列使 Σ (a_i − a_{i+1})² 最小。最优解为排序（升序或降序）。
// -----------------------------------------------------------------------------

/** 能量 = Σ (a_i − a_{i+1})²（相邻差的平方和）。 */
export function adjacentEnergy(arr: readonly number[]): number {
  let e = 0;
  for (let i = 0; i + 1 < arr.length; i++) {
    const d = arr[i]! - arr[i + 1]!;
    e += d * d;
  }
  return e;
}

/** 邻域：枚举所有「交换 (i,j)」的移动（i<j）。move 标识为 "i,j" 升序形式。 */
export function swapNeighborhood(arr: readonly number[]): Array<{ state: number[]; move: string }> {
  const out: Array<{ state: number[]; move: string }> = [];
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const copy = [...arr];
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
      // 移动标识用排序后的下标对，保证 (i,j) 与 (j,i) 视作同一移动
      const lo = Math.min(i, j);
      const hi = Math.max(i, j);
      out.push({ state: copy, move: `${lo},${hi}` });
    }
  }
  return out;
}

/** mulberry32 伪随机数发生器（确定性）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
