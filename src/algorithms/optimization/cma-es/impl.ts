// =============================================================================
// CMA-ES（协方差矩阵适应进化策略）· 纯算法实现（零 DOM 依赖，可独立单测）
// 实现简洁稳定的 sep-CMA-ES（可分/对角协方差版本）：
//   高斯采样 + 精英重组 + CSA 路径步长控制 + rank-μ 对角协方差更新。
// 演示问题：在 [-10,10]² 上最小化 f(x,y) = (x-3)² + (y+1)²，最优解 (3,-1)。
// 完整全协方差 CMA-ES 请参考 Hansen 的官方参考实现。
// =============================================================================

/** 一个个体：决策向量 + 目标值。 */
export interface CMAIndividual {
  x: number[];
  fx: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CMAHooks {
  /** 每代结束：代数、当前最优个体、均值向量、当前步长 σ。 */
  onGeneration?: (gen: number, best: CMAIndividual, mean: number[], sigma: number) => void;
}

/** CMA-ES 返回结果。 */
export interface CMAResult {
  params: number[];
  value: number;
  generations: number;
  converged: boolean;
}

/** Mulberry32 确定性伪随机 + Box-Muller 标准正态。 */
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
 * 可分 CMA-ES（sep-CMA-ES）。
 *
 * 维护搜索分布 `N(m, σ²·C)`，其中 `C = diag(c_d²)`（对角协方差）。每代：
 *
 * 1. 采样 `λ` 个 `y_k ~ N(0, C)`，子代 `x_k = m + σ·y_k`
 * 2. 评估并排序，取前 μ 个精英
 * 3. **重组均值**：`m ← m + c_m·σ·yw`，`yw = Σ w_i·y_(i)`（精英加权方向）
 * 4. **步长自适应（CSA）**：维护进化路径 `p_σ`，比较其长度与期望 `E‖N(0,I)‖`，
 *    长则放大 σ（方向一致、应加速）、短则缩小
 * 5. **协方差更新**：`C ← (1−c_cov)·C + c_cov·yw·ywᵀ / ‖yw‖²`（沿成功方向拉伸）
 *
 * 直观理解：CMA-ES 不仅用种群找方向，还**学习问题的几何形状**——协方差 `C` 记录
 * 「哪个维度该走大步、哪个该走小步」，相当于自学的预条件器。这让它在高维、
 * 非凸、病态、噪声等最难的黑盒连续优化上表现卓越。
 *
 * sep-CMA-ES 把全协方差限制为对角，代价 `O(n)` 而非 `O(n²)`，适合中等维数且实现简洁。
 * 完整 CMA-ES 用全协方差矩阵 + rank-μ 更新 + IPOP 重启。
 *
 * **优点**：黑盒强优化、对病态/噪声鲁棒、几乎不需调参。
 * **缺点**：每代评估 λ 次；理论复杂；全协方差版高维代价大。
 *
 * 演示在 `[-10,10]²` 上收敛到 (3,-1)。
 *
 * 时间复杂度 `O(g·λ·n)`，空间 `O(λ·n)`。
 *
 * @param f 目标函数
 * @param bounds 每维的 [下界, 上界]
 * @param options sigma0（初始步长）、lambda（子代数）、maxGen、tol、seed
 * @param hooks 可选的事件钩子
 */
export function cmaEs(
  f: (x: number[]) => number,
  bounds: Array<[number, number]>,
  options: { sigma0?: number; lambda?: number; maxGen?: number; tol?: number; seed?: number } = {},
  hooks: CMAHooks = {},
): CMAResult {
  const n = bounds.length;
  const span = bounds.reduce((s, [lo, hi]) => s + (hi - lo), 0) / n;
  const {
    sigma0 = span * 0.3,
    lambda = 4 + Math.floor(3 * Math.log(n)),
    maxGen = 800,
    tol = 1e-12,
    seed = 42,
  } = options;
  const rngU = mulberry32(seed);
  let spareNormal: number | null = null;
  const randn = (): number => {
    if (spareNormal !== null) {
      const v = spareNormal;
      spareNormal = null;
      return v;
    }
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = rngU() * 2 - 1;
      v = rngU() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const mul = Math.sqrt((-2 * Math.log(s)) / s);
    spareNormal = v * mul;
    return u * mul;
  };

  const mean = bounds.map(([lo, hi]) => (lo + hi) / 2);
  let sigma = sigma0;
  const C = new Array(n).fill(1); // 对角协方差 c_d²，初始 1
  const sqrtC = new Array(n).fill(1); // c_d
  let bestEver: CMAIndividual = { x: [...mean], fx: f(mean) };

  const mu = Math.max(1, Math.floor(lambda / 2));
  const rawW: number[] = [];
  for (let i = 0; i < mu; i++) rawW.push(Math.log(mu + 0.5) - Math.log(i + 1));
  const wSum = rawW.reduce((s, x) => s + x, 0) || 1;
  const weights = rawW.map((w) => w / wSum);
  const mueff = 1 / weights.reduce((s, w) => s + w * w, 0); // 有效选择质量

  // CSA 与协方差参数
  const cm = 1;
  const cs = (mueff + 2) / (n + mueff + 5);
  const ds = 1 + 2 * Math.max(0, Math.sqrt((mueff - 1) / (n + 1)) - 1) + cs;
  const cc = (4 + mueff / n) / (n + 4 + (2 * mueff) / n);
  const c1 = 2 / ((n + 1.3) ** 2 + mueff);
  const cmu = Math.min(1 - c1, (2 * (mueff - 2 + 1 / mueff)) / ((n + 2) ** 2 + mueff));
  const chiN = Math.sqrt(n) * (1 - 1 / (4 * n) + 1 / (21 * n * n)); // E‖N(0,I)‖

  const ps = new Array(n).fill(0); // p_σ 路径
  const pc = new Array(n).fill(0); // p_c 路径

  const clampVal = (val: number, d: number): number => {
    const [lo, hi] = bounds[d]!;
    return Math.min(hi, Math.max(lo, val));
  };

  let generations = 0;
  let converged = false;

  for (let gen = 1; gen <= maxGen; gen++) {
    generations = gen;
    const offspring: Array<{ x: number[]; fx: number; y: number[]; z: number[] }> = [];
    for (let k = 0; k < lambda; k++) {
      const z = new Array(n); // 标准正态
      const y = new Array(n); // C^(1/2) z
      for (let d = 0; d < n; d++) {
        z[d] = randn();
        y[d] = sqrtC[d]! * z[d]!;
      }
      const x = mean.map((m, d) => clampVal(m + sigma * y[d]!, d));
      offspring.push({ x, fx: f(x), y, z });
    }
    offspring.sort((a, b) => a.fx - b.fx);
    if (offspring[0]!.fx < bestEver.fx) {
      bestEver = { x: [...offspring[0]!.x], fx: offspring[0]!.fx };
    }
    hooks.onGeneration?.(gen, bestEver, [...mean], sigma);
    if (bestEver.fx < tol) {
      converged = true;
      break;
    }

    // 精英加权方向（在 C 空间 y，与标准空间 z）
    const yw = new Array(n).fill(0);
    const zw = new Array(n).fill(0);
    for (let i = 0; i < mu; i++) {
      for (let d = 0; d < n; d++) {
        yw[d]! += weights[i]! * offspring[i]!.y[d]!;
        zw[d]! += weights[i]! * offspring[i]!.z[d]!;
      }
    }

    // 更新 p_σ（用 z，对 C 解相关）
    const invSqrtC = sqrtC.map((s) => 1 / s); // diag(C)^(-1/2)
    for (let d = 0; d < n; d++) {
      ps[d]! = (1 - cs) * ps[d]! + Math.sqrt(cs * (2 - cs) * mueff) * (invSqrtC[d]! * yw[d]!);
    }
    const psNorm = Math.sqrt(ps.reduce((s, x) => s + x * x, 0));
    // 步长更新
    sigma *= Math.exp((psNorm / chiN - 1) / ds);
    sigma = Math.max(1e-14, Math.min(sigma, span * 1e3));

    // h_σ 门控
    const hSig =
      psNorm / Math.sqrt(1 - (1 - cs) ** (2 * generations)) / chiN < 1.4 + 2 / (n + 1) ? 1 : 0;

    // 更新 p_c（用 y）
    for (let d = 0; d < n; d++) {
      pc[d]! = (1 - cc) * pc[d]! + hSig * Math.sqrt(cc * (2 - cc) * mueff) * yw[d]!;
    }

    // 对角协方差更新：C = (1-c1-cmu)C + c1·pc² + cmu·Σ w_i y_i²
    for (let d = 0; d < n; d++) {
      let rankMu = 0;
      for (let i = 0; i < mu; i++)
        rankMu += weights[i]! * offspring[i]!.y[d]! * offspring[i]!.y[d]!;
      C[d]! = (1 - c1 - cmu) * C[d]! + c1 * pc[d]! * pc[d]! + cmu * rankMu;
      C[d]! = Math.max(C[d]!, 1e-20);
      sqrtC[d]! = Math.sqrt(C[d]!);
    }

    // 更新均值
    for (let d = 0; d < n; d++) mean[d]! += cm * sigma * yw[d]!;
    for (let d = 0; d < n; d++) mean[d]! = clampVal(mean[d]!, d);
  }

  const fMean = f(mean);
  if (fMean < bestEver.fx) bestEver = { x: [...mean], fx: fMean };

  return { params: [...bestEver.x], value: bestEver.fx, generations, converged };
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
