// =============================================================================
// 大数组合数 · BigInt 递推
// =============================================================================

export interface LargeCombineHooks {
  onStep?: (k: number, value: bigint) => void;
}

export function largeCombine(n: number, k: number, hooks: LargeCombineHooks = {}): bigint {
  if (k < 0 || k > n) return 0n;
  // 利用对称性减小循环
  if (k > n - k) k = n - k;
  let result = 1n;
  for (let i = 1; i <= k; i++) {
    // result = result * (n - i + 1) / i，由于 C(n,i) 是整数，先乘后除总整除
    result = (result * BigInt(n - i + 1)) / BigInt(i);
    hooks.onStep?.(i, result);
  }
  return result;
}
