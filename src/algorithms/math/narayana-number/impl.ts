// =============================================================================
// Narayana 数 · 纯算法实现
// N(n,k) = (1/n)·C(n,k)·C(n,k-1)。BigInt 精确。
// =============================================================================

/** 事件钩子。 */
export interface NarayanaHooks {
  /** 完成第 n 行。 */
  onRow?: (n: number, row: bigint[]) => void;
  /** 单值 N(n,k)。 */
  onValue?: (n: number, k: number, value: bigint) => void;
  /** 完成。给出 Catalan 行和序列。 */
  onDone?: (catalan: bigint[]) => void;
}

function binom(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let r = 1n;
  for (let i = 0; i < k; i++) r = (r * BigInt(n - i)) / BigInt(i + 1);
  return r;
}

/**
 * 构造 Narayana 三角第 1..N 行。
 * @returns table[n][k] = N(n,k)
 */
export function narayanaTriangle(N: number, hooks: NarayanaHooks = {}): bigint[][] {
  if (N < 0) throw new RangeError('narayanaTriangle: N must be non-negative');
  const table: bigint[][] = [];
  const catalan: bigint[] = [];
  for (let n = 1; n <= N; n++) {
    const row: bigint[] = [];
    let rowSum = 0n;
    for (let k = 1; k <= n; k++) {
      const v = (binom(n, k) * binom(n, k - 1)) / BigInt(n);
      row.push(v);
      rowSum += v;
      hooks.onValue?.(n, k, v);
    }
    table.push(row);
    catalan.push(rowSum);
    hooks.onRow?.(n, row);
  }
  hooks.onDone?.(catalan);
  return table;
}

/** 单个 Narayana 数 N(n,k)。 */
export function narayana(n: number, k: number): bigint {
  if (n <= 0 || k < 1 || k > n) return 0n;
  return (binom(n, k) * binom(n, k - 1)) / BigInt(n);
}
