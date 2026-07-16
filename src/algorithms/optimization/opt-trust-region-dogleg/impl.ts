// =============================================================================
// 信赖域 Dogleg 精确路径 · 纯算法实现
// 解析两段折线 + 半径求交；用差分海森。
// =============================================================================

export type Mat = number[][];
export type Vec = number[];

export interface DoglegResult {
  x: Vec;
  value: number;
  radius: number;
  iterations: number;
  converged: boolean;
}

export interface DoglegHooks {
  onIter?: (iter: number, x: Vec, p: Vec, stepType: string, radius: number, rho: number) => void;
  onResult?: (r: DoglegResult) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: Vec): number => Math.sqrt(dot(a, a));
const sub = (a: Vec, b: Vec): Vec => a.map((v, i) => v - b[i]!);
const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const scale = (a: Vec, s: number): Vec => a.map((v) => v * s);

function solveLinear(A: Mat, b: Vec): Vec {
  const n = A.length;
  const M: Mat = A.map((row, i) => [...row, b[i]!]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k]![i]!) > Math.abs(M[pivot]![i]!)) pivot = k;
    }
    const rowI = M[i]!;
    const rowP = M[pivot]!;
    M[i] = rowP;
    M[pivot] = rowI;
    const piv = M[i]![i]!;
    if (Math.abs(piv) < 1e-14) return new Array<number>(n).fill(0);
    for (let j = i; j <= n; j++) M[i]![j] = M[i]![j]! / piv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k]![i]!;
      for (let j = i; j <= n; j++) M[k]![j] = M[k]![j]! - factor * M[i]![j]!;
    }
  }
  return M.map((row) => row[n]!);
}

/** 数值梯度（中心差分）。 */
export function numGrad(f: (x: Vec) => number, x: Vec, h = 1e-6): Vec {
  const n = x.length;
  const g: Vec = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const xp = [...x];
    xp[i]! += h;
    const xm = [...x];
    xm[i]! -= h;
    g[i] = (f(xp) - f(xm)) / (2 * h);
  }
  return g;
}

/** 数值海森（前向差分梯度）。 */
export function numHessian(f: (x: Vec) => number, x: Vec, h = 1e-4): Mat {
  const n = x.length;
  const H: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
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
  // 对称化
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const avg = (H[i]![j]! + H[j]![i]!) / 2;
      H[i]![j] = avg;
      H[j]![i] = avg;
    }
  return H;
}

/** 判断 B 是否正定（试 Cholesky，失败视为不定）。 */
function isPositiveDefinite(B: Mat): boolean {
  const n = B.length;
  const L: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i]![j]!;
      for (let k = 0; k < j; k++) s -= L[i]![k]! * L[j]![k]!;
      if (i === j) {
        if (s <= 1e-12) return false;
        L[i]![j] = Math.sqrt(s);
      } else {
        L[i]![j] = s / L[j]![j]!;
      }
    }
  }
  return true;
}

/**
 * 求折线段 [a, a+(b−a)] 上 ‖p‖=Δ 的交点。
 * 返回交点参数 t∈[0,1]；若整段在圆内返回 1，无交返回 1。
 */
function intersectRadius(a: Vec, b: Vec, delta: number): number {
  // p(t) = a + t(b-a), 0<=t<=1；‖p‖²=Δ²
  const d = sub(b, a);
  const A = dot(d, d);
  const B = 2 * dot(a, d);
  const C = dot(a, a) - delta * delta;
  if (A < 1e-18) return 1;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return 1;
  const t = (-B + Math.sqrt(disc)) / (2 * A);
  return Math.max(0, Math.min(1, t));
}

/**
 * 解析 Dogleg：返回步长 p 与类型。
 */
export function doglegStep(g: Vec, B: Mat, delta: number): { p: Vec; type: string } {
  const gBg = dot(g, matVec(B, g));
  // Cauchy 点
  const pC = gBg > 0 ? scale(g, -dot(g, g) / gBg) : scale(g, -delta / Math.max(1e-12, norm(g)));
  if (!isPositiveDefinite(B)) {
    // 不正定：仅用 Cauchy 方向（截断）
    const npC = norm(pC);
    if (npC <= delta) return { p: pC, type: 'cauchy' };
    return { p: scale(pC, delta / npC), type: 'cauchy-truncated' };
  }
  const pN = scale(solveLinear(B, g), -1); // 牛顿点
  // 若牛顿点在域内，直接用牛顿点
  if (norm(pN) <= delta) return { p: pN, type: 'newton' };
  // 若 Cauchy 点在域外，沿 Cauchy 方向截断
  if (norm(pC) >= delta) return { p: scale(pC, delta / norm(pC)), type: 'cauchy-truncated' };
  // 否则：在 Cauchy → 牛顿 段上求交
  const t = intersectRadius(pC, pN, delta);
  const p = add(pC, scale(sub(pN, pC), t));
  return { p, type: 'dogleg' };
}

function matVec(M: Mat, v: Vec): Vec {
  return M.map((row) => row.reduce((s, m, j) => s + m * v[j]!, 0));
}

/**
 * 信赖域 Dogleg。
 *
 * @param f 目标函数
 * @param x0 初始点
 * @param options maxIter、initRadius、maxRadius、tol
 * @param hooks 可选钩子
 */
export function trustRegionDogleg(
  f: (x: Vec) => number,
  x0: Vec,
  options: { maxIter?: number; initRadius?: number; maxRadius?: number; tol?: number } = {},
  hooks: DoglegHooks = {},
): DoglegResult {
  const { maxIter = 100, initRadius = 1, maxRadius = 1e3, tol = 1e-6 } = options;
  const x = [...x0];
  let radius = initRadius;
  let fx = f(x);
  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    const g = numGrad(f, x);
    if (norm(g) < tol) {
      converged = true;
      break;
    }
    const B = numHessian(f, x);
    const { p, type } = doglegStep(g, B, radius);
    // 模型预测下降：m(0)-m(p) = -gᵀp - ½ pᵀB p
    const predicted = -dot(g, p) - 0.5 * dot(p, matVec(B, p));
    const xnew = add(x, p);
    const fnew = f(xnew);
    const actual = fx - fnew;
    const rho = predicted > 1e-14 ? actual / predicted : -1;
    if (rho < 0.25) radius = Math.max(radius * 0.25, 1e-10);
    else if (rho > 0.75 && Math.abs(norm(p) - radius) < 1e-9)
      radius = Math.min(radius * 2, maxRadius);
    if (rho > 0.1) {
      x.forEach((_, i) => (x[i] = xnew[i]!));
      fx = fnew;
    }
    hooks.onIter?.(k, [...x], [...p], type, radius, rho);
  }
  const result: DoglegResult = { x, value: fx, radius, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
