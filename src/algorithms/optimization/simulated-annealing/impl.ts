// =============================================================================
// 模拟退火 Simulated Annealing · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 提供通用 SA 内核 + 一个具体演示问题（最小化相邻差的平方和）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SimulatedAnnealingHooks<TState> {
  /** 每一步：当前温度、当前能量、候选能量、是否接受。 */
  onStep?: (
    iter: number,
    temp: number,
    currentEnergy: number,
    newEnergy: number,
    accept: boolean,
  ) => void;
  /** 接受了一个更差解（上坡移动）。 */
  onAcceptWorse?: (iter: number, temp: number, delta: number) => void;
  /** 发现了新的全局最优。 */
  onImprove?: (iter: number, best: TState, bestEnergy: number) => void;
}

export interface SAOptions {
  /** 初始温度。 */
  initialTemp: number;
  /** 冷却系数（每步 temp *= cooling）。应略小于 1。 */
  cooling: number;
  /** 终止温度。 */
  minTemp: number;
  /** 最大迭代步数。 */
  maxIterations: number;
  /** 随机数发生器（[0,1)）。 */
  rng: () => number;
}

export interface SAResult<TState> {
  /** 找到的最优状态。 */
  best: TState;
  /** 最优能量。 */
  bestEnergy: number;
  /** 最终状态（可能 ≠ best）。 */
  final: TState;
  /** 最终能量。 */
  finalEnergy: number;
  /** 实际迭代步数。 */
  iterations: number;
}

/**
 * 通用模拟退火内核：最小化能量函数 E(state)。
 *
 * @param initial 初始状态
 * @param neighbor 给定状态产生一个邻近状态（不修改原状态）
 * @param energy 能量函数（越小越好）
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function simulatedAnnealing<TState>(
  initial: TState,
  neighbor: (state: TState, rng: () => number) => TState,
  energy: (state: TState) => number,
  options: SAOptions,
  hooks: SimulatedAnnealingHooks<TState> = {},
): SAResult<TState> {
  const { initialTemp, cooling, minTemp, maxIterations, rng } = options;

  let current = initial;
  let currentEnergy = energy(current);
  let best = current;
  let bestEnergy = currentEnergy;
  let temp = initialTemp;

  let iter = 0;
  for (; iter < maxIterations && temp > minTemp; iter++) {
    const candidate = neighbor(current, rng);
    const newEnergy = energy(candidate);
    const delta = newEnergy - currentEnergy;

    // Metropolis 准则：更优必接受；更差按 exp(-Δ/T) 概率接受
    const accept = delta < 0 || rng() < Math.exp(-delta / temp);

    hooks.onStep?.(iter, temp, currentEnergy, newEnergy, accept);

    if (accept) {
      current = candidate;
      currentEnergy = newEnergy;
      if (delta > 0) hooks.onAcceptWorse?.(iter, temp, delta);
      if (currentEnergy < bestEnergy) {
        best = current;
        bestEnergy = currentEnergy;
        hooks.onImprove?.(iter, best, bestEnergy);
      }
    }

    temp *= cooling;
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
