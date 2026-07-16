// =============================================================================
// L-BFGS（有限内存拟牛顿）· 纯算法实现
// 两循环递归 + 回溯（Armijo）线搜索。
// =============================================================================

export interface LBFGSResult {
  x: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

export interface LBFGSHooks {
  onIter?: (iter: number, x: number[], grad: number[], value: number, step: number) => void;
  onResult?: (r: LBFGSResult) => void;
}

/** 向量运算助手。 */
const sub = (a: number[], b: number[]): number[] => a.map((v, i) => v - b[i]!);
const add = (a: number[], b: number[]): number[] => a.map((v, i) => v + b[i]!);
const scale = (a: number[], s: number): number[] => a.map((v) => v * s);
const dot = (a: number[], b: number[]): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: number[]): number => Math.sqrt(dot(a, a));

/**
 * 两循环递归：用最近 m 对 (s,y) 计算 r ≈ H·g（H 为海森逆近似）。
 * 返回 r（用于搜索方向 p = -r，当 r 与 g 同号时为下降方向）。
 */
function twoLoopRecursion(
  sList: number[][],
  yList: number[][],
  rhoList: number[],
  g: number[],
): number[] {
  const m = sList.length;
  if (m === 0) return scale(g, -1); // 初始 H = I，方向 = -g
  const q = [...g];
  const alphas = new Array<number>(m).fill(0);
  // 第一遍（从新到旧）
  for (let i = m - 1; i >= 0; i--) {
    const rho = rhoList[i]!;
    alphas[i] = rho * dot(sList[i]!, q);
    q.forEach((_, j) => (q[j] = q[j]! - alphas[i]! * yList[i]![j]!));
  }
  // 缩放：γ = s·y / y·y
  const last = m - 1;
  const yy = dot(yList[last]!, yList[last]!);
  const sy = dot(sList[last]!, yList[last]!);
  const gamma = yy > 0 ? sy / yy : 1;
  const r = scale(q, gamma);
  // 第二遍（从旧到新）
  for (let i = 0; i < m; i++) {
    const rho = rhoList[i]!;
    const beta = rho * dot(yList[i]!, r);
    r.forEach((_, j) => (r[j] = r[j]! + (alphas[i]! - beta) * sList[i]![j]!));
  }
  return r;
}

/**
 * 回溯线搜索满足 Armijo 条件。
 * 返回步长与该步长的目标值。
 */
function lineSearch(
  f: (x: number[]) => number,
  g: (x: number[]) => number[],
  x: number[],
  fx: number,
  gx: number[],
  p: number[],
  alpha0 = 1,
  beta = 0.5,
  c1 = 1e-4,
): { alpha: number; fnew: number; xnew: number[] } {
  const pg = dot(gx, p); // 应为负
  let alpha = alpha0;
  for (let i = 0; i < 40; i++) {
    const xnew = add(x, scale(p, alpha));
    const fnew = f(xnew);
    if (fnew <= fx + c1 * alpha * pg) {
      return { alpha, fnew, xnew };
    }
    alpha *= beta;
  }
  const xnew = add(x, scale(p, alpha));
  return { alpha, fnew: f(xnew), xnew };
}

/**
 * L-BFGS。
 *
 * @param f 目标函数
 * @param g 梯度
 * @param x0 初始点
 * @param options maxIter、tol、m（历史长度）
 * @param hooks 可选钩子
 */
export function lbfgs(
  f: (x: number[]) => number,
  g: (x: number[]) => number[],
  x0: number[],
  options: { maxIter?: number; tol?: number; m?: number } = {},
  hooks: LBFGSHooks = {},
): LBFGSResult {
  const { maxIter = 100, tol = 1e-8, m = 10 } = options;
  const x = [...x0];
  let gx = g(x);
  let fx = f(x);
  const sList: number[][] = [];
  const yList: number[][] = [];
  const rhoList: number[] = [];

  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    if (norm(gx) < tol) {
      converged = true;
      break;
    }
    // 搜索方向：r ≈ H·g；p = -r
    const r = twoLoopRecursion(sList, yList, rhoList, gx);
    let p = scale(r, -1);
    // 若 p 非下降方向（r 与 g 反号），重置为最速下降
    if (dot(p, gx) >= 0) {
      p = scale(gx, -1);
    }
    const { alpha, fnew, xnew } = lineSearch(f, g, x, fx, gx, p);
    const gnew = g(xnew);
    // 记录 (s, y)
    const s = sub(xnew, x);
    const y = sub(gnew, gx);
    const sy = dot(s, y);
    if (sy > 1e-12) {
      sList.push(s);
      yList.push(y);
      rhoList.push(1 / sy);
      if (sList.length > m) {
        sList.shift();
        yList.shift();
        rhoList.shift();
      }
    }
    x.forEach((_, i) => (x[i] = xnew[i]!));
    fx = fnew;
    gx = gnew;
    hooks.onIter?.(k, [...x], [...gx], fx, alpha);
  }
  const result: LBFGSResult = { x, value: fx, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
