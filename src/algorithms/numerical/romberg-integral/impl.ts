// =============================================================================
// 龙贝格积分 · 纯算法实现
// 复化梯形 + Richardson 外推。
// =============================================================================

export interface RombergHooks {
  onRow?: (i: number, row: number[]) => void;
}

export interface RombergResult {
  /** 最佳估计 = R[n][n]。 */
  value: number;
  /** 整个 Romberg 表（R[i][0..i]）。 */
  table: number[][];
}

/** 复化梯形：在已有 n 等分梯形值 T_n 的基础上递推求 T_{2n}（复用函数值）。 */
function trapezoidRefine(
  f: (x: number) => number,
  a: number,
  b: number,
  prevT: number,
  prevN: number,
): number {
  const n = prevN * 2;
  const h = (b - a) / n;
  // 新增的点是奇数下标
  let s = 0;
  for (let i = 1; i <= prevN; i++) {
    s += f(a + (2 * i - 1) * h);
  }
  return 0.5 * prevT + h * s;
}

/**
 * 龙贝格积分。
 * @param f 被积函数
 * @param a 下限
 * @param b 上限
 * @param levels 外推层数（n），最终表为 n+1 行
 */
export function romberg(
  f: (x: number) => number,
  a: number,
  b: number,
  levels = 5,
  hooks: RombergHooks = {},
): RombergResult {
  if (levels < 1) throw new RangeError(`levels 必须 >= 1，收到 ${levels}`);
  const R: number[][] = [];
  // R[0][0] = 单梯形
  const h0 = b - a;
  R.push([0.5 * h0 * (f(a) + f(b))]);
  hooks.onRow?.(0, [...R[0]!]);

  for (let i = 1; i <= levels; i++) {
    const prevRow = R[i - 1]!;
    const newRow: number[] = [];
    // 先算 R[i][0]：细化梯形
    const prevN = Math.pow(2, i - 1);
    const t = trapezoidRefine(f, a, b, prevRow[0]!, prevN);
    newRow.push(t);
    // 外推 R[i][j] = R[i][j-1] + (R[i][j-1] - R[i-1][j-1]) / (4^j - 1)
    for (let j = 1; j <= i; j++) {
      const denom = Math.pow(4, j) - 1;
      const val = newRow[j - 1]! + (newRow[j - 1]! - prevRow[j - 1]!) / denom;
      newRow.push(val);
    }
    R.push(newRow);
    hooks.onRow?.(i, [...newRow]);
  }

  const last = R[R.length - 1]!;
  return { value: last[last.length - 1]!, table: R };
}
