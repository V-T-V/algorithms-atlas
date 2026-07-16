// =============================================================================
// Freivalds 矩阵乘法验证 · 纯算法实现
// 随机 0/1 向量 r，验证 A(Br) == Cr。重复 k 次降错误概率。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** n×n 矩阵（行主序）。 */
export type Matrix = number[][];

/** 事件钩子。 */
export interface FreivaldsHooks {
  /** 第 trial 次试验：生成的随机向量 r。 */
  onRandomVector?: (trial: number, r: number[]) => void;
  /** 计算出 Br。 */
  onBr?: (trial: number, br: number[]) => void;
  /** 计算出 A(Br) 与 Cr 的差异向量。 */
  onCompare?: (trial: number, abr: number[], cr: number[], passed: boolean) => void;
  /** 每次试验结果。 */
  onTrial?: (trial: number, passed: boolean) => void;
  /** 最终结论（通过 = 可能正确；失败 = 一定错误）。 */
  onResult?: (verified: boolean, trialsPassed: number, totalTrials: number) => void;
}

/** 矩阵-向量乘 y = M·v。 */
export function matVec(M: Matrix, v: number[]): number[] {
  const n = M.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const row = M[i]!;
    for (let j = 0; j < row.length; j++) s += row[j]! * v[j]!;
    y[i] = s;
  }
  return y;
}

/** 矩阵乘法 C = A·B（朴素 O(n³)，用于构造测试用例）。 */
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

/** 确定性 RNG（产生 0/1）。 */
export function makeBitRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Freivalds 验证 A·B ?= C，重复 k 次。
 *
 * @param A n×n 矩阵
 * @param B n×n 矩阵
 * @param C 待验证的 n×n 矩阵
 * @param k 试验次数（错误概率 ≤ 2^−k）
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 是否通过全部试验（false ⇒ 一定 A·B≠C；true ⇒ 极可能正确）
 */
export function freivaldsVerify(
  A: Matrix,
  B: Matrix,
  C: Matrix,
  k: number = 5,
  rng: Rng = Math.random,
  hooks: FreivaldsHooks = {},
): boolean {
  const n = A.length;
  let passed = 0;
  for (let t = 0; t < k; t++) {
    // 随机 0/1 向量
    const r = new Array<number>(n);
    for (let i = 0; i < n; i++) r[i] = rng() < 0.5 ? 0 : 1;
    hooks.onRandomVector?.(t, r);

    const br = matVec(B, r);
    hooks.onBr?.(t, br);
    const abr = matVec(A, br);
    const cr = matVec(C, r);

    let trialPassed = true;
    for (let i = 0; i < n; i++) {
      if (abr[i] !== cr[i]) {
        trialPassed = false;
        break;
      }
    }
    hooks.onCompare?.(t, abr, cr, trialPassed);
    hooks.onTrial?.(t, trialPassed);
    if (!trialPassed) {
      hooks.onResult?.(false, passed, t + 1);
      return false;
    }
    passed++;
  }
  hooks.onResult?.(true, passed, k);
  return true;
}
