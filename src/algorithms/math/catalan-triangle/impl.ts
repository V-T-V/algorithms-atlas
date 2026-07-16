// =============================================================================
// Catalan 三角 · 纯算法实现
// T[n][k]：T(n,0)=1, T(n,k)=T(n,k-1)+T(n-1,k)。
// =============================================================================

/** 事件钩子。 */
export interface CatalanTriangleHooks {
  /** 填好第 n 行。 */
  onRow?: (n: number, row: number[]) => void;
  /** 计算单元格 T(n,k)=v。 */
  onCell?: (n: number, k: number, v: number) => void;
  /** 完成。给出 Catalan 数 C_n = T(n,n)。 */
  onDone?: (catalan: number[]) => void;
}

/**
 * Catalan 三角：构造 0..N 的三角表。
 * @returns { table, catalan } table[n][k] = T(n,k)；catalan[n] = T(n,n) = C_n
 */
export function catalanTriangle(
  N: number,
  hooks: CatalanTriangleHooks = {},
): {
  table: number[][];
  catalan: number[];
} {
  if (N < 0) throw new RangeError('catalanTriangle: N must be non-negative');
  const table: number[][] = [];
  const catalan: number[] = [];
  for (let n = 0; n <= N; n++) {
    const row = new Array<number>(n + 1).fill(0);
    row[0] = 1;
    hooks.onCell?.(n, 0, 1);
    for (let k = 1; k <= n; k++) {
      row[k] = row[k - 1]! + (table[n - 1]?.[k] ?? 0);
      hooks.onCell?.(n, k, row[k]!);
    }
    table.push(row);
    catalan.push(row[n] ?? 1);
    hooks.onRow?.(n, row);
  }
  hooks.onDone?.(catalan);
  return { table, catalan };
}
