// =============================================================================
// Delannoy 数 · 纯算法实现
// D(m,n) = D(m-1,n) + D(m,n-1) + D(m-1,n-1)。
// =============================================================================

/** 事件钩子。 */
export interface DelannoyHooks {
  /** 填好单元格 D(m,n)。 */
  onCell?: (m: number, n: number, value: bigint) => void;
  /** 完成。给出中心 Delannoy 序列 D(k,k)。 */
  onDone?: (central: bigint[]) => void;
}

/**
 * 构造 D 表 0..M × 0..N。
 * @returns table[m][n] = D(m,n)
 */
export function delannoyTable(M: number, N: number, hooks: DelannoyHooks = {}): bigint[][] {
  if (M < 0 || N < 0) throw new RangeError('delannoyTable: M, N must be non-negative');
  const table: bigint[][] = [];
  for (let m = 0; m <= M; m++) {
    const row = new Array<bigint>(N + 1).fill(0n);
    for (let n = 0; n <= N; n++) {
      let v: bigint;
      if (m === 0 || n === 0) v = 1n;
      else v = table[m - 1]![n]! + row[n - 1]! + table[m - 1]![n - 1]!;
      row[n] = v;
      hooks.onCell?.(m, n, v);
    }
    table.push(row);
  }
  const central: bigint[] = [];
  for (let k = 0; k <= Math.min(M, N); k++) central.push(table[k]![k]!);
  hooks.onDone?.(central);
  return table;
}

/** 单个 Delannoy 数 D(m,n)。 */
export function delannoy(m: number, n: number): bigint {
  return delannoyTable(m, n)[m]![n]!;
}
