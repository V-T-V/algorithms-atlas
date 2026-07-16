// =============================================================================
// 信赖域方法（Dogleg）· 纯算法实现
// 二次模型 + Dogleg 子问题近似 + ρ 自适应半径。
// 梯度/Hessian 用数值差分。零 DOM 依赖，可独立单测。
// =============================================================================

export interface TrustRegionResult {
  x: number[];
  value: number;
  radius: number;
  iterations: number;
  converged: boolean;
}

export interface TrustRegionHooks {
  onIteration?: (iter: number, x: number[], radius: number, value: number, rho: number) => void;
}

export interface TrustRegionOptions {
  maxIterations?: number;
  /** 初始信赖域半径。默认 1。 */
  initRadius?: number;
  /** 最大半径。默认 1e3。 */
  maxRadius?: number;
  /** 梯度收敛阈值。默认 1e-6。 */
  tolerance?: number;
}

/** 数值梯度（中心差分）。 */
function numGrad(f: (x: number[]) => number, x: number[], h = 1e-6): number[] {
  const n = x.length;
  const g = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const xp = [...x];
    xp[i]! += h;
    const xm = [...x];
    xm[i]! -= h;
    g[i] = (f(xp) - f(xm)) / (2 * h);
  }
  return g;
}

/** 数值 Hessian（前向差分梯度）。 */
function numHessian(f: (x: number[]) => number, x: number[], h = 1e-4): number[][] {
  const n = x.length;
  const H: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const f0 = f(x);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const xpp = [...x];
      xpp[i]! += h;
      xpp[j]! += h;
      const xpm = [...x];
      xpm[i]! += h;
      xpm[j]! -= h;
      const xmp = [...x];
      xmp[i]! -= h;
      xmp[j]! += h;
      const xmm = [...x];
      xmm[i]! -= h;
      xmm[j]! -= h;
      H[i]![j] = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4 * h * h);
    }
  }
  void f0;
  return H;
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}
function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}
function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, mv, i) => s + mv * v[i]!, 0));
}

/**
 * Dogleg 信赖域步长：在 Cauchy 点 p_C 与牛顿点 p_N 间折线选择。
 * 返回满足 ‖p‖ ≤ Δ 的步。
 */
function dogleg(grad: number[], B: number[][], delta: number): number[] {
  const n = grad.length;
  // 牛顿方向 p_N = −B⁻¹ g（用加正则高斯消元解 B p = −g）
  const aug = B.map((row, i) => [...row, -grad[i]!]);
  for (let i = 0; i < n; i++) aug[i]![i]! += 1e-8;
  // 高斯消元
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
    if (Math.abs(pv) < 1e-14) break; // B 奇异，退到 Cauchy
    for (let j = col; j <= n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      for (let j = col; j <= n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  const pN = aug.map((row) => row[n]!);

  // Cauchy 点 p_C = −(gᵀg / gᵀBg) g
  const gBg = dot(grad, matVec(B, grad));
  const pC = gBg > 1e-14 ? grad.map((v) => -(dot(grad, grad) / gBg) * v) : grad.map((v) => -v);

  if (norm(pN) <= delta) return pN; // 牛顿步在域内
  if (norm(pC) >= delta) {
    // 沿 Cauchy 方向截断
    return pC.map((v) => (delta / norm(pC)) * v);
  }
  // 在 p_C 与 p_N 之间的折线上找 ‖·‖ = Δ
  // p(τ) = p_C + τ(p_N − p_C)，τ ∈ [0,1]
  // ‖p_C + τ d‖² = Δ²，d = p_N − p_C
  const d = pN.map((v, i) => v - pC[i]!);
  const a = dot(d, d);
  const b = 2 * dot(pC, d);
  const c = dot(pC, pC) - delta * delta;
  const disc = Math.max(b * b - 4 * a * c, 0);
  const tau = (-b + Math.sqrt(disc)) / (2 * a);
  return pC.map((v, i) => v + tau * d[i]!);
}

/** 二次模型值 m(p) = f + gᵀp + ½ pᵀB p。 */
function modelValue(f: number, grad: number[], B: number[][], p: number[]): number {
  return f + dot(grad, p) + 0.5 * dot(p, matVec(B, p));
}

/**
 * 信赖域方法（Dogleg）。
 *
 * @param f 目标函数
 * @param x0 初始点
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function trustRegion(
  f: (x: number[]) => number,
  x0: number[],
  options: TrustRegionOptions = {},
  hooks: TrustRegionHooks = {},
): TrustRegionResult {
  const maxIter = options.maxIterations ?? 200;
  let delta = options.initRadius ?? 1;
  const maxRadius = options.maxRadius ?? 1e3;
  const tol = options.tolerance ?? 1e-6;

  let x = [...x0];
  let fx = f(x);
  let iterations = 0;
  let converged = false;

  for (; iterations < maxIter; iterations++) {
    const grad = numGrad(f, x);
    if (norm(grad) < tol) {
      converged = true;
      iterations++;
      break;
    }
    const B = numHessian(f, x);

    // 子问题：求步 p
    const p = dogleg(grad, B, delta);
    const modelReduction =
      modelValue(fx, grad, B, new Array(p.length).fill(0)) - modelValue(fx, grad, B, p);

    // 候选点
    const xNew = x.map((v, i) => v + p[i]!);
    const fNew = f(xNew);
    const actualReduction = fx - fNew;
    const rho = modelReduction > 1e-15 ? actualReduction / modelReduction : 0;

    hooks.onIteration?.(iterations, [...x], delta, fx, rho);

    // 调整 Δ
    if (rho < 0.25) delta = Math.max(0.25 * delta, 1e-8);
    else if (rho > 0.75 && Math.abs(norm(p) - delta) < 1e-6) delta = Math.min(2 * delta, maxRadius);

    // 接受/拒绝
    if (rho > 0) {
      x = xNew;
      fx = fNew;
    }
  }

  return {
    x,
    value: fx,
    radius: delta,
    iterations,
    converged: converged || iterations >= maxIter,
  };
}

/** 演示：Rosenbrock 最优 (1,1)。 */
export function rosenbrock(p: number[]): number {
  return (1 - p[0]!) ** 2 + 100 * (p[1]! - p[0]! ** 2) ** 2;
}

/** 演示：球面 (x−3)²+(y+1)² 最优 (3,−1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
