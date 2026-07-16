// =============================================================================
// 和声搜索（Harmony Search）· 纯算法实现（零 DOM 依赖，可独立单测）
// 模拟乐师即兴演奏寻找最佳和声：以记忆库（HM）+ 音调微调 + 随机选择三种机制搜索。
// 演示问题：在 [-10,10]² 上最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HarmonySearchHooks {
  /** 每次即兴（一个新和声）：迭代号、新和声、其目标值、当前记忆库最优值。 */
  onImprovise?: (iter: number, harmony: number[], value: number, bestInMemory: number) => void;
}

/** 和声搜索返回结果。 */
export interface HarmonySearchResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

/** Mulberry32 确定性伪随机（可复现）。 */
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
 * 和声搜索（Harmony Search, Geem 2001）。
 *
 * 把每个解看作一段「和声」（每维是一个音符），维护规模 `HMS` 的记忆库 HM（精英解集合）。
 * 每次即兴产生一个新和声，每个音符（维度）有三种来源：
 *
 * 1. **记忆库选择（概率 HMCR）**：从 HM 中该维的历史值里随机取一个
 *    - 若来自记忆库，再以概率 `PAR` 做**音调微调**：`x ← x ± bw·rand()`（在邻域微调）
 * 2. **随机选取（概率 1−HMCR）**：在取值域内均匀随机取
 *
 * 新和声若优于 HM 中最差者则替换；如此迭代至收敛。
 *
 * 直观理解：HMCR 利用「历史好经验」，1−HMCR 探索「全新可能」，PAR 在好解附近精调——
 * 三者构成经典的「利用 vs 探索」平衡。比纯随机搜索高效，参数直觉强（来自音乐）。
 *
 * **优点**：实现简单、参数少且物理意义直观、对离散/组合问题易改造（音符可为离散值）。
 * **缺点**：理论上等价于某种进化策略，性能不如 DE/CMA-ES 强；连续问题上常需小 bw。
 *
 * 典型参数：`HMS=20~100`、`HMCR=0.7~0.95`、`PAR=0.1~0.5`、`bw=0.01·取值域`。
 * 本实现用固定种子伪随机保证可复现。演示在 `[-10,10]²` 上收敛到 (3,-1)。
 *
 * 时间复杂度 `O(k·n)`（每次即兴，HMCR 分支常数时间），空间 `O(HMS·n)`。
 *
 * @param f 目标函数
 * @param bounds 每维的 [下界, 上界]
 * @param options HMS（记忆库规模）、HMCR、PAR、bw（音调微调带宽）、maxIter、tol、seed
 * @param hooks 可选的事件钩子
 */
export function harmonySearch(
  f: (x: number[]) => number,
  bounds: Array<[number, number]>,
  options: {
    HMS?: number;
    HMCR?: number;
    PAR?: number;
    bw?: number;
    maxIter?: number;
    tol?: number;
    seed?: number;
  } = {},
  hooks: HarmonySearchHooks = {},
): HarmonySearchResult {
  const n = bounds.length;
  const span = bounds.reduce((s, [lo, hi]) => s + (hi - lo), 0) / n;
  const {
    HMS = 30,
    HMCR = 0.9,
    PAR = 0.3,
    bw = 0.05 * span,
    maxIter = 5000,
    tol = 1e-12,
    seed = 42,
  } = options;
  const rng = mulberry32(seed);

  // 初始化记忆库：HMS 个随机和声
  const memory: Array<{ x: number[]; fx: number }> = [];
  for (let i = 0; i < HMS; i++) {
    const x = bounds.map(([lo, hi]) => lo + rng() * (hi - lo));
    memory.push({ x, fx: f(x) });
  }
  const sortMemory = (): void => {
    memory.sort((a, b) => a.fx - b.fx);
  };
  sortMemory();

  const clampVal = (val: number, d: number): number => {
    const [lo, hi] = bounds[d]!;
    return Math.min(hi, Math.max(lo, val));
  };

  let iterations = 0;
  let converged = false;

  for (let iter = 1; iter <= maxIter; iter++) {
    iterations = iter;
    const best = memory[0]!;
    if (best.fx < tol) {
      converged = true;
      break;
    }

    // 即兴一个新和声
    const x = new Array(n);
    for (let d = 0; d < n; d++) {
      if (rng() < HMCR) {
        // 从记忆库取该维
        const pick = memory[Math.floor(rng() * HMS)]!.x[d]!;
        let val = pick;
        if (rng() < PAR) {
          // 音调微调
          val = pick + bw * (rng() * 2 - 1);
        }
        x[d] = clampVal(val, d);
      } else {
        // 随机选取
        const [lo, hi] = bounds[d]!;
        x[d] = lo + rng() * (hi - lo);
      }
    }
    const fx = f(x);
    hooks.onImprovise?.(iter, [...x], fx, best.fx);

    // 若优于最差则替换
    const worst = memory[HMS - 1]!;
    if (fx < worst.fx) {
      memory[HMS - 1]! = { x, fx };
      sortMemory();
    }
  }

  const best = memory[0]!;
  return { params: [...best.x], value: best.fx, iterations, converged };
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
