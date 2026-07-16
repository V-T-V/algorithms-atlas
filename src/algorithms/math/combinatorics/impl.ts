// =============================================================================
// 组合数 Combinatorics · 纯算法实现
// 预处理阶乘表与阶乘逆元表，O(1) 查询 C(n,k)、A(n,k)，模素数 p（默认 1e9+7）。
// 同时提供杨辉三角（无模数、精确整数）。零 DOM 依赖，可独立单测。
// =============================================================================

/** 默认模数 1e9+7（素数）。 */
export const COMB_MOD = 1000000007n;

/** 预处理好的阶乘表。 */
export interface CombTable {
  /** fact[i] = i! mod p */
  fact: bigint[];
  /** invFact[i] = (i!)^(-1) mod p */
  invFact: bigint[];
  /** 模数 */
  mod: bigint;
  /** 表覆盖的最大 n */
  maxN: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CombinatoricsHooks {
  /** 预处理：算出 fact[i] = i!。 */
  onFact?: (i: number, value: bigint) => void;
  /** 预处理：算出 invFact[i] = (i!)^(-1) mod p。 */
  onInvFact?: (i: number, value: bigint) => void;
  /** 查询 C(n, k) 得到结果。 */
  onQuery?: (n: number, k: number, value: bigint) => void;
}

/** BigInt 快速幂：base^exp mod m。 */
export function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = ((base % m) + m) % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/**
 * 预处理 [0..N] 的阶乘表 fact 与阶乘逆元表 invFact（费马小定理）。
 *
 * - `fact[0]=1`，`fact[i] = fact[i-1] · i mod p`
 * - `invFact[N] = fact[N]^(p-2) mod p`（费马小定理求逆元）
 * - 倒推 `invFact[i] = invFact[i+1] · (i+1) mod p`
 *
 * 时间 `O(N)`，空间 `O(N)`。
 *
 * 之后即可 `O(1)` 查询：`C(n,k) = fact[n] · invFact[k] · invFact[n-k] mod p`。
 */
export function buildCombTable(
  N: number,
  mod: bigint = COMB_MOD,
  hooks: CombinatoricsHooks = {},
): CombTable {
  if (N < 0) throw new RangeError('buildCombTable: N must be ≥ 0');
  const fact = new Array<bigint>(N + 1).fill(1n);
  const invFact = new Array<bigint>(N + 1).fill(1n);
  fact[0] = 1n;
  hooks.onFact?.(0, 1n);
  for (let i = 1; i <= N; i++) {
    fact[i] = (fact[i - 1]! * BigInt(i)) % mod;
    hooks.onFact?.(i, fact[i]!);
  }
  // 费马小定理求 N! 的逆元
  invFact[N] = powMod(fact[N]!, mod - 2n, mod);
  hooks.onInvFact?.(N, invFact[N]!);
  for (let i = N - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1]! * BigInt(i + 1)) % mod;
    hooks.onInvFact?.(i, invFact[i]!);
  }
  return { fact, invFact, mod, maxN: N };
}

/**
 * `O(1)` 查询组合数 `C(n, k) mod p`（要求 0 ≤ k ≤ n ≤ maxN）。
 *
 * `C(n,k) = n! / (k! (n-k)!) = fact[n] · invFact[k] · invFact[n-k] mod p`。
 *
 * 越界（k<0 或 k>n）返回 0。
 */
export function comb(
  table: CombTable,
  n: number,
  k: number,
  hooks: CombinatoricsHooks = {},
): bigint {
  if (k < 0 || k > n || n < 0) {
    hooks.onQuery?.(n, k, 0n);
    return 0n;
  }
  const v =
    (((table.fact[n]! * table.invFact[k]!) % table.mod) * table.invFact[n - k]!) % table.mod;
  hooks.onQuery?.(n, k, v);
  return v;
}

/**
 * `O(1)` 查询排列数 `A(n, k) = n! / (n-k)! mod p`。
 */
export function perm(table: CombTable, n: number, k: number): bigint {
  if (k < 0 || k > n || n < 0) return 0n;
  return (table.fact[n]! * table.invFact[n - k]!) % table.mod;
}

/**
 * **杨辉三角**：精确整数（BigInt，无模数）。返回前 `rows` 行，每行是 C(row, 0..row)。
 *
 * 递推：`C(n,k) = C(n-1,k-1) + C(n-1,k)`，边界 `C(n,0)=C(n,n)=1`。
 */
export function pascalTriangle(rows: number): bigint[][] {
  if (rows <= 0) return [];
  const tri: bigint[][] = [];
  for (let n = 0; n < rows; n++) {
    const row = new Array<bigint>(n + 1);
    row[0] = 1n;
    row[n] = 1n;
    for (let k = 1; k < n; k++) {
      row[k] = tri[n - 1]![k - 1]! + tri[n - 1]![k]!;
    }
    tri.push(row);
  }
  return tri;
}

/**
 * 暴力 `C(n, k)` 用 BigInt 计算（无模数，用于交叉校验，n 不宜过大）。
 */
export function combBig(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let r = 1n;
  for (let i = 0; i < k; i++) {
    r = (r * BigInt(n - i)) / BigInt(i + 1);
  }
  return r;
}
