// =============================================================================
// 差分进化（Differential Evolution, DE）· 纯算法实现（零 DOM 依赖，可独立单测）
// 经典 DE/rand/1/bin：种群中每个体由「另三个随机个体之差」驱动变异，贪心替换。
// 演示问题：在 [-10,10]² 上最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 一个个体：决策向量 + 目标值。 */
export interface DEIndividual {
  x: number[];
  fx: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DEHooks {
  /** 每代结束：代数、当前最优个体、整个种群。 */
  onGeneration?: (gen: number, best: DEIndividual, pop: DEIndividual[]) => void;
}

/** 差分进化返回结果。 */
export interface DEResult {
  params: number[];
  value: number;
  generations: number;
  converged: boolean;
}

/** 简单确定性伪随机源（可复现，便于可视化与单测）。Mulberry32。 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 差分进化（DE/rand/1/bin 变体）。
 *
 * 维护规模 `NP` 的种群，每代对每个目标个体 `x_i` 做三件事：
 *
 * 1. **变异**：随机选三个不同个体 `r1,r2,r3`，`v = x_r1 + F·(x_r2 − x_r3)`（差分向量驱动）
 * 2. **交叉**：对 `v` 与 `x_i` 逐维做二项交叉，得试探个体 `u`（至少保留 1 维来自 `v`）
 * 3. **选择**：若 `f(u) ≤ f(x_i)` 则用 `u` 替换 `x_i`（贪心）
 *
 * 直观理解：「用种群自身的差异作为变异方向」——当多个个体都朝某方向偏移时，
 * 该方向的差分被放大，指引搜索。这是 DE 比传统遗传算法更高效的关键。
 *
 * **优点**：控制参数少（`F∈[0.4,1]`、`CR∈[0,1]`、`NP=5n~10n`）、连续优化上收敛快而稳、全局搜索能力强。
 * **缺点**：对离散/组合问题需改造；高维时 NP 增大、代价上升。
 *
 * 本实现用固定种子的伪随机以保证可复现。演示在 `[-10,10]²` 上收敛到 (3,-1)。
 *
 * 时间复杂度 `O(g·NP·n)`，空间 `O(NP·n)`。
 *
 * @param f 目标函数
 * @param bounds 每维的 [下界, 上界]
 * @param options NP（种群规模）、F（缩放因子）、CR（交叉概率）、maxGen、tol、seed
 * @param hooks 可选的事件钩子
 */
export function differentialEvo(
  f: (x: number[]) => number,
  bounds: Array<[number, number]>,
  options: {
    NP?: number;
    F?: number;
    CR?: number;
    maxGen?: number;
    tol?: number;
    seed?: number;
  } = {},
  hooks: DEHooks = {},
): DEResult {
  const n = bounds.length;
  const {
    NP = Math.max(10, 5 * n),
    F = 0.7,
    CR = 0.9,
    maxGen = 300,
    tol = 1e-10,
    seed = 42,
  } = options;
  const rng = mulberry32(seed);

  // 初始化种群：每维在界内均匀随机
  const pop: DEIndividual[] = [];
  for (let i = 0; i < NP; i++) {
    const x = bounds.map(([lo, hi]) => lo + rng() * (hi - lo));
    pop.push({ x, fx: f(x) });
  }

  const bestIdx = (): number => {
    let bi = 0;
    for (let i = 1; i < NP; i++) if (pop[i]!.fx < pop[bi]!.fx) bi = i;
    return bi;
  };

  let generations = 0;
  let converged = false;

  for (let gen = 1; gen <= maxGen; gen++) {
    generations = gen;
    let improved = false;
    for (let i = 0; i < NP; i++) {
      // 选三个与 i 不同的随机索引
      const idx: number[] = [];
      while (idx.length < 3) {
        const r = Math.floor(rng() * NP);
        if (r !== i && !idx.includes(r)) idx.push(r);
      }
      const a = idx[0]!;
      const b = idx[1]!;
      const c = idx[2]!;
      const xa = pop[a]!.x;
      const xb = pop[b]!.x;
      const xc = pop[c]!.x;

      // 变异 v = xa + F*(xb - xc)，并裁剪到界内
      const v = xa.map((val, d) => {
        const raw = val + F * (xb[d]! - xc[d]!);
        const [lo, hi] = bounds[d]!;
        return Math.min(hi, Math.max(lo, raw));
      });

      // 交叉（二项）：至少一维来自 v
      const j0 = Math.floor(rng() * n);
      const u = pop[i]!.x.map((val, d) => (d === j0 || rng() < CR ? v[d]! : val));
      const fu = f(u);
      if (fu <= pop[i]!.fx) {
        pop[i]! = { x: u, fx: fu };
        improved = true;
      }
    }
    const bi = bestIdx();
    hooks.onGeneration?.(
      gen,
      { ...pop[bi]!, x: [...pop[bi]!.x] },
      pop.map((p) => ({ ...p, x: [...p.x] })),
    );
    if (pop[bi]!.fx < tol) {
      converged = true;
      break;
    }
    if (!improved && gen > 20) {
      // 连续无改进：可视为停滞（这里宽松处理，仅记录）
    }
  }

  const bi = bestIdx();
  return { params: [...pop[bi]!.x], value: pop[bi]!.fx, generations, converged };
}

/** 演示目标函数：f(x,y) = (x-3)² + (y+1)²。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}

/** 演示搜索域。 */
export const demoBounds: Array<[number, number]> = [
  [-10, 10],
  [-10, 10],
];
