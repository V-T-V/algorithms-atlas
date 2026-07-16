// =============================================================================
// 欧拉数（排列）· 纯算法实现
// ⟨n,k⟩ = (k+1)⟨n-1,k⟩ + (n-k)⟨n-1,k-1⟩。
// =============================================================================

/** 事件钩子。 */
export interface EulerNumberHooks {
  /** 填好第 n 行。 */
  onRow?: (n: number, row: number[]) => void;
  /** 单元格 ⟨n,k⟩=v。 */
  onCell?: (n: number, k: number, v: number) => void;
  /** 完成。 */
  onDone?: (N: number) => void;
}

/**
 * 欧拉数三角：构造 0..N 行。
 * @returns table[n][k] = ⟨n,k⟩
 */
export function eulerianTriangle(N: number, hooks: EulerNumberHooks = {}): number[][] {
  if (N < 0) throw new RangeError('eulerianTriangle: N must be non-negative');
  const table: number[][] = [];
  for (let n = 0; n <= N; n++) {
    const row = new Array<number>(n).fill(0);
    for (let k = 0; k < n; k++) {
      let v: number;
      if (n === 0) v = 0;
      else if (k === 0) v = 1;
      else v = (k + 1) * (table[n - 1]![k] ?? 0) + (n - k) * (table[n - 1]![k - 1] ?? 0);
      row[k] = v;
      hooks.onCell?.(n, k, v);
    }
    table.push(row);
    hooks.onRow?.(n, row);
  }
  hooks.onDone?.(N);
  return table;
}

/** 单个欧拉数 ⟨n,k⟩。 */
export function eulerianNumber(n: number, k: number): number {
  if (n <= 0 || k < 0 || k >= n) return 0;
  const table = eulerianTriangle(n);
  return table[n]![k]!;
}
