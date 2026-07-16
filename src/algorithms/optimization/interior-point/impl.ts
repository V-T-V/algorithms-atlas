// =============================================================================
// 内点法（原始-对偶路径跟踪）· 纯算法实现
// 求 max c·x  s.t.  A x ≤ b, x ≥ 0
// 引入松弛 s ≥ 0（Ax + s = b）与对偶变量 y, z ≥ 0。
// 牛顿步求解中心化 KKT 系统，μ → 0 跟踪中心路径。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface InteriorPointResult {
  solution: number[];
  optimalValue: number;
  iterations: number;
  converged: boolean;
}

export interface InteriorPointHooks {
  onIteration?: (iter: number, x: number[], objective: number, mu: number) => void;
}

export interface InteriorPointOptions {
  maxIterations?: number;
  /** 步长因子。默认 0.95。 */
  gamma?: number;
  /** 收敛阈值（对偶间隙 μ）。默认 1e-8。 */
  tolerance?: number;
  /** 中心化参数 σ（Fiacco-McCormick）。默认 0.1。 */
  sigma?: number;
}

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, mv, i) => s + mv * v[i]!, 0));
}
function matMul(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const k = b.length;
  const n = b[0]!.length;
  const c: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += a[i]![t]! * b[t]![j]!;
      c[i]![j] = s;
    }
  return c;
}
function transpose(m: number[][]): number[][] {
  const r = m.length;
  const c = m[0]!.length;
  const out: number[][] = Array.from({ length: c }, () => new Array<number>(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[j]![i]! = m[i]![j]!;
  return out;
}
function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}

/** 解线性方程组 M·x = rhs（高斯消元，加正则）。 */
function solveLinear(M: number[][], rhs: number[], reg = 1e-12): number[] {
  const n = M.length;
  const aug = M.map((row, i) => [...row.map((v) => v), rhs[i]!]);
  for (let i = 0; i < n; i++) aug[i]![i]! += reg;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    let maxAbs = Math.abs(aug[col]![col]!);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r]![col]!) > maxAbs) {
        maxAbs = Math.abs(aug[r]![col]!);
        pivot = r;
      }
    }
    [aug[col], aug[pivot]] = [aug[pivot]!, aug[col]!];
    const pv = aug[col]![col]!;
    if (Math.abs(pv) < 1e-16) continue;
    for (let j = col; j <= n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  return aug.map((row) => row[n]!);
}

/**
 * 原始-对偶路径跟踪内点法：max c·x, A x ≤ b, x ≥ 0。
 *
 * KKT 系统（最优性）：
 *   Ax + s = b（原始可行，s ≥ 0）
 *   Aᵀy + z = c（对偶可行，z ≥ 0，y 自由）
 *   X Z e = 0（互补松弛）
 *
 * @param A 约束矩阵 m×n
 * @param b 右端 m（需 > 0）
 * @param c 目标系数 n（最大化）
 */
