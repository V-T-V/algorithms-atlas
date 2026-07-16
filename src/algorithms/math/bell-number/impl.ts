// =============================================================================
// 贝尔数（Bell Number）· 纯算法实现
// B(n) = n 个不同元素划分为任意多个非空集合的方案数。
//   利用 Bell 三角：a[0][0]=1；a[i][0]=a[i-1][i-1]；a[i][j]=a[i-1][j-1]+a[i][j-1]。
//   B(n) = a[n][0]。也可用 B(n) = Σ_k S(n,k)（第二类 Stirling 数之和）。
// =============================================================================

export interface BellHooks {
  onRow?: (i: number, row: number[]) => void;
  onResult?: (val: number) => void;
}

/** 计算 B(0..n)，取 mod。返回 Bell 三角的同时返回 B(n)。 */
export function bellNumber(n: number, mod: number, hooks: BellHooks = {}): number {
  if (n < 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 0) {
    hooks.onRow?.(0, [1 % mod]);
    hooks.onResult?.(1 % mod);
    return 1 % mod;
  }
  // Bell 三角（仅维护当前行）
  let row: number[] = [1 % mod];
  hooks.onRow?.(0, [...row]);
  let bell = row[0]!;
  for (let i = 1; i <= n; i++) {
    const next: number[] = new Array<number>(i + 1);
    next[0] = row[row.length - 1]!; // a[i][0] = a[i-1][i-1]
    for (let j = 1; j <= i; j++) {
      next[j] = (next[j - 1]! + row[j - 1]!) % mod;
    }
    row = next;
    bell = row[0]!;
    hooks.onRow?.(i, [...row]);
  }
  hooks.onResult?.(bell);
  return bell;
}

/** BigInt 精确 B(n)。 */
export function bellNumberBig(n: number): bigint {
  if (n < 0) return 0n;
  if (n === 0) return 1n;
  let row: bigint[] = [1n];
  for (let i = 1; i <= n; i++) {
    const next: bigint[] = new Array<bigint>(i + 1);
    next[0] = row[row.length - 1]!;
    for (let j = 1; j <= i; j++) {
      next[j] = next[j - 1]! + row[j - 1]!;
    }
    row = next;
  }
  return row[0]!;
}
