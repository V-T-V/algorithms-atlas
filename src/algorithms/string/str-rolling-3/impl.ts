// =============================================================================
// 滚动哈希：定长滑动窗口哈希
// =============================================================================

const BASE = 131n;
const MOD = 1_000_000_007n;

export interface RollingHooks {
  onInit?: (hash: bigint) => void;
  onRoll?: (i: number, hash: bigint) => void;
  onDone?: (hashes: bigint[]) => void;
}

/** 返回所有长度为 k 的窗口的哈希值，按起点下标排序。 */
export function rollingHash(s: string, k: number, hooks: RollingHooks = {}): bigint[] {
  const n = s.length;
  if (k <= 0 || k > n) return [];
  // 最高位权重 = BASE^(k-1) mod MOD
  let high = 1n;
  for (let i = 0; i < k - 1; i++) high = (high * BASE) % MOD;
  let h = 0n;
  for (let i = 0; i < k; i++) {
    h = (h * BASE + BigInt(s.charCodeAt(i))) % MOD;
  }
  hooks.onInit?.(h);
  const result: bigint[] = [h];
  for (let i = 1; i + k <= n; i++) {
    const out = (BigInt(s.charCodeAt(i - 1)) * high) % MOD;
    h = ((h - out + MOD) % MOD) % MOD;
    h = (h * BASE) % MOD;
    h = (h + BigInt(s.charCodeAt(i + k - 1))) % MOD;
    hooks.onRoll?.(i, h);
    result.push(h);
  }
  hooks.onDone?.(result);
  return result;
}