export function interiorPoint(
  A: number[][],
  b: number[],
  c: number[],
  options: InteriorPointOptions = {},
  hooks: InteriorPointHooks = {},
): InteriorPointResult {
  const maxIter = options.maxIterations ?? 100;
  const gamma = options.gamma ?? 0.95;
  const tol = options.tolerance ?? 1e-8;
  const sigma = options.sigma ?? 0.1;
  const m = A.length;
  const n = c.length;
  const N = n + m; // 增广变量维度 w = [x; s]

  // 增广系统：G = [A | I]（m×N），max cAug·w，G w = b，w ≥ 0
  // cAug = [c | 0]，对偶变量 y（m，自由）、z（N，≥ 0）
  const Aug: number[][] = A.map((row, i) => {
    const out = new Array<number>(N).fill(0);
    for (let j = 0; j < n; j++) out[j] = row[j]!;
    out[n + i] = 1;
    return out;
  });
  const AugT = transpose(Aug);
  // 将 max c·x 转化为 min (−c)·w；故用 cEff = [−c | 0] 作为最小化目标。
  const cAug = [...c.map((v) => -v), ...new Array<number>(m).fill(0)];

  // 初始内点：x > 0, s > 0, y = 0, z > 0
  const rowAbsSum = A.map((row) => row.reduce((s, v) => s + Math.abs(v), 0) || 1);
  const k = Math.min(...b.map((bi, i) => bi / rowAbsSum[i]!)) * 0.5;
  let x = new Array<number>(n).fill(Math.max(k, 1e-2));
  let s = b.map((bi, i) => Math.max(bi - matVec(A, x)[i]!, 1e-2));
  let y = new Array<number>(m).fill(0);
  // z = [z_x; z_s]，初始化为 cAug − Gᵀy 的正部分
  let z = cAug.map((cv, j) => Math.max(cv - dot(AugT[j]!, y), 1e-3));

  let iterations = 0;
  let converged = false;
  let mu = Infinity;

  for (; iterations < maxIter; iterations++) {
    mu = dot(x, z) / n; // 互补测度
    const obj = dot(x, c);
    hooks.onIteration?.(iterations, [...x], obj, mu);

    if (mu < tol) {
      converged = true;
      iterations++;
      break;
    }

    // —— 残差（标准形式 min c·x, Ax=b, x≥0；此处用增广后的 [A|I][x;s]=b）——
    // 原始残差 ξ_p = b − G w（G=[A|I], w=[x;s]）
    const w = [...x, ...s];
    const rp = b.map((bi, i) => bi - dot(Aug[i]!, w));
    // 对偶残差 ξ_d = c_aug − Gᵀ y − z
    const rd = cAug.map((cj, j) => cj - dot(AugT[j]!, y) - z[j]!);
    // 互补残差 ξ_c = σμ e − WZ e（中心化）
    const rc = w.map((wj, j) => sigma * mu - wj * z[j]!);

    // —— 缩减方程组（标准 PDIP）：D = Z⁻¹W（对角）——
    const D = w.map((wj, j) => wj / z[j]!);
    // G D Gᵀ Δy = ξ_p + G D ξ_d − G Z⁻¹ ξ_c
    const GD = Aug.map((row) => row.map((v, j) => v * D[j]!));
    const GDGt = matMul(GD, AugT);
    const rhsY = b.map((_, i) => {
      let v = rp[i]!;
      for (let j = 0; j < N; j++)
        v += Aug[i]![j]! * D[j]! * rd[j]! - Aug[i]![j]! * (rc[j]! / z[j]!);
      return v;
    });
    const dy = solveLinear(GDGt, rhsY);

    // 回代
    // Δz = ξ_d − Gᵀ Δy
    const dz = rd.map((rj, j) => rj - dot(AugT[j]!, dy));
    // Δw = D(GᵀΔy − ξ_d + Z⁻¹ξ_c)... 用互补行：Z Δw + W Δz = ξ_c → Δw = W⁻¹(ξ_c − Z Δz... )
    // 标准回代：Δw = D(GᵀΔy − ξ_d) + Z⁻¹ξ_c
    const dw = w.map((_, j) => D[j]! * (dot(AugT[j]!, dy) - rd[j]!) + rc[j]! / z[j]!);

    // 拆分 Δw → Δx, Δs
    const dx = dw.slice(0, n);
    const ds = dw.slice(n);

    // 步长（保持 w > 0, z > 0）
    let alphaMax = 1;
    for (let j = 0; j < N; j++) {
      if (dw[j]! < 0) alphaMax = Math.min(alphaMax, -w[j]! / dw[j]!);
      if (dz[j]! < 0) alphaMax = Math.min(alphaMax, -z[j]! / dz[j]!);
    }
    const alpha = gamma * alphaMax;

    x = x.map((v, j) => v + alpha * dx[j]!);
    s = s.map((v, i) => v + alpha * ds[i]!);
    y = y.map((v, i) => v + alpha * dy[i]!);
    z = z.map((v, j) => v + alpha * dz[j]!);

    // 数值保护
    x = x.map((v) => Math.max(v, 1e-14));
    s = s.map((v) => Math.max(v, 1e-14));
    z = z.map((v) => Math.max(v, 1e-14));
  }

  return {
    solution: x,
    optimalValue: dot(x, c),
    iterations,
    converged: converged || iterations >= maxIter,
  };
}

/** 演示：max 3x₁ + 5x₂, x₁ ≤ 4, 2x₂ ≤ 12, 3x₁+2x₂ ≤ 18 → 最优 36 at (2,6)。 */
export function demoProblem(): { A: number[][]; b: number[]; c: number[]; expectZ: number } {
  const A = [
    [1, 0],
    [0, 2],
    [3, 2],
  ];
  const b = [4, 12, 18];
  const c = [3, 5];
  return { A, b, c, expectZ: 36 };
}
