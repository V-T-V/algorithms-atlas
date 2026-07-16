// =============================================================================
// 交替方向乘子法（ADMM）· 纯算法实现
// 标准形式：min f(x) + g(z)  s.t.  x - z = 0   （一致性约束）
// 子问题通过 prox 算子表示：
//   proxF_ρ(v) = argmin_x  f(x) + (ρ/2)‖x - v‖²
//   proxG_ρ(v) = argmin_z  g(z) + (ρ/2)‖z - v‖²
// =============================================================================

export type Vec = number[];
export type Prox = (v: Vec, rho: number) => Vec;

export interface ADMMResult {
  x: Vec;
  z: Vec;
  y: Vec;
  primalRes: number;
  dualRes: number;
  iterations: number;
  converged: boolean;
}

export interface ADMMHooks {
  onIter?: (k: number, x: Vec, z: Vec, y: Vec, primalRes: number, dualRes: number) => void;
}

const sub = (a: Vec, b: Vec): Vec => a.map((v, i) => v - b[i]!);
const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const norm2 = (a: Vec): number => Math.sqrt(a.reduce((s, v) => s + v * v, 0));

/**
 * ADMM 一致性形式：min f(x) + g(z)  s.t.  x = z
 *
 * @param proxF f 的 ρ-近端算子（输入 v，输出 argmin_x f(x) + (ρ/2)‖x-v‖²）
 * @param proxG g 的 ρ-近端算子
 * @param x0    x 初值
 * @param z0    z 初值（默认与 x0 相同）
 * @param y0    对偶变量 y 初值（默认 0 向量）
 */
export function admm(
  proxF: Prox,
  proxG: Prox,
  x0: number[],
  options: {
    rho?: number;
    maxIter?: number;
    epsAbs?: number;
    epsRel?: number;
    z0?: Vec;
    y0?: Vec;
  } = {},
  hooks: ADMMHooks = {},
): ADMMResult {
  const { rho = 1, maxIter = 500, epsAbs = 1e-6, epsRel = 1e-6 } = options;
  const n = x0.length;
  let x: Vec = [...x0];
  let z: Vec = options.z0 ? [...options.z0] : [...x0];
  let y: Vec = options.y0 ? [...options.y0] : new Array(n).fill(0);
  let primalRes = Infinity;
  let dualRes = Infinity;
  let iterations = 0;

  // 缩放形式（Boyd 2011）：y 这里其实是 u = y/ρ，乘子更新在末尾还原
  // 标准迭代：
  //   x ← proxF(z - y)
  //   z_old ← z; z ← proxG(x + y)
  //   y ← y + x - z
  for (let k = 0; k < maxIter; k++) {
    iterations = k + 1;
    // 1. x 更新
    x = proxF(sub(z, y), rho);
    // 2. z 更新
    const zOld = z;
    z = proxG(add(x, y), rho);
    // 3. 对偶更新
    const diff = sub(x, z);
    y = add(y, diff);

    // 残差
    primalRes = norm2(diff);
    dualRes = rho * norm2(sub(z, zOld));

    hooks.onIter?.(k + 1, x, z, y, primalRes, dualRes);

    // 停机判据（Boyd 标准）
    const nx = norm2(x);
    const nz = norm2(z);
    const ny = norm2(y);
    const epsPri = Math.sqrt(n) * epsAbs + epsRel * Math.max(nx, nz);
    const epsDual = Math.sqrt(n) * epsAbs + epsRel * rho * ny;
    if (primalRes <= epsPri && dualRes <= epsDual) break;
  }

  const converged =
    primalRes <= Math.sqrt(n) * epsAbs + epsRel * Math.max(norm2(x), norm2(z)) ||
    iterations < maxIter;
  return { x, z, y, primalRes, dualRes, iterations, converged: converged && primalRes < 1e-3 };
}

// =============================================================================
// 常用 prox 算子（供 trace / test 使用）
// =============================================================================

/** 软阈值（L1 prox）：prox_{(1/ρ)‖·‖₁}(v) = sign(v)·max(|v| - 1/ρ, 0) */
export const softThreshold = (v: Vec, rho: number): Vec =>
  v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - 1 / rho, 0));

/** 二次项近端：f(x) = (1/2)‖x - t‖² 的 prox 是加权平均 */
export const quadProx =
  (target: Vec) =>
  (v: Vec, rho: number): Vec =>
    v.map((vi, i) => (rho * vi + target[i]!) / (rho + 1));

/** 非负约束 prox：max(·, 0) */
export const nonnegProx = (v: Vec): Vec => v.map((x) => Math.max(x, 0));
