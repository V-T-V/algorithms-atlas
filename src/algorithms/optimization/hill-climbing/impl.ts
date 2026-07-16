// =============================================================================
// 爬山算法（Hill Climbing）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 提供通用爬山内核 + 一个具体演示问题（最小化相邻差平方和）。
// 随机算法：接受固定种子 rng 保证可复现。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HillClimbingHooks<TState> {
  /** 每一步：当前能量、候选能量、是否接受（移动）。 */
  onStep?: (iter: number, currentEnergy: number, candidateEnergy: number, accept: boolean) => void;
  /** 接受了更优的邻居，状态发生移动。 */
  onMove?: (iter: number, newEnergy: number) => void;
  /** 发现了新的全局最优。 */
  onImprove?: (iter: number, best: TState, bestEnergy: number) => void;
  /** 到达局部最优（无邻居更优），算法终止。 */
  onLocalOptimum?: (iter: number, energy: number) => void;
}

export interface HCOptions {
  /** 最大迭代步数。 */
  maxIterations: number;
  /** 每步从邻域中采样的候选数量（最速上升爬山用）。 */
  sampleSize: number;
  /** 随机数发生器（[0,1)）。固定种子可复现。 */
  rng: () => number;
}

export interface HCResult<TState> {
  /** 找到的最优状态。 */
  best: TState;
  /** 最优能量。 */
  bestEnergy: number;
  /** 最终状态（可能 = best）。 */
  final: TState;
  /** 最终能量。 */
  finalEnergy: number;
  /** 实际迭代步数。 */
  iterations: number;
}

/**
 * 通用爬山内核（最陡上升版 / steepest-ascent）：最小化能量函数 E(state)。
 *
 * 每一步从当前状态的邻域中采样 `sampleSize` 个候选，挑出能量最低者；
 * 若它比当前更优则移动，否则到达局部最优、终止。
 *
 * 特点：实现简单、收敛快，但容易陷入**局部最优**（不如模拟退火能跳出）。
 * 改进版有「随机重启爬山」「模拟退火」等。
 *
 * @param initial 初始状态
 * @param neighbor 给定状态产生一个邻近状态（不修改原状态）
 * @param energy 能量函数（越小越好）
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function hillClimbing<TState>(
  initial: TState,
  neighbor: (state: TState, rng: () => number) => TState,
  energy: (state: TState) => number,
  options: HCOptions,
  hooks: HillClimbingHooks<TState> = {},
): HCResult<TState> {
  const { maxIterations, sampleSize, rng } = options;

  let current = initial;
  let currentEnergy = energy(current);
  let best = current;
  let bestEnergy = currentEnergy;

  let iter = 0;
  for (; iter < maxIterations; iter++) {
    // 采样若干邻居，取最优
    let candidate = current;
    let candidateEnergy = currentEnergy;
    for (let s = 0; s < sampleSize; s++) {
      const nb = neighbor(current, rng);
      const ne = energy(nb);
      if (ne < candidateEnergy) {
        candidate = nb;
        candidateEnergy = ne;
      }
    }

    const accept = candidateEnergy < currentEnergy;
    hooks.onStep?.(iter, currentEnergy, candidateEnergy, accept);

    if (accept) {
      current = candidate;
      currentEnergy = candidateEnergy;
      hooks.onMove?.(iter, currentEnergy);
      if (currentEnergy < bestEnergy) {
        best = current;
        bestEnergy = currentEnergy;
        hooks.onImprove?.(iter, best, bestEnergy);
      }
    } else {
      // 无更优邻居 → 局部最优
      hooks.onLocalOptimum?.(iter, currentEnergy);
      iter++; // 把这一步计入
      break;
    }
  }

  return {
    best,
    bestEnergy,
    final: current,
    finalEnergy: currentEnergy,
    iterations: Math.min(iter, maxIterations),
  };
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

/** 邻域操作：随机交换两个位置（返回新数组）。 */
export function swapNeighbor(arr: readonly number[], rng: () => number): number[] {
  const n = arr.length;
  if (n < 2) return [...arr];
  const a = Math.floor(rng() * n);
  let b = Math.floor(rng() * n);
  while (b === a) b = Math.floor(rng() * n);
  const out = [...arr];
  [out[a], out[b]] = [out[b]!, out[a]!];
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
