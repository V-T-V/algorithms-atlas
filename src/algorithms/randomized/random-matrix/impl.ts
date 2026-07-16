// =============================================================================
// 随机矩阵生成 · 纯算法实现
// 提供均匀/伯努利/高斯三种分布的随机矩阵生成 + 基本矩阵运算。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 矩阵（行主序）。 */
export type Matrix = number[][];

/** 事件钩子。 */
export interface RandomMatrixHooks {
  /** 填充第 r 行。 */
  onRow?: (r: number, row: number[]) => void;
  /** 完成生成。 */
  onDone?: (M: Matrix) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 生成 m×n 均匀分布 [a,b) 矩阵。 */
export function randomUniformMatrix(
  m: number,
  n: number,
  a: number = 0,
  b: number = 1,
  rng: Rng = Math.random,
  hooks: RandomMatrixHooks = {},
): Matrix {
  const M: Matrix = [];
  for (let i = 0; i < m; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) row.push(a + (b - a) * rng());
    M.push(row);
    hooks.onRow?.(i, row);
  }
  hooks.onDone?.(M);
  return M;
}

/** 生成 m×n 伯努利 0/1 矩阵。 */
export function randomBernoulliMatrix(
  m: number,
  n: number,
  rng: Rng = Math.random,
  hooks: RandomMatrixHooks = {},
): Matrix {
  const M: Matrix = [];
  for (let i = 0; i < m; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) row.push(rng() < 0.5 ? 0 : 1);
    M.push(row);
    hooks.onRow?.(i, row);
  }
  hooks.onDone?.(M);
  return M;
}

/**
 * 生成 m×n 高斯矩阵 N(μ,σ²)，用 Box-Muller 变换。
 */
export function randomGaussianMatrix(
  m: number,
  n: number,
  mu: number = 0,
  sigma: number = 1,
  rng: Rng = Math.random,
  hooks: RandomMatrixHooks = {},
): Matrix {
  const M: Matrix = [];
  let spare: number | null = null;
  const boxMuller = (): number => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return mu + sigma * v;
    }
    let u1 = rng();
    const u2 = rng();
    while (u1 === 0) u1 = rng();
    const mag = Math.sqrt(-2 * Math.log(u1));
    const z0 = mag * Math.cos(2 * Math.PI * u2);
    const z1 = mag * Math.sin(2 * Math.PI * u2);
    spare = z1;
    return mu + sigma * z0;
  };
  for (let i = 0; i < m; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) row.push(boxMuller());
    M.push(row);
    hooks.onRow?.(i, row);
  }
  hooks.onDone?.(M);
  return M;
}

/** 矩阵-向量乘 y = M·v。 */
export function matVec(M: Matrix, v: number[]): number[] {
  const rows = M.length;
  const cols = M[0]?.length ?? 0;
  const y = new Array<number>(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    let s = 0;
    const row = M[i]!;
    for (let j = 0; j < cols; j++) s += row[j]! * v[j]!;
    y[i] = s;
  }
  return y;
}

/** 矩阵乘 C = A·B。 */
export function matMul(A: Matrix, B: Matrix): Matrix {
  const n = A.length;
  const m = B[0]!.length;
  const p = B.length;
  const C: Matrix = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(m).fill(0);
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let k = 0; k < p; k++) s += A[i]![k]! * B[k]![j]!;
      row[j] = s;
    }
    C.push(row);
  }
  return C;
}

/** 转置。 */
export function transpose(M: Matrix): Matrix {
  const rows = M.length;
  const cols = M[0]?.length ?? 0;
  const T: Matrix = [];
  for (let j = 0; j < cols; j++) {
    const row: number[] = [];
    for (let i = 0; i < rows; i++) row.push(M[i]![j]!);
    T.push(row);
  }
  return T;
}

/**
 * Freivalds 风格验证 A·B=C：随机 0/1 向量 r，检查 A(Br)=Cr。
 * @returns 是否通过（true=极可能正确）
 */
export function freivaldsCheck(A: Matrix, B: Matrix, C: Matrix, rng: Rng = Math.random): boolean {
  const n = A.length;
  const r: number[] = [];
  for (let i = 0; i < n; i++) r.push(rng() < 0.5 ? 0 : 1);
  const br = matVec(B, r);
  const abr = matVec(A, br);
  const cr = matVec(C, r);
  for (let i = 0; i < n; i++) if (abr[i] !== cr[i]) return false;
  return true;
}
