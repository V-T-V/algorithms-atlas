// =============================================================================
// 粒子群优化（Particle Swarm Optimization）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 接受固定种子 rng 参数保证可复现。
// =============================================================================

/** 粒子位置/速度向量（n 维）。 */
export interface Vector {
  /** 各维坐标。 */
  v: number[];
}

export interface PsoResult {
  /** 全局最优位置。 */
  bestPosition: number[];
  /** 全局最优适应度。 */
  bestFitness: number;
  /** 实际迭代轮数。 */
  iterations: number;
  /** 是否达到收敛阈值。 */
  converged: boolean;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PsoHooks {
  /** 一轮迭代开始：粒子们的当前位置。 */
  onIteration?: (iter: number, positions: number[][]) => void;
  /** 某粒子更新了速度。 */
  onUpdateVelocity?: (i: number, velocity: number[]) => void;
  /** 某粒子更新了位置。 */
  onUpdatePosition?: (i: number, position: number[]) => void;
  /** 某粒子发现了新的个人最优。 */
  onPersonalBest?: (i: number, position: number[], fitness: number) => void;
  /** 发现了新的全局最优。 */
  onGlobalBest?: (position: number[], fitness: number) => void;
  /** 算法结束。 */
  onResult?: (result: PsoResult) => void;
}

export interface PsoOptions {
  /** 粒子数。 */
  swarmSize: number;
  /** 最大迭代轮数。 */
  maxIterations: number;
  /** 惯性权重 w。 */
  inertia: number;
  /** 认知系数 c1（自身经验）。 */
  cognitive: number;
  /** 社会系数 c2（群体经验）。 */
  social: number;
  /** 各维搜索区间 [lo, hi]。 */
  bounds: { lo: number; hi: number };
  /** 适应度阈值（小于则认为收敛）。 */
  tolerance?: number;
  /** 随机数发生器（[0,1)），保证可复现。 */
  rng: () => number;
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

/**
 * 粒子群优化（最小化 fitness）。
 *
 * 速度更新：`vᵢ = w·vᵢ + c1·r1·(pBestᵢ − xᵢ) + c2·r2·(gBest − xᵢ)`
 * 位置更新：`xᵢ = xᵢ + vᵢ`
 *
 * @param fitness 适应度函数（越小越好）
 * @param dims 维度
 * @param options 配置
 * @param hooks 可选事件钩子
 * @returns 优化结果
 */
export function pso(
  fitness: (x: number[]) => number,
  dims: number,
  options: PsoOptions,
  hooks: PsoHooks = {},
): PsoResult {
  const { swarmSize, maxIterations, inertia, cognitive, social, bounds } = options;
  const tolerance = options.tolerance ?? 1e-8;
  const rng = options.rng;
  const { lo, hi } = bounds;
  const span = hi - lo;

  // 初始化粒子位置与速度
  const positions: number[][] = [];
  const velocities: number[][] = [];
  const personalBest: number[][] = [];
  const personalBestFit: number[] = [];

  for (let i = 0; i < swarmSize; i++) {
    const pos: number[] = [];
    const vel: number[] = [];
    for (let d = 0; d < dims; d++) {
      pos.push(lo + rng() * span);
      vel.push((rng() - 0.5) * span * 0.2);
    }
    positions.push(pos);
    velocities.push(vel);
    const fit = fitness(pos);
    personalBest.push([...pos]);
    personalBestFit.push(fit);
  }

  // 初始全局最优
  let gBestIdx = 0;
  for (let i = 1; i < swarmSize; i++) {
    if (personalBestFit[i]! < personalBestFit[gBestIdx]!) gBestIdx = i;
  }
  let gBest = [...personalBest[gBestIdx]!];
  let gBestFit = personalBestFit[gBestIdx]!;
  hooks.onGlobalBest?.([...gBest], gBestFit);

  let iter = 0;
  let converged = false;

  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(
      iter,
      positions.map((p) => [...p]),
    );

    let improved = false;
    for (let i = 0; i < swarmSize; i++) {
      const pos = positions[i]!;
      const vel = velocities[i]!;
      const pBest = personalBest[i]!;

      // 速度更新
      for (let d = 0; d < dims; d++) {
        const r1 = rng();
        const r2 = rng();
        vel[d] =
          inertia * vel[d]! +
          cognitive * r1 * (pBest[d]! - pos[d]!) +
          social * r2 * (gBest[d]! - pos[d]!);
        // 速度限幅
        const vmax = span;
        if (vel[d]! > vmax) vel[d] = vmax;
        if (vel[d]! < -vmax) vel[d] = -vmax;
      }
      hooks.onUpdateVelocity?.(i, [...vel]);

      // 位置更新
      for (let d = 0; d < dims; d++) {
        pos[d] = pos[d]! + vel[d]!;
        // 边界约束：钳制到 [lo, hi]
        if (pos[d]! < lo) pos[d] = lo;
        if (pos[d]! > hi) pos[d] = hi;
      }
      hooks.onUpdatePosition?.(i, [...pos]);

      // 评估并更新个人最优
      const fit = fitness(pos);
      if (fit < personalBestFit[i]!) {
        personalBest[i] = [...pos];
        personalBestFit[i] = fit;
        hooks.onPersonalBest?.(i, [...pos], fit);
        if (fit < gBestFit) {
          gBest = [...pos];
          gBestFit = fit;
          improved = true;
          hooks.onGlobalBest?.([...gBest], gBestFit);
        }
      }
    }

    if (gBestFit <= tolerance) {
      converged = true;
      break;
    }
    // 若本轮无人改进且适应度已很小，可视为收敛（保留迭代结束）
    void improved;
  }

  const result: PsoResult = {
    bestPosition: gBest,
    bestFitness: gBestFit,
    iterations: iter,
    converged: converged || iter >= maxIterations,
  };
  hooks.onResult?.(result);
  return result;
}
