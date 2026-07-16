// =============================================================================
// 第一类 Stirling 数（无符号）· 纯算法实现
// s(n,k) = 把 n 个不同元素排成 k 个非空「圆排列」的方案数（无符号，记 [n k]）。
//   递推：s(n,k) = s(n-1,k-1) + (n-1)·s(n-1,k)；s(0,0)=1，s(n,0)=0(n>0)，s(0,k)=0(k>0)。
//   性质：x^(n↓m) 关系；n! = Σ_k s(n,k)。
// =============================================================================

export interface StirlingFirstHooks {
  onCell?: (n: number, k: number, val: number) => void;
  onResult?: (val: number) => void;
}

/** 计算 s(n,k)，取 mod。返回前 n 行的完整表。 */
export function stirlingFirstTable(
  n: number,
  mod: number,
  hooks: StirlingFirstHooks = {},
): number[][] {
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  table[0]![0] = 1 % mod;
  hooks.onCell?.(0, 0, table[0]![0]!);
  for (let i = 1; i <= n; i++) {
    for (let k = 1; k <= i; k++) {
      table[i]![k] = (table[i - 1]![k - 1]! + ((i - 1) % mod) * table[i - 1]![k]!) % mod;
      hooks.onCell?.(i, k, table[i]![k]!);
    }
  }
  return table;
}

/** 仅求 s(n,k)。 */
export function stirlingFirst(
  n: number,
  k: number,
  mod: number,
  hooks: StirlingFirstHooks = {},
): number {
  if (k < 0 || k > n || n < 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const table = stirlingFirstTable(n, mod);
  const val = table[n]![k]!;
  hooks.onResult?.(val);
  return val;
}

/** 精确 BigInt 求解 s(n,k)。 */
export function stirlingFirstBig(n: number, k: number): bigint {
  if (k < 0 || k > n || n < 0) return 0n;
  const table: bigint[][] = Array.from({ length: n + 1 }, () => new Array<bigint>(n + 1).fill(0n));
  table[0]![0] = 1n;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      table[i]![j] = table[i - 1]![j - 1]! + BigInt(i - 1) * table[i - 1]![j]!;
    }
  }
  return table[n]![k]!;
}
