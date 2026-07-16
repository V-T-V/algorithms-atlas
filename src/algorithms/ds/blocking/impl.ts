// =============================================================================
// 二维分块 Blocking 2D · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：对 R×C 矩阵做二维分块，块大小 Br×Bc ≈ √R × √C。
//   - blockSum[r][c] 预存第 (r/Br, c/Bc) 块内所有元素之和
//   - 子矩阵求和 (r1,c1)-(r2,c2)：整块取 blockSum，边缘散块逐格累加
//   - 预处理 O(RC)，单次查询 O(√(RC))
// =============================================================================

/** 二维分块查询过程中的事件钩子。任一可选。 */
export interface BlockingHooks {
  /** 预处理完成。blocksR/blocksC 为块数，Br/Bc 为块大小。 */
  onBuild?: (
    rows: number,
    cols: number,
    blocksR: number,
    blocksC: number,
    br: number,
    bc: number,
  ) => void;
  /** 子矩阵查询开始 (r1,c1)-(r2,c2)。 */
  onQueryStart?: (r1: number, c1: number, r2: number, c2: number) => void;
  /** 逐格累加（散块部分）。 */
  onCell?: (r: number, c: number) => void;
  /** 取整块 (br, bc) 的和。 */
  onBlock?: (br: number, bc: number, sum: number) => void;
  /** 查询结束，给出总和。 */
  onResult?: (sum: number) => void;
}

/**
 * 二维分块：支持子矩阵求和。
 * 查询把子矩阵分成三类区域：
 *   - 四角散格（逐格累加）
 *   - 上下中条、左右中条（逐格累加）
 *   - 中央整块（取 blockSum）
 */
export class Blocking2D {
  readonly mat: number[][];
  readonly rows: number;
  readonly cols: number;
  readonly br: number;
  readonly bc: number;
  readonly blocksR: number;
  readonly blocksC: number;
  /** blockSum[i][j] = 第 i 行块、j 列块内所有元素之和。 */
  readonly blockSum: number[][];

  constructor(matrix: readonly (readonly number[])[], hooks: BlockingHooks = {}) {
    this.mat = matrix.map((row) => [...row]);
    this.rows = this.mat.length;
    this.cols = this.rows > 0 ? this.mat[0]!.length : 0;
    this.br = Math.max(1, Math.floor(Math.sqrt(Math.max(1, this.rows))));
    this.bc = Math.max(1, Math.floor(Math.sqrt(Math.max(1, this.cols))));
    this.blocksR = Math.max(1, Math.ceil(this.rows / this.br));
    this.blocksC = Math.max(1, Math.ceil(this.cols / this.bc));
    this.blockSum = Array.from({ length: this.blocksR }, () =>
      new Array<number>(this.blocksC).fill(0),
    );
    for (let r = 0; r < this.rows; r++) {
      const bri = Math.floor(r / this.br);
      for (let c = 0; c < this.cols; c++) {
        const bci = Math.floor(c / this.bc);
        this.blockSum[bri]![bci]! += this.mat[r]![c]!;
      }
    }
    hooks.onBuild?.(this.rows, this.cols, this.blocksR, this.blocksC, this.br, this.bc);
  }

  /** 子矩阵求和 (r1,c1)-(r2,c2)（闭区间）。 */
  query(r1: number, c1: number, r2: number, c2: number, hooks: BlockingHooks = {}): number {
    if (this.rows === 0 || this.cols === 0) {
      hooks.onResult?.(0);
      return 0;
    }
    const ar = Math.max(0, r1);
    const ac = Math.max(0, c1);
    const zr = Math.min(this.rows - 1, r2);
    const zc = Math.min(this.cols - 1, c2);
    if (ar > zr || ac > zc) {
      hooks.onResult?.(0);
      return 0;
    }
    hooks.onQueryStart?.(ar, ac, zr, zc);

    // —— 逐块分解：遍历被子矩阵覆盖的所有 (行块 ri, 列块 cj) ——
    // 完全覆盖的块取 blockSum[ri][cj]；部分覆盖的块逐格累加。
    let sum = 0;
    const riStart = Math.floor(ar / this.br);
    const riEnd = Math.floor(zr / this.br);
    const cjStart = Math.floor(ac / this.bc);
    const cjEnd = Math.floor(zc / this.bc);

    for (let ri = riStart; ri <= riEnd; ri++) {
      const rLo = ri * this.br;
      const rHi = Math.min((ri + 1) * this.br - 1, this.rows - 1);
      // 该块与子矩阵的行交集
      const rowFull = ar <= rLo && rHi <= zr;
      const rrStart = Math.max(ar, rLo);
      const rrEnd = Math.min(zr, rHi);
      for (let cj = cjStart; cj <= cjEnd; cj++) {
        const cLo = cj * this.bc;
        const cHi = Math.min((cj + 1) * this.bc - 1, this.cols - 1);
        const colFull = ac <= cLo && cHi <= zc;
        if (rowFull && colFull) {
          // 完全覆盖：直接取块和
          const bs = this.blockSum[ri]![cj]!;
          sum += bs;
          hooks.onBlock?.(ri, cj, bs);
        } else {
          // 部分覆盖：逐格
          const ccStart = Math.max(ac, cLo);
          const ccEnd = Math.min(zc, cHi);
          for (let rr = rrStart; rr <= rrEnd; rr++) {
            for (let cc = ccStart; cc <= ccEnd; cc++) {
              sum += this.mat[rr]![cc]!;
              hooks.onCell?.(rr, cc);
            }
          }
        }
      }
    }

    hooks.onResult?.(sum);
    return sum;
  }

  /** 暴力子矩阵求和（用于验证）。 */
  brute(r1: number, c1: number, r2: number, c2: number): number {
    let s = 0;
    for (let r = Math.max(0, r1); r <= Math.min(this.rows - 1, r2); r++) {
      for (let c = Math.max(0, c1); c <= Math.min(this.cols - 1, c2); c++) {
        s += this.mat[r]![c]!;
      }
    }
    return s;
  }
}

/**
 * 便利函数：建二维分块并执行若干子矩阵查询，返回查询结果数组。
 */
export function blocking(
  input: { matrix: number[][]; queries: Array<[number, number, number, number]> },
  hooks: BlockingHooks = {},
): number[] {
  const b = new Blocking2D(input.matrix, hooks);
  return input.queries.map((q) => b.query(q[0], q[1], q[2], q[3], hooks));
}
